import React, { useState, useEffect } from 'react'
import { Button, Progress } from 'antd';

import Card from './Card'

// import getData from '../getData'
import * as time from '../time'
import * as utils from '../utils'

function StoveSlotWithCard(props) {
    const [restTimeFormat, setRestTimeFormat] = useState(props.state === 'refining' ? utils.getTimeFormat(props.restTime / 1000) : null)
    const [restPercent, setRestPercent] = useState(props.state === 'refining' ? utils.getPercent(props.totalTime * 1000 - props.restTime, props.totalTime * 1000) : props.state === 'refined' ? 100 : 0)
    useEffect(() => {
        const initNowSamp = Date.now()
        if (props.state === 'refining') {
            time.addTask({
                name: 'slot' + props.slotIndex.toString(),
                handle: (nowSamp) => {
                    let nowRestTime = props.restTime + initNowSamp - nowSamp
                    if (nowRestTime <= 0) {
                        // 炼好了
                        setRestTimeFormat(0)
                        setRestPercent(100)
                        props.onCardRefined()
                        time.removeTask('slot' + props.slotIndex.toString())
                    } else {
                        setRestTimeFormat(utils.getTimeFormat(nowRestTime / 1000))
                        setRestPercent(utils.getPercent(props.totalTime * 1000 - nowRestTime, props.totalTime * 1000))
                    }
                }
            })
        }
        return () => time.removeTask('slot' + props.slotIndex.toString())
    }, [])

    return (
        <>
            <div className="stoveslot stoveslot_card">
                <div className="stoveslot_card_cont">
                    <Card
                        id={props.cardId}
                        showNameInBigCard={true}
                        showPrice={true} />
                    <div className="stoveslot_card_mask">
                        <span className="stoveslot_card_progress">
                            <Progress
                                type="circle"
                                width={80}
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                }}
                                percent={restPercent}
                            />
                        </span>
                        <span className="stoveslot_card_state">
                            {props.state === 'queue' && (<>等待...</>)}
                            {props.state === 'refined' && (<>已合成</>)}
                            {props.state === 'refining' && (<span className="stoveslot_card_refining">正在合成</span>)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="stoveslot_ctrl">
                {props.state === 'queue' && (<span className="">{utils.getTimeFormat(props.totalTime)}</span>)}
                {props.state === 'refined' && (<Button type="primary" shape="round" onClick={_ => props.onGetCard()}>取卡</Button>)}
                {/* {props.state === 'refining' && (<Countdown value={Date.now() + props.restTime} onFinish={_ => props.onCardRefined()} />)} */}
                {props.state === 'refining' && (<span>{restTimeFormat}</span>)}
            </div>
        </>
    )
}

StoveSlotWithCard.defaultProps = {
    slotIndex: 0,
    cardId: '8179',
    state: 'refining',
    totalTime: 20400000,
    restTime: 10400000,
    // 处理取出炼好的卡片
    onGetCard: () => { },
    // 卡片已炼好
    onCardRefined: () => { },
}

export default StoveSlotWithCard