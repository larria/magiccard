// 卡牌原始数据类型——所有属性均为字符串（来自 XML 属性，原项目即如此使用）

export interface ThemeAttr {
  id: string
  name: string
  diff: string
  time: string
  pages: string
  version: string
  gift?: string
  flashTheme?: string
  type: string
  color?: string
  new_type?: string
  gallery_type?: string
  onsale_time?: string
  rank_end_time?: string
  [key: string]: string | undefined
}

export interface CardAttr {
  id: string
  theme_id: string
  name: string
  price: string
  [key: string]: string | undefined
}

export interface CombAttr {
  id: string
  theme_id: string
  from: string
  time: string
  [key: string]: string | undefined
}

export interface CardData {
  THEME: Record<string, ThemeAttr>
  CARD: Record<string, CardAttr>
  COMB: Record<string, CombAttr>
}
