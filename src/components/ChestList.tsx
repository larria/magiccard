import type { ReactNode } from 'react'
import Card from './Card'
import { useGameStore } from '../store/useGameStore'
import './BagList.css'

interface ChestListProps {
  onHoverRet?: ((index: number) => ReactNode) | null
}

export default function ChestList({ onHoverRet = null }: ChestListProps) {
  const repStat = useGameStore((s) => s.repStat)
  const chestList = useGameStore((s) => s.chestList)

  return (
    <ul className="baglist_w">
      {new Array(repStat.chestSlotNum).fill(1).map((_, index) => {
        if (chestList[index]) {
          return (
            <li key={index}>
              <div className="baglist_card">
                <Card showPrice showNameInBigCard id={chestList[index]} />
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
