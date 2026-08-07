import getData from './data/getData'
import type { CollectResult } from './store/types'
import type { StoveSlot } from './store/types'

export function getTimeFormat(endTime: number | string): string {
  let secondTime = parseInt(String(endTime))
  let min = 0
  let h = 0
  let result = ''
  if (secondTime >= 60) {
    min = parseInt(String(secondTime / 60))
    secondTime = parseInt(String(secondTime % 60))
    if (min >= 60) {
      h = parseInt(String(min / 60))
      min = parseInt(String(min % 60))
    }
  }
  result = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secondTime.toString().padStart(2, '0')}`
  return result
}

// 百分比
export function getPercent(objVal: number | string, totalVal: number | string, toFixedNum = 1): string {
  let res = (100 * parseFloat(String(objVal))) / parseFloat(String(totalVal))
  res = Number(res.toFixed(toFixedNum)) as unknown as number
  return String(res)
}

// 换算成等级
export function getlvl(exp: number): number {
  return Math.floor(Math.pow(exp / 10, 1 / 3))
}

// 格式化经验值、金币显示
export function getRenderExp(exp: number | string): string {
  const expNum = parseInt(String(exp), 10)
  if (expNum > 10000) {
    const resNum = (expNum / 10000).toFixed(1)
    return resNum + '万'
  }
  return String(exp)
}

export interface StoveRenderItem {
  cardId: string
  restTime: number
  startToRefineAt: number
  state: 'queue' | 'refining' | 'refined'
}

// 推测获得所有炉位在某特定时间的渲染状态
export function getStoveRenderState(slotsList: StoveSlot[], toTimeSamp: number): StoveRenderItem[] {
  const res: StoveRenderItem[] = []
  const theSlotsList: StoveSlot[] = JSON.parse(JSON.stringify(slotsList))

  theSlotsList.forEach((slot) => {
    const costTime = parseInt(getData.getCombineRuleByCardId(slot.cardId).time) * 1000
    const restTime = slot.startToRefineAt + costTime - toTimeSamp
    const resItem: StoveRenderItem = {
      cardId: slot.cardId,
      restTime,
      startToRefineAt: slot.startToRefineAt,
      state: 'refining',
    }
    if (restTime > 0) {
      if (slot.startToRefineAt > toTimeSamp) {
        // 还在等待，没开始炼
        resItem.state = 'queue'
      } else {
        // 开始炼了，但还没炼完
        resItem.state = 'refining'
      }
    } else {
      // 炼完了
      resItem.state = 'refined'
    }
    res.push(resItem)
  })
  return res
}

// 往炼制列表再加一张卡时，获取其能开始炼制的时间
export function getStartToRefineAt(slotsList: StoveSlot[], maxStove: number | string): number {
  const theSlotsList: StoveSlot[] = JSON.parse(JSON.stringify(slotsList))
  let count = parseInt(String(maxStove), 10)
  theSlotsList.sort((a, b) => a.startToRefineAt - b.startToRefineAt)
  const nowSamp = Date.now()
  const refiningRefinedAtList: number[] = []
  const queueCostList: number[] = []
  theSlotsList.forEach((slot) => {
    const costTime = parseInt(getData.getCombineRuleByCardId(slot.cardId).time) * 1000
    const refinedTime = slot.startToRefineAt + costTime
    if (refinedTime > nowSamp) {
      if (slot.startToRefineAt < nowSamp) {
        refiningRefinedAtList.push(slot.startToRefineAt + costTime)
        count--
      } else {
        queueCostList.push(costTime)
      }
    }
  })
  if (count > 0) {
    return nowSamp
  }
  refiningRefinedAtList.sort((a, b) => a - b)
  queueCostList.sort((a, b) => a - b)
  while (queueCostList.length > 0) {
    const earliestQueueCost = queueCostList.shift()!
    refiningRefinedAtList[0] += earliestQueueCost
    refiningRefinedAtList.sort((a, b) => a - b)
  }
  return refiningRefinedAtList[0]
}

// 当同时炼卡的炉子数量上限改变时，更新炉子数据列表
export function getUpdatedStoveListByMaxStove(slotsList: StoveSlot[], toMaxStove: number | string): StoveSlot[] {
  const theSlotsList: StoveSlot[] = JSON.parse(JSON.stringify(slotsList))
  let count = parseInt(String(toMaxStove), 10)
  theSlotsList.sort((a, b) => a.startToRefineAt - b.startToRefineAt)
  const nowSamp = Date.now()

  const willFinishRefineSampList: number[] = []
  theSlotsList.forEach((slot) => {
    const costTime = parseInt(getData.getCombineRuleByCardId(slot.cardId).time) * 1000
    if (slot.startToRefineAt < nowSamp) {
      const refinedTime = slot.startToRefineAt + costTime
      if (refinedTime < nowSamp) {
        // 已经炼完，不需要处理
      } else {
        willFinishRefineSampList.push(refinedTime)
        count--
      }
    } else {
      if (count > 0) {
        slot.startToRefineAt = nowSamp
        const refinedTime = slot.startToRefineAt + costTime
        willFinishRefineSampList.push(refinedTime)
        count--
      } else {
        willFinishRefineSampList.sort((a, b) => a - b)
        const startToRefineAt = willFinishRefineSampList.shift()!
        slot.startToRefineAt = startToRefineAt
      }
    }
  })
  return theSlotsList
}

// 检查是否合成了主题
export function checkThemeCollected(
  bagCardIds: string[],
  chestCardIds: string[],
  themeIds: string[],
): CollectResult | false {
  if (!(themeIds instanceof Array)) {
    console.log('themeIds:' + themeIds + '必须是数组')
    return false
  }
  const collectedThemeIds: string[] = []
  const themeIdsSet = new Set(themeIds)
  let bagCardIdsMut = bagCardIds
  let chestCardIdsMut = chestCardIds
  themeIdsSet.forEach((themeId) => {
    const cardOfThemesIdSet = new Set(getData.getCardIdsByThemeId(themeId))
    const bagCardIdsTemp = [...bagCardIdsMut]
    const chestCardIdsTemp = [...chestCardIdsMut]
    for (let i = bagCardIdsTemp.length - 1; i >= 0; i--) {
      if (typeof bagCardIdsTemp[i] === 'string') {
        const cardId = bagCardIdsTemp[i]
        if (cardOfThemesIdSet.has(cardId)) {
          bagCardIdsTemp.splice(i, 1)
          cardOfThemesIdSet.delete(cardId)
        }
      } else {
        continue
      }
    }
    for (let i = chestCardIdsTemp.length - 1; i >= 0; i--) {
      if (typeof chestCardIdsTemp[i] === 'string') {
        const cardId = chestCardIdsTemp[i]
        if (cardOfThemesIdSet.has(cardId)) {
          chestCardIdsTemp.splice(i, 1)
          cardOfThemesIdSet.delete(cardId)
        }
      } else {
        continue
      }
    }
    if (cardOfThemesIdSet.size === 0) {
      collectedThemeIds.push(themeId)
      bagCardIdsMut = bagCardIdsTemp
      chestCardIdsMut = chestCardIdsTemp
    }
  })
  if (collectedThemeIds.length > 0) {
    return {
      collectedThemeIds,
      bagCardIds: bagCardIdsMut,
      chestCardIds: chestCardIdsMut,
    }
  }
  return false
}
