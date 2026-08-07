import { useGameStore } from './useGameStore'
import getData from '../data/getData'
import * as utils from '../utils'
import type { CollectResult, StoveSlot } from './types'

// 该模块的方法作为业务 action 门面：封装「读 state + 多次写 state」的编排逻辑。
// 调用方只需 import * as dpa 后调用 dpa.xxx()，签名与原 Redux 版本保持一致。

const get = useGameStore.getState
const set = useGameStore.setState

// 从卡炉内取出一张炼好的卡时，检查是否集齐了一套主题
export function getCardFromStoveAndCheckTheme(cardId: string | number): CollectResult | false {
  const state = get()
  const themeData = getData.getThemeByCardId(cardId)
  const collectRes = utils.checkThemeCollected(
    state.bagList,
    state.chestList,
    [themeData.id],
  )
  return collectRes ?? false
}

export function setName(): void {
  set({ userName: 'Lynn' })
}

export function addGold(gold = 200): void {
  get().addGold(gold)
}

export function addExp(exp = 99): void {
  get().addExp(exp)
}

export function addACardToBagList(cardId: string | number): void {
  get().addCardToBag(String(cardId))
}

// 给换卡箱放 1 套完整主题，用以测试自动检查主题合成
export function updateBagList(cardList: string[]): void {
  get().updateBagList(cardList)
}

export function updateChestList(cardList: string[]): void {
  get().updateChestList(cardList)
}

// 给换卡箱放 1 套完整主题，用以测试自动检查主题合成
export function updateBagListWithATheme(): void {
  const cardList = ['29', '30', '31', '32', '33', '35', '36', '37', '38', '39', '64', '65', '66']
  get().updateBagList(cardList)
}

// 给已收集放入一个主题
export function addAThemeToBook(themeId = '52'): void {
  get().collectOneTheme(themeId, Date.now())
}

// 放一张卡在炼卡炉
export function addACardToStove(timeSamp: number, cardId: string | number = '9115'): void {
  get().putACardInStove(String(cardId), timeSamp || Date.now())
}

// 更新炉位列表
export function updateStoveList(slotsList: StoveSlot[]): void {
  get().updateStoveSlotsList([...slotsList])
}

// 设置已获得的等级奖励
export function setLevelBonusGot(level: number | string): void {
  get().setLevelBonusGot(parseInt(String(level), 10))
}

// 增加炉位上限
export function addMaxStove(slotNum: number | string): void {
  get().addStoveSlotsNum(parseInt(String(slotNum), 10))
}

// 增加换卡箱卡位上限
export function addBagSlotNum(slotNum: number): void {
  get().addBagSlot(slotNum)
}

// 增加保险箱卡位上限
export function addChestSlotNum(slotNum: number): void {
  get().addChestSlot(slotNum)
}

// 增加魔力
export function addPower(power: number): void {
  get().addPower(power)
}
