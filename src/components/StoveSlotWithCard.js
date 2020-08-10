import React from 'react'
import { Button, Statistic } from 'antd';

import Card from './Card'

// import getData from '../getData'
// import * as time from '../time'
// import * as utils from '../utils'

const { Countdown } = Statistic

function StoveSlotWithCard(props) {
    return (
        <>
            <div className="stoveslot stoveslot_card">
                <span className="stoveslot_card_cont">
                    <Card
                        id={props.cardId}
                        showNameInBigCard={true}
                        showPrice={true} />
                </span>
            </div>
            {props.state === 'queue' && (<span className="">等待</span>)}
            {props.state === 'refined' && (<Button type="primary" shape="round" onClick={_ => props.onGetCard()}>取卡</Button>)}
            {props.state === 'refining' && (<Countdown value={Date.now() + props.restTime} onFinish={_ => props.onCardRefined()} />)}
        </>
    )
}

StoveSlotWithCard.defaultProps = {
    slotIndex: 0,
    cardId: '8179',
    state: 'refining',
    restTime: 10400000,
    // 处理取出炼好的卡片
    onGetCard: () => { },
    // 卡片已炼好
    onCardRefined: () => { },
}

export default StoveSlotWithCard