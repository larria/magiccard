// 跟随 Vite base：dev 为 '/assets'，GitHub Pages 子路径为 '/magiccard/assets'
const BaseURL = `${import.meta.env.BASE_URL}assets`

export const avatarsURLList: string[] = new Array(18).fill(1).map((_, index) => {
  return `${BaseURL}/other/avatar/avatar${index + 1}.svg`
})

// 用户信息基础数据
export const BaseUserData = {
  userName: null as string | null,
  avatar: null as string | null,
  exp: 0,
  gold: 0,
  power: 0,
  bonus: [] as number[],
}

// 升级奖励
export interface LevelBonus {
  maxStove?: number
  bagSlotNum?: number
  chestSlotNum?: number
  gold?: number
  power?: number
}

export const levelBonus: LevelBonus[] = new Array(1000).fill(1).map((_, index) => {
  if (index === 5 || index === 10) {
    return { maxStove: 1 }
  }
  if (index % 4 === 0 && index < 81) {
    return { bagSlotNum: 1 }
  }
  if (index % 4 === 2 && index < 83) {
    return { chestSlotNum: 1 }
  }
  return { gold: index * 1000, power: index * 10 }
})

export const defaultMiniThemeIdList = ['40', '45', '166', '177']
