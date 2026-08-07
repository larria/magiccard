// 游戏全局状态类型定义

export interface RepStat {
  bagSlotNum: number
  chestSlotNum: number
}

export interface DrawStat {
  // 上次还剩下的抽卡数
  lastDrawNumLeft: number
  // 上次抽卡的时间戳
  lastResetTimeAtSamp: number
}

export interface BookStatItem {
  themeId: string
  collectAt: number
  collectedNum: number
}

export type BookStat = Record<string, BookStatItem>

export interface StoveStat {
  // 同时运作的炉子上限
  maxStove: number
}

export interface StoveSlot {
  cardId: string
  startToRefineAt: number
}

export interface GameState {
  // 用户信息
  userName: string | null
  avatar: string | null
  exp: number
  gold: number
  power: number
  lvlBonus: number

  // 卡位容量统计
  repStat: RepStat

  // 卡片列表
  bagList: string[]
  chestList: string[]

  // 抽卡统计
  drawStat: DrawStat

  // 集卡册统计
  bookStat: BookStat

  // 炼卡炉
  stoveStat: StoveStat
  stoveList: StoveSlot[]
}

// 主题集齐检查结果
export interface CollectResult {
  collectedThemeIds: string[]
  bagCardIds: string[]
  chestCardIds: string[]
}
