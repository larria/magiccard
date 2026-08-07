import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  GameState,
  BookStat,
  StoveSlot,
} from './types'

interface GameActions {
  // 用户信息
  setUserName: (name: string) => void
  setAvatar: (avatarURL: string) => void
  setExp: (exp: number) => void
  addExp: (exp: number) => void
  // 金币
  setGold: (gold: number) => void
  addGold: (gold: number) => void
  subGold: (gold: number) => void
  // 魔力
  setPower: (power: number) => void
  addPower: (power: number) => void
  minusPower: (power: number) => void
  // 等级奖励
  setLevelBonusGot: (level: number) => void
  // 卡位容量
  setBagSlot: (slotNum: number) => void
  addBagSlot: (slotNum: number) => void
  setChestSlot: (slotNum: number) => void
  addChestSlot: (slotNum: number) => void
  // 换卡箱
  addCardToBag: (cardId: string) => void
  addCardsToBag: (cardList: string[]) => void
  removeCardFromBag: (index: number) => void
  updateBagList: (cardList: string[]) => void
  // 保险箱
  addCardToChest: (cardId: string) => void
  addCardsToChest: (cardList: string[]) => void
  removeCardFromChest: (index: number) => void
  updateChestList: (cardList: string[]) => void
  // 抽卡统计
  drawCardsAndResetTime: (drawNum: number, now: number) => void
  drawCards: (drawNum: number) => void
  updateDrawStat: (addDrawNumFromTime: number, time: number) => void
  // 集卡册
  collectOneTheme: (themeId: string, collectAt: number) => void
  updateCollection: (collectionObj: BookStat) => void
  // 炼卡炉统计
  setStoveSlotsNum: (slotNum: number) => void
  addStoveSlotsNum: (slotNum: number) => void
  // 炼卡炉列表
  putACardInStove: (cardId: string, startToRefineAt: number) => void
  updateStoveSlotsList: (slotsList: StoveSlot[]) => void
  // 整体重置（注册流程清空等场景）
  resetState: () => void
}

export type GameStore = GameState & GameActions

const initialState: GameState = {
  userName: null,
  avatar: null,
  exp: 0,
  gold: 8000,
  power: 200,
  lvlBonus: 0,
  repStat: { bagSlotNum: 20, chestSlotNum: 40 },
  bagList: [],
  chestList: [],
  drawStat: { lastDrawNumLeft: 16, lastResetTimeAtSamp: 0 },
  bookStat: {},
  stoveStat: { maxStove: 1 },
  stoveList: [],
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...initialState,

      setUserName: (name) => set({ userName: name }),
      setAvatar: (avatarURL) => set({ avatar: avatarURL }),
      setExp: (exp) => set({ exp }),
      addExp: (exp) => set((s) => ({ exp: s.exp + exp })),

      setGold: (gold) => set({ gold: parseInt(String(gold), 10) }),
      addGold: (gold) =>
        set((s) => ({ gold: s.gold + parseInt(String(gold), 10) })),
      subGold: (gold) =>
        set((s) => ({ gold: s.gold - parseInt(String(gold), 10) })),

      setPower: (power) => set({ power }),
      addPower: (power) => set((s) => ({ power: s.power + power })),
      minusPower: (power) => set((s) => ({ power: s.power - power })),

      setLevelBonusGot: (level) => set({ lvlBonus: parseInt(String(level), 10) }),

      setBagSlot: (slotNum) =>
        set((s) => ({ repStat: { ...s.repStat, bagSlotNum: slotNum } })),
      addBagSlot: (slotNum) =>
        set((s) => ({
          repStat: { ...s.repStat, bagSlotNum: s.repStat.bagSlotNum + slotNum },
        })),
      setChestSlot: (slotNum) =>
        set((s) => ({ repStat: { ...s.repStat, chestSlotNum: slotNum } })),
      addChestSlot: (slotNum) =>
        set((s) => ({
          repStat: {
            ...s.repStat,
            chestSlotNum: s.repStat.chestSlotNum + slotNum,
          },
        })),

      addCardToBag: (cardId) =>
        set((s) => ({ bagList: [...s.bagList, cardId.toString()] })),
      addCardsToBag: (cardList) =>
        set((s) => ({ bagList: [...s.bagList, ...cardList] })),
      removeCardFromBag: (index) =>
        set((s) => {
          const cards = [...s.bagList]
          cards.splice(index, 1)
          return { bagList: cards }
        }),
      updateBagList: (cardList) =>
        set({ bagList: Array.isArray(cardList) ? [...cardList] : [] }),

      addCardToChest: (cardId) =>
        set((s) => ({ chestList: [...s.chestList, cardId.toString()] })),
      addCardsToChest: (cardList) =>
        set((s) => ({ chestList: [...s.chestList, ...cardList] })),
      removeCardFromChest: (index) =>
        set((s) => {
          const cards = [...s.chestList]
          cards.splice(index, 1)
          return { chestList: cards }
        }),
      updateChestList: (cardList) =>
        set({ chestList: Array.isArray(cardList) ? [...cardList] : [] }),

      drawCardsAndResetTime: (drawNum, now) =>
        set((s) => ({
          drawStat: {
            ...s.drawStat,
            lastDrawNumLeft: s.drawStat.lastDrawNumLeft - drawNum,
            lastResetTimeAtSamp: now,
          },
        })),
      drawCards: (drawNum) =>
        set((s) => ({
          drawStat: {
            ...s.drawStat,
            lastDrawNumLeft: s.drawStat.lastDrawNumLeft - drawNum,
          },
        })),
      updateDrawStat: (addDrawNumFromTime, time) =>
        set((s) => ({
          drawStat: {
            ...s.drawStat,
            lastDrawNumLeft: Math.min(
              16,
              s.drawStat.lastDrawNumLeft + addDrawNumFromTime,
            ),
            lastResetTimeAtSamp: time,
          },
        })),

      collectOneTheme: (themeId, collectAt) =>
        set((s) => {
          const collected: BookStat = JSON.parse(JSON.stringify(s.bookStat))
          if (themeId in collected) {
            collected[themeId].collectedNum++
          } else {
            collected[themeId] = { themeId, collectAt, collectedNum: 1 }
          }
          return { bookStat: collected }
        }),
      updateCollection: (collectionObj) =>
        set({ bookStat: JSON.parse(JSON.stringify(collectionObj)) }),

      setStoveSlotsNum: (slotNum) =>
        set((s) => ({
          stoveStat: { ...s.stoveStat, maxStove: parseInt(String(slotNum), 10) },
        })),
      addStoveSlotsNum: (slotNum) =>
        set((s) => ({
          stoveStat: {
            ...s.stoveStat,
            maxStove: s.stoveStat.maxStove + parseInt(String(slotNum), 10),
          },
        })),

      putACardInStove: (cardId, startToRefineAt) =>
        set((s) => {
          if (cardId && startToRefineAt) {
            const newState: StoveSlot[] = JSON.parse(JSON.stringify(s.stoveList))
            newState.push({ cardId: cardId.toString(), startToRefineAt })
            return { stoveList: newState }
          }
          return {}
        }),
      updateStoveSlotsList: (slotsList) =>
        set(() => {
          const newState: StoveSlot[] = JSON.parse(JSON.stringify(slotsList))
          newState.sort((a, b) => a.startToRefineAt - b.startToRefineAt)
          return { stoveList: newState }
        }),

      resetState: () => set({ ...initialState }),
    }),
    {
      name: 'magic_card_v1',
      storage: createJSONStorage(() => localStorage),
      // 只持久化状态数据，不持久化 action 函数
      partialize: (state) => {
        const {
          userName,
          avatar,
          exp,
          gold,
          power,
          lvlBonus,
          repStat,
          bagList,
          chestList,
          drawStat,
          bookStat,
          stoveStat,
          stoveList,
        } = state
        return {
          userName,
          avatar,
          exp,
          gold,
          power,
          lvlBonus,
          repStat,
          bagList,
          chestList,
          drawStat,
          bookStat,
          stoveStat,
          stoveList,
        }
      },
    },
  ),
)
