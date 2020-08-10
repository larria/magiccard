import React, { useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Modal } from 'antd';

import getData from '../getData'
// import * as time from '../time'
import * as utils from '../utils'
import * as dpa from '../dispatchActionWithBusiness'

import './StoveList.css'
import StoveSlotWithCard from './StoveSlotWithCard';
import StoveSlot from './StoveSlot';

function StoveList(props) {
    // 当前共解锁了多少炉位
    const slotsNum = useMemo(() => {
        return props.stoveStat.maxStove + 2
    }, [props.stoveStat.maxStove])

    // 初始化更新炉子状态
    const [slotsStateList, setSlotsStateList] = useState(utils.getStoveState(props.stoveList, Date.now()))
    // 第一个空的炉位，需要放唯一的炼卡button
    let firstBlankIndex = slotsStateList.length < slotsNum ? slotsStateList.length : -1

    // 从卡炉内取出一张炼好的卡：
    // 1. 检查换卡箱有无足够的位置，如有，将卡片放入换卡箱，并继续，否则提示
    // 2. 根据炼好的卡所属的主题，检查换卡箱、保险箱的卡片加起来是否集齐了该套主题
    //    2.1 如是，更新集卡册，并把已集成的套卡卡片从换卡箱、保险箱移除
    //         2.1.1 更新炼炉槽位，如有排队中的卡牌，选择排在最前的开始炼制
    //         2.1.2 增加（集齐套卡奖励的）金币
    //         2.1.3 增加（炼成这张卡 + 集齐套卡奖励的）经验值
    //    2.2 如否
    //         2.2.1 增加（炼成这张卡的）经验值
    // 3. 检查是否升级，根据不同的等级给予不同的（解锁炉子、换卡（保险）箱卡位上限、魔力）奖励
    function getACardFromSlot(slotIndex) {
        if (props.repStat.bagSlotNum > props.bagList.length) {
            // 从卡槽中删除这张卡片
            let stoveList = JSON.parse(JSON.stringify(props.stoveList))
            stoveList.splice(slotIndex, 1)
            dpa.updateStoveList(stoveList)
            // 如有排队中的卡则开始炼制
            // 将卡片加入换卡箱
            let cardId = props.stoveList[slotIndex].cardId
            dpa.addACardToBagList(cardId)
            let themeCollected = dpa.getCardFromStoveAndCheckTheme(slotIndex)
            if (themeCollected) {

            } else {
                let cardData = getData.getCardById(cardId)
                let exp = parseInt(cardData.price, 10)
                dpa.addExp(exp)
            }
        } else {
            Modal.info({
                title: '无法取出',
                content: '换卡箱没有足够的位置，请先整理换卡箱',
            });
        }
    }

    function handleCardRefined(slotIndex) {
        console.log('卡片倒计时结束')
        setSlotsStateList(utils.getStoveState(props.stoveList, Date.now()))
    }

    return (
        <>
            <ul className="stovelist">
                {(new Array(5)).fill(1).map((_, index) => {
                    if (index < slotsNum) {
                        if (slotsStateList[index]) {
                            return (
                                <li key={Math.random()}>
                                    <StoveSlotWithCard
                                        slotIndex={index}
                                        cardId={slotsStateList[index].cardId}
                                        state={slotsStateList[index].state}
                                        restTime={slotsStateList[index].restTime}
                                        onGetCard={_ => { getACardFromSlot(index) }}
                                        onCardRefined={_ => { handleCardRefined(index) }} />
                                </li>)
                        } else {
                            return (
                                <li key={Math.random()}>
                                    <StoveSlot slotType="blank" />
                                    {firstBlankIndex === index && <Button type="primary" shape="round">炼卡</Button>}
                                </li>)
                        }
                    } else {
                        return (
                            <li key={Math.random()}>
                                <StoveSlot slotType="locked" slotChild={index === 3 ? '5级解锁' : '10级解锁'} />
                            </li>)
                    }
                })}
            </ul>
        </>
    )
}

StoveList.defaultProps = {
}

const mapStateToProps = (state) => {
    return {
        stoveStat: state.stoveStat,
        stoveList: state.stoveList,
        repStat: state.repStat,
        bagList: state.bagList,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        addACardToStove: function (cardId, stoveList, maxStove, nowSamp) {
            // let costTime = parseInt(getData.getCombineRuleByCardId(cardId).time) * 1000
            // dispatch({
            //     type: 'stove_list/doneACard',
            //     slotIndex
            // })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoveList)