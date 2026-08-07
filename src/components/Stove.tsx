import { useState } from 'react'
import StoveList from './StoveList'
import { useGameStore } from '../store/useGameStore'
import './Stove.css'

export default function Stove() {
  const stoveStat = useGameStore((s) => s.stoveStat)
  const [showStoveSlots, setShowStoveSlots] = useState(true)

  function toggleOpen() {
    setShowStoveSlots(!showStoveSlots)
  }

  return (
    <div className="stove_w">
      {new Array(stoveStat.maxStove).fill(1).map((_, index) => (
        <span className="stove_icon" key={index} onClick={toggleOpen} />
      ))}
      {showStoveSlots && (
        <div className="stovelist_w">
          <div className="stovelist_ctrl">
            <h3>炼卡炉</h3>
            <span
              className="stovelist_close_btn"
              onClick={() => setShowStoveSlots(false)}
            >
              关闭
            </span>
          </div>
          <StoveList />
        </div>
      )}
    </div>
  )
}
