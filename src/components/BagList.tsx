import type { ReactNode } from 'react'
import Card from './Card'
import { useGameStore } from '../store/useGameStore'
import './BagList.css'

interface BagListProps {
  onHoverRet?: ((index: number) => ReactNode) | null
}

export default function BagList({ onHoverRet = null }: BagListProps) {
  const repStat = useGameStore((s) => s.repStat)
  const bagList = useGameStore((s) => s.bagList)

  return (
    <ul className="baglist_w">
      {new Array(repStat.bagSlotNum).fill(1).map((_, index) => {
        if (bagList[index]) {
          return (
            <li key={index}>
              <div className="baglist_card">
                <Card showPrice showNameInBigCard id={bagList[index]} />
                {onHoverRet && (
                  <div className="baglist_card_hover">{onHoverRet(index)}</div>
                )}
              </div>
            </li>
          )
        }
        return (
          <li key={index}>
            <div className="baglist_card_empty">
              <span>空卡位</span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
