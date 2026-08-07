import { useState, useEffect } from 'react'
import { App } from 'antd'
import * as utils from '../utils'
import getData from '../data/getData'
import Card from './Card'
import DiffStar from './DiffStar'
import getURL from '../getURL'
import type { CombAttr } from '../types/card'
import type { CardsByPriceGroup } from '../data/getData'
import './ThemeCards.css'

interface ThemeCardsProps {
  theme_id?: string
}

export default function ThemeCards({ theme_id = '287' }: ThemeCardsProps) {
  const { message } = App.useApp()
  const [cardsSortByPrice] = useState<CardsByPriceGroup[]>(() =>
    getData.getCardsByThemeIdAndSortByPrice(theme_id),
  )
  const [onShowCombByCardId, setOnShowCombByCardId] = useState<CombAttr | null>(
    null,
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  function showCombByCardId(cardId: string) {
    if (onShowCombByCardId && onShowCombByCardId.id === cardId) {
      setOnShowCombByCardId(null)
      return
    }
    const combInfo = getData.getCombineRuleByCardId(cardId)
    if (!combInfo) {
      message.info('该卡片无法被合成')
      setOnShowCombByCardId(null)
      return
    }
    message.success(`合成时长：${utils.getTimeFormat(Number(combInfo.time))}`)
    setOnShowCombByCardId(combInfo)
  }

  function getCardHighlightType(id: string): 'highlight1' | 'highlight2' | 'fade' | false {
    if (!onShowCombByCardId) return false
    if (onShowCombByCardId.id === id) return 'highlight1'
    if (onShowCombByCardId.from.split(',').includes(id)) return 'highlight2'
    return 'fade'
  }

  const themeData = getData.getThemeById(theme_id)
  let typeName = '普通卡'
  switch (themeData.type) {
    case '0':
      typeName = '普通卡'
      break
    case '1':
      typeName = '已下架卡'
      break
    case '2':
      typeName = '活动卡（可合成，基础牌只能抽取，已下架）'
      break
    case '3':
      typeName = '活动卡（可合成，基础牌只能抽取，正在运作）'
      break
    case '5':
      typeName = '绝版卡'
      break
    case '9':
      typeName = '闪卡'
      break
    default:
      typeName = '普通卡'
      break
  }

  return (
    <>
      <div className="cards_of_theme_hd">
        <h2 className="cards_of_theme_title">
          <img
            className="cards_of_theme_logo"
            src={getURL.getThemeLogo(themeData.id)}
            alt=""
          />
          {themeData.name}
        </h2>
        <span className="cards_of_theme_diff">
          <DiffStar diff={themeData.diff} />
        </span>
        <span className="cards_of_theme_type">
          类型：{typeName} {themeData.type}
        </span>
      </div>
      <ul className="cards_w">
        {cardsSortByPrice.map((item) => (
          <li key={item.price} className="cards_item">
            <div className="cards_price">
              <h3>面值：{item.price}</h3>
            </div>
            <div className="cards_by_price_w">
              {item.cards.map((card) => (
                <Card
                  key={card.id}
                  id={card.id}
                  showName
                  onCardClick={() => showCombByCardId(card.id)}
                  highlightType={getCardHighlightType(card.id)}
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
