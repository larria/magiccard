import type { CSSProperties } from 'react'
import getData from '../data/getData'
import getURL from '../getURL'
import './Card.css'

type HighlightType = 'highlight1' | 'highlight2' | 'fade' | false

interface CardProps {
  id?: string
  isSmall?: boolean
  showName?: boolean
  showNameInBigCard?: boolean
  highlightType?: HighlightType
  showPrice?: boolean
  onCardClick?: () => void
}

export default function Card({
  id = '3660',
  isSmall = false,
  showName = false,
  showNameInBigCard = false,
  highlightType = false,
  showPrice = false,
  onCardClick = () => {},
}: CardProps) {
  const cardInfo = getData.getCardById(id)

  const getHighlightStyle = (): CSSProperties => {
    if (highlightType === 'highlight1') {
      return { transform: 'scale(1.1, 1.1)' }
    }
    if (highlightType === 'highlight2') {
      return { animation: 'shakeTopx 2s infinite' }
    }
    if (highlightType === 'fade') {
      return { opacity: '0.3' }
    }
    return {}
  }

  if (!isSmall) {
    return (
      <div
        className="card_wrap"
        onClick={onCardClick}
        style={getHighlightStyle()}
      >
        <div
          className="card"
          style={{
            backgroundImage: `url(${getURL.getThemeBackGround(cardInfo.theme_id)})`,
          }}
        >
          <img className="card_img" src={getURL.getCard(id)} alt="" />
          {showPrice && <span className="card_price">{cardInfo.price}</span>}
          {showNameInBigCard && (
            <span className="card_name_in_card">{cardInfo.name}</span>
          )}
        </div>
        {showName && <span className="card_name">{cardInfo.name}</span>}
      </div>
    )
  }

  return (
    <div
      className="card_wrap_small"
      onClick={onCardClick}
      style={getHighlightStyle()}
    >
      <div className="card_small">
        <img className="card_img_small" src={getURL.getCardSmall(id)} alt="" />
        {showPrice && <span className="card_price_small">{cardInfo.price}</span>}
      </div>
      {showName && <span className="card_name_small">{cardInfo.name}</span>}
    </div>
  )
}
