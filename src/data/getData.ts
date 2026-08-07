import gameData from './gameData.json'
import type { CardData, CardAttr, CombAttr, ThemeAttr } from '../types/card'

const DATA: CardData = gameData as unknown as CardData

function toString(id: string | number): string {
  return typeof id !== 'string' ? id.toString() : id
}

// 预建索引：themeId -> 该主题下的卡片列表 / 合成规则列表
// 原实现每次查询都对全量 CARD（14860 张）/ COMB 做 filter，博物馆与炼卡弹窗频繁调用，开销大。
const CARDS_BY_THEME: Record<string, CardAttr[]> = {}
const COMBS_BY_THEME: Record<string, CombAttr[]> = {}
;(function buildIndexes() {
  for (const card of Object.values(DATA.CARD)) {
    const tid = card.theme_id
    if (!CARDS_BY_THEME[tid]) CARDS_BY_THEME[tid] = []
    CARDS_BY_THEME[tid].push(card)
  }
  for (const comb of Object.values(DATA.COMB)) {
    const tid = comb.theme_id
    if (!COMBS_BY_THEME[tid]) COMBS_BY_THEME[tid] = []
    COMBS_BY_THEME[tid].push(comb)
  }
})()

// 获取全部主题
export function getThemeList(): ThemeAttr[] {
  return Object.values(DATA.THEME)
}

// 通过对象条件搜索卡片主题
export function getThemesBySearch(
  searchObj: Record<string, unknown>,
  fromThemeList?: ThemeAttr[],
): ThemeAttr[] {
  const searchBy: Record<string, unknown> = { ...searchObj }
  if ('name' in searchBy && typeof searchBy.name === 'string') {
    searchBy.name = new RegExp(searchBy.name, 'i')
  }
  const themeList = fromThemeList ?? getThemeList()
  return themeList.filter((item) => {
    let matched = true
    for (const key in searchBy) {
      const cond = searchBy[key]
      if (cond instanceof RegExp) {
        if (!cond.test(String(item[key] ?? ''))) {
          matched = false
          break
        }
      } else if (cond !== item[key]) {
        matched = false
        break
      }
    }
    return matched
  })
}

export function getThemeById(id: string | number): ThemeAttr {
  return DATA.THEME[toString(id)]
}

export function getThemesByDiff(diff: string | number, fromThemeList?: ThemeAttr[]): ThemeAttr[] {
  const themeList = fromThemeList ?? getThemeList()
  const d = diff.toString()
  return themeList.filter((item) => d === item.diff && item.name !== '道具卡')
}

// 获取卡牌所属的 theme
export function getThemeByCardId(id: string | number): ThemeAttr {
  return DATA.THEME[DATA.CARD[toString(id)].theme_id]
}

// 获取条件之内的卡片列表
export function getThemesInclude(
  includeThemeIdObj: Record<string, unknown>,
  themeList: ThemeAttr[] = getThemeList(),
): ThemeAttr[] {
  return themeList.filter((themeItem) => themeItem.id in includeThemeIdObj)
}

// 获取排除条件之外的卡片列表
export function getThemesExclude(
  excludeThemeIdObj: Record<string, unknown>,
  themeList: ThemeAttr[] = getThemeList(),
): ThemeAttr[] {
  return themeList.filter((themeItem) => !(themeItem.id in excludeThemeIdObj))
}

export function getCardsByThemeId(id: string | number): CardAttr[] {
  const tid = toString(id)
  return CARDS_BY_THEME[tid] ?? []
}

export function getCardIdsByThemeId(id: string | number): string[] {
  const cards = CARDS_BY_THEME[toString(id)] ?? []
  return cards.map((c) => c.id)
}

// 返回一套主题里按面值分类的卡片二维数组
export interface CardsByPriceGroup {
  price: string
  cards: CardAttr[]
}

export function getCardsByThemeIdAndSortByPrice(id: string | number): CardsByPriceGroup[] {
  const res: CardsByPriceGroup[] = []
  const cards = getCardsByThemeId(id)
  cards.forEach((card) => {
    const resItem = res.find((item) => item.price === card.price)
    if (resItem) {
      resItem.cards.push(card)
    } else {
      res.push({ price: card.price, cards: [card] })
    }
  })
  res.sort((a, b) => parseInt(b.price, 10) - parseInt(a.price, 10))
  return res
}

export function getCardById(id: string | number): CardAttr {
  return DATA.CARD[toString(id)]
}

// 从可以获取的卡中随机抽取 num 张
export function getCardsRandomFromCanGet(num: number): string[] {
  const res: string[] = []
  let n = parseInt(String(num), 10)
  const ids = Object.keys(DATA.CARD)
  while (n > 0) {
    const randomCardIdx = Math.floor(Math.random() * ids.length)
    const randomCardId = ids[randomCardIdx]
    const card = DATA.CARD[randomCardId]
    // 有的卡对应不到主题，如 theme_id 为 664 的卡
    if (DATA.THEME[card.theme_id]) {
      // 是普通卡或活动卡
      if (DATA.THEME[card.theme_id].type === '0' || DATA.THEME[card.theme_id].type === '2') {
        // 如果该卡片不能合成，认定为基础素材卡，可以抽得
        if (!getCombineRuleByCardId(card.id)) {
          res.push(card.id)
          n--
        }
      }
    }
  }
  return res
}

export function getCombineRulesByThemeId(id: string | number): CombAttr[] {
  const tid = toString(id)
  return COMBS_BY_THEME[tid] ?? []
}

export function getCombineRuleByCardId(id: string | number): CombAttr {
  return DATA.COMB[toString(id)]
}

export default {
  getThemeList,
  getThemesBySearch,
  getThemeById,
  getThemesByDiff,
  getThemeByCardId,
  getThemesInclude,
  getThemesExclude,
  getCardsByThemeId,
  getCardIdsByThemeId,
  getCardsByThemeIdAndSortByPrice,
  getCardById,
  getCardsRandomFromCanGet,
  getCombineRulesByThemeId,
  getCombineRuleByCardId,
}
