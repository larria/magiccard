import { Tooltip } from 'antd'
import Card from './Card'
import getData from '../data/getData'
import type { CardAttr } from '../types/card'
import './MiniRepertory.css'

interface MiniRepertoryProps {
  cardIdList?: string[]
  cardDisableRule?: (cardData: CardAttr) => boolean
  onCardClick?: (cardData: CardAttr) => void
}

export default function MiniRepertory({
  cardIdList = [],
  cardDisableRule = () => false,
  onCardClick = () => {},
}: MiniRepertoryProps) {
  const cardList = cardIdList.map((cardId) => getData.getCardById(cardId))
  cardList.sort((a, b) => parseInt(b.price) - parseInt(a.price))

  return (
    <ul className="minirespertory">
      {cardList.map((cardData, index) => (
        <li key={index}>
          <Tooltip title={cardData.name}>
            <Card
              id={cardData.id}
              isSmall
              showPrice
              onCardClick={() => onCardClick(cardData)}
            />
            {cardDisableRule(cardData) && (
              <span className="minirespertory_card_mask" />
            )}
          </Tooltip>
        </li>
      ))}
    </ul>
  )
}
