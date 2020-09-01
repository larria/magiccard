import React from 'react'
import { Tooltip } from 'antd'

import Card from './Card'

import getData from '../getData'

import './MiniRepertory.css'

function MiniRepertory(props) {
    let cardList = props.cardIdList.map(cardId => getData.getCardById(cardId))
    cardList.sort((a, b) => parseInt(b.price) - parseInt(a.price))

    return (
        <>
            <ul className="minirespertory">
                {cardList.map((cardData, index) => {
                    return (
                        <li key={index}>
                            <Tooltip title={cardData.name}>
                                <Card
                                    id={cardData.id}
                                    isSmall={true}
                                    showPrice={true}
                                    onCardClick={e => props.onCardClick(cardData)}
                                />
                                {props.cardDisableRule && props.cardDisableRule(cardData) && (
                                    <span className="minirespertory_card_mask"></span>
                                )}
                            </Tooltip>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

MiniRepertory.defaultProps = {
    cardIdList: [],
    // 部分卡片上遮罩规则，用于变卡时不允许选比目标卡面值低的素材卡
    cardDisableRule: () => false,
    onCardClick: () => { }
}

export default MiniRepertory