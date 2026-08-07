# 状态管理

项目使用 [Zustand](https://github.com/pmndrs/zustand) 5 管理全局状态，通过 `persist` 中间件将状态持久化到 localStorage。

## Store 定义

状态全部集中在单个 store：`src/store/useGameStore.ts`。

### 状态分片

Store 包含 13 个状态字段，对应游戏的各个域：

| 字段 | 类型 | 初始值 | 说明 |
|---|---|---|---|
| `userName` | `string \| null` | `null` | 用户昵称 |
| `avatar` | `string \| null` | `null` | 用户头像 URL |
| `exp` | `number` | `0` | 经验值 |
| `gold` | `number` | `8000` | 金币 |
| `power` | `number` | `200` | 魔力（变卡消耗） |
| `lvlBonus` | `number` | `0` | 已领取奖励的等级 |
| `repStat` | `RepStat` | `{bagSlotNum:20, chestSlotNum:40}` | 换卡箱/保险箱容量 |
| `bagList` | `string[]` | `[]` | 换卡箱卡片 ID 列表 |
| `chestList` | `string[]` | `[]` | 保险箱卡片 ID 列表 |
| `drawStat` | `DrawStat` | `{lastDrawNumLeft:16, lastResetTimeAtSamp:0}` | 抽卡次数与重置时间 |
| `bookStat` | `BookStat` | `{}` | 集卡册（themeId → 收集信息） |
| `stoveStat` | `StoveStat` | `{maxStove:1}` | 炼卡炉上限 |
| `stoveList` | `StoveSlot[]` | `[]` | 炼卡炉卡槽列表 |

类型定义见 `src/store/types.ts`。

### Actions

每个状态字段配套具名 action，部分字段有多个 action：

```ts
// 用户信息
setUserName(name: string): void
setAvatar(avatarURL: string): void
setExp(exp: number): void
addExp(exp: number): void

// 金币
setGold(gold: number): void
addGold(gold: number): void
subGold(gold: number): void

// 魔力
setPower(power: number): void
addPower(power: number): void
minusPower(power: number): void

// 等级奖励
setLevelBonusGot(level: number): void

// 卡位容量
setBagSlot(slotNum: number): void
addBagSlot(slotNum: number): void
setChestSlot(slotNum: number): void
addChestSlot(slotNum: number): void

// 换卡箱
addCardToBag(cardId: string): void
addCardsToBag(cardList: string[]): void
removeCardFromBag(index: number): void
updateBagList(cardList: string[]): void

// 保险箱（同换卡箱，略）

// 抽卡统计
drawCardsAndResetTime(drawNum: number, now: number): void
drawCards(drawNum: number): void
updateDrawStat(addDrawNumFromTime: number, time: number): void

// 集卡册
collectOneTheme(themeId: string, collectAt: number): void
updateCollection(collectionObj: BookStat): void

// 炼卡炉
setStoveSlotsNum(slotNum: number): void
addStoveSlotsNum(slotNum: number): void
putACardInStove(cardId: string, startToRefineAt: number): void
updateStoveSlotsList(slotsList: StoveSlot[]): void

// 重置
resetState(): void
```

## 持久化

通过 `persist` 中间件实现，配置如下：

```ts
persist(
  (set) => ({ ...initialState, ...actions }),
  {
    name: 'magic_card_v1',                              // localStorage key
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ /* 只持久化状态，不持久化 action 函数 */ }),
  },
)
```

- **同步水合**：Zustand persist 默认 `skipHydration: false`，store 创建时同步从 localStorage 读取，首次渲染前状态已是持久化值，无需 `PersistGate`
- **partialize**：只持久化状态数据，action 函数不进 localStorage

## 在组件中使用

### 订阅状态

用 selector 订阅单个字段（推荐，避免不必要重渲染）：

```tsx
import { useGameStore } from '../store/useGameStore'

function User() {
  const userName = useGameStore((s) => s.userName)
  const gold = useGameStore((s) => s.gold)
  // ...
}
```

> ⚠️ 不要用 `useGameStore((s) => ({ a: s.a, b: s.b }))` 返回新对象——每次都创建新对象会导致无限重渲染。需订阅多字段时分别调用 selector，或用 `useShallow`。

### 直接调用 action

简单的单步状态修改，组件可直接调用 store action：

```tsx
const setUserName = useGameStore((s) => s.setUserName)
setUserName('新名字')
```

### 通过 dpa 门面调用（推荐用于业务逻辑）

涉及「读 state + 判定 + 多次写 state」的复杂逻辑，通过 `dispatchActionWithBusiness`（简称 dpa）门面调用，见下节。

## 业务 action 门面（dpa）

`src/store/dispatchActionWithBusiness.ts` 封装了跨切片的业务编排逻辑，组件只调 `dpa.xxx()`，不直接操作 store。

### 为什么需要 dpa

许多业务操作涉及读取多个状态、判定后多次写入。例如「升级」需要：
1. 读取 `exp` 计算等级
2. 读取 `lvlBonus` 判断是否跨级
3. 写入 `gold`/`power`/`repStat`（升级奖励）
4. 写入 `stoveList`（炉位上限变化时重排）
5. 写入 `lvlBonus`

把这些逻辑放在组件里会导致组件臃肿且难以复用。dpa 作为门面集中管理。

### dpa 函数列表

```ts
// 用户与资源
setName(): void
addGold(gold?: number): void        // 默认 200
addExp(exp?: number): void          // 默认 99
addPower(power: number): void

// 换卡箱 / 保险箱
addACardToBagList(cardId: string | number): void
updateBagList(cardList: string[]): void
updateChestList(cardList: string[]): void
updateBagListWithATheme(): void     // 调试：放一套主题到换卡箱

// 集卡册
addAThemeToBook(themeId?: string): void  // 默认 '52'

// 炼卡炉
addACardToStove(timeSamp: number, cardId?: string): void
updateStoveList(slotsList: StoveSlot[]): void

// 等级与容量
setLevelBonusGot(level: number | string): void
addMaxStove(slotNum: number | string): void
addBagSlotNum(slotNum: number): void
addChestSlotNum(slotNum: number): void

// 只读查询
getCardFromStoveAndCheckTheme(cardId: string | number): CollectResult | false
```

### dpa 实现原理

dpa 内部通过 `useGameStore.getState()` 读取状态、`useGameStore.getState().xxx()` 调用 action：

```ts
import { useGameStore } from './useGameStore'

const get = useGameStore.getState

export function addGold(gold = 200): void {
  get().addGold(gold)   // 调用 store action
}

export function addACardToBagList(cardId: string | number): void {
  get().addCardToBag(String(cardId))
}
```

组件调用方式：

```tsx
import * as dpa from '../store/dispatchActionWithBusiness'

function MyComponent() {
  return <button onClick={() => dpa.addGold(500)}>加金币</button>
}
```

## StrictMode 注意事项

React 19 的 `<StrictMode>`（`src/main.tsx`）在开发模式下会让 `useEffect` 执行两次。涉及弹窗、定时器的副作用需用 ref 守卫避免重复触发：

```tsx
const confirmShown = useRef(false)
useEffect(() => {
  if (confirmShown.current) return
  confirmShown.current = true
  modal.confirm({ /* ... */ })
}, [])
```

参考 `src/components/PanelSettings.tsx`。
