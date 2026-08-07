import { useState, useEffect } from 'react'
import { Button, Progress } from 'antd'
import Card from './Card'
import * as time from '../time'
import * as utils from '../utils'

interface StoveSlotWithCardProps {
  slotIndex?: number
  cardId?: string
  state?: 'queue' | 'refining' | 'refined'
  totalTime?: number
  restTime?: number
  onGetCard?: () => void
  onCardRefined?: () => void
}

export default function StoveSlotWithCard({
  slotIndex = 0,
  cardId = '8179',
  state = 'refining',
  totalTime = 20400000,
  restTime = 10400000,
  onGetCard = () => {},
  onCardRefined = () => {},
}: StoveSlotWithCardProps) {
  const [restTimeFormat, setRestTimeFormat] = useState<string | number | null>(
    state === 'refining' ? utils.getTimeFormat(restTime / 1000) : null,
  )
  const [restPercent, setRestPercent] = useState<number>(
    state === 'refining'
      ? Number(utils.getPercent(totalTime * 1000 - restTime, totalTime * 1000))
      : state === 'refined'
        ? 100
        : 0,
  )

  // 保持原行为：仅在挂载时启动倒计时，闭包捕获初始 props
  useEffect(() => {
    const initNowSamp = Date.now()
    if (state === 'refining') {
      time.addTask({
        name: 'slot' + slotIndex.toString(),
        handle: (nowSamp) => {
          const nowRestTime = restTime + initNowSamp - nowSamp
          if (nowRestTime <= 0) {
            setRestTimeFormat(0)
            setRestPercent(100)
            onCardRefined()
            time.removeTask('slot' + slotIndex.toString())
          } else {
            setRestTimeFormat(utils.getTimeFormat(nowRestTime / 1000))
            setRestPercent(
              Number(
                utils.getPercent(totalTime * 1000 - nowRestTime, totalTime * 1000),
              ),
            )
          }
        },
      })
    }
    return () => time.removeTask('slot' + slotIndex.toString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="stoveslot stoveslot_card">
        <div className="stoveslot_card_cont">
          <Card id={cardId} showNameInBigCard showPrice />
          <div className="stoveslot_card_mask">
            <span className="stoveslot_card_progress">
              <Progress
                type="circle"
                size={80}
                strokeColor="#108ee9"
                trailColor="rgba(255, 255, 255, 0.25)"
                percent={restPercent}
                format={(p) => (
                  <span style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>
                    {p}%
                  </span>
                )}
              />
            </span>
            <span className="stoveslot_card_state">
              {state === 'queue' && <>等待...</>}
              {state === 'refined' && <>已合成</>}
              {state === 'refining' && (
                <span className="stoveslot_card_refining">正在合成</span>
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="stoveslot_ctrl">
        {state === 'queue' && <span>{utils.getTimeFormat(totalTime)}</span>}
        {state === 'refined' && (
          <Button type="primary" shape="round" onClick={() => onGetCard()}>
            取卡
          </Button>
        )}
        {state === 'refining' && <span>{restTimeFormat}</span>}
      </div>
    </>
  )
}
