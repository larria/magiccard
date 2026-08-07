# 数据层

卡牌数据是游戏的核心：903 个主题、14860 张卡牌、7673 条合成规则。数据预编译为 JSON，运行时通过 `src/data/getData.ts` 查询。

## 数据来源

原始数据是 `src/data.js` 中一个 2.5MB 的 XML 字符串字面量（56060 行），结构如下：

```xml
<cardInfos>
  <theme id="40" name="时尚男套装" diff="1" type="0" ... />
  <theme id="45" name="时尚女套装" ... />
  ...
  <card id="100" theme_id="40" name="..." price="10" ... />
  <card id="101" theme_id="40" name="..." price="40" ... />
  ...
  <comb id="42" theme_id="45" from="41,40,43" time="14400" />
  <comb id="41" theme_id="45" from="49,47,44" time="3600" />
  ...
</cardInfos>
```

## 预编译为 JSON

`scripts/convert_data.py` 把 XML 解析为 JSON 结构：

```bash
python3 scripts/convert_data.py
```

生成 `src/data/gameData.json`，结构：

```json
{
  "THEME": { "40": {"id":"40","name":"时尚男套装",...}, ... },
  "CARD":  { "100": {"id":"100","theme_id":"40",...}, ... },
  "COMB":  { "42": {"id":"42","theme_id":"45","from":"41,40,43","time":"14400"}, ... }
}
```

- 所有属性值保留为字符串（原 XML 即是字符串）
- 体积从 2.5MB 降至 2.37MB（更紧凑的 JSON 序列化）
- 运行时不再需要 `innerHTML` + `querySelectorAll` 解析

> 如需重新生成（原始 XML 有更新），运行 `python3 scripts/convert_data.py`。正常开发无需运行。

## 类型定义

`src/types/card.ts` 定义数据类型：

```ts
interface ThemeAttr {
  id: string
  name: string
  diff: string       // 难度 1-5
  type: string       // 0:普通 1:下架 2:活动(下架) 3:活动(运作) 5:绝版 9:闪卡
  color?: string
  // ... 其他属性
  [key: string]: string | undefined
}

interface CardAttr {
  id: string
  theme_id: string
  name: string
  price: string      // 面值
  [key: string]: string | undefined
}

interface CombAttr {
  id: string         // 合成结果卡 id
  theme_id: string
  from: string       // 素材卡 id，逗号分隔
  time: string       // 合成耗时（秒）
  [key: string]: string | undefined
}
```

> 索引签名 `[key: string]: string | undefined` 用于兼容原始 XML 的任意属性，实际使用时按需类型收窄。

## 查询函数

`src/data/getData.ts` 提供查询函数，所有函数为纯函数。

### 预建索引

模块加载时一次性构建两个索引，避免高频查询遍历全量数据：

```ts
// themeId → 该主题下的卡片列表
const CARDS_BY_THEME: Record<string, CardAttr[]> = {}

// themeId → 该主题的合成规则列表
const COMBS_BY_THEME: Record<string, CombAttr[]> = {}

;(function buildIndexes() {
  for (const card of Object.values(DATA.CARD)) {
    (CARDS_BY_THEME[card.theme_id] ??= []).push(card)
  }
  for (const comb of Object.values(DATA.COMB)) {
    (COMBS_BY_THEME[comb.theme_id] ??= []).push(comb)
  }
})()
```

原项目每次 `getCardsByThemeId` 都对全量 14860 张卡做 `filter`，博物馆/炼卡弹窗频繁调用，开销大。预建索引后为 O(1) 查数组。

### 查询 API

```ts
// 主题
getThemeList(): ThemeAttr[]
getThemesBySearch(searchObj, fromThemeList?): ThemeAttr[]
getThemeById(id): ThemeAttr
getThemesByDiff(diff, fromThemeList?): ThemeAttr[]
getThemeByCardId(cardId): ThemeAttr
getThemesInclude(themeIdObj, themeList?): ThemeAttr[]
getThemesExclude(themeIdObj, themeList?): ThemeAttr[]

// 卡牌
getCardsByThemeId(themeId): CardAttr[]          // 用索引
getCardIdsByThemeId(themeId): string[]          // 用索引
getCardsByThemeIdAndSortByPrice(themeId): CardsByPriceGroup[]
getCardById(cardId): CardAttr
getCardsRandomFromCanGet(num): string[]         // 随机抽取可获得的卡

// 合成规则
getCombineRulesByThemeId(themeId): CombAttr[]   // 用索引
getCombineRuleByCardId(cardId): CombAttr        // 查某张卡是否可合成
```

`id` 参数支持 `string | number`，内部统一 `toString()`。

### 用法

```ts
import getData from '../data/getData'

const theme = getData.getThemeById('40')
const cards = getData.getCardsByThemeId('40')
const comb = getData.getCombineRuleByCardId('42')
```

## 性能注意

- `gameData.json` 体积 2.37MB，会被 Vite 打进主 bundle（gzip 后约 640KB）
- 查询函数是同步的，索引在模块加载时构建（约几十毫秒）
- 若未来首屏体积需要进一步优化，可考虑把 `gameData.json` 改为动态 `import()` 懒加载（首屏只需 `THEME`，`CARD`/`COMB` 进入具体主题时再加载）
