import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'antd';

import Card from './Card'

import getData from '../getData'
import * as time from '../time'
import * as utils from '../utils'
import * as dpa from '../dispatchActionWithBusiness'

function StoveSlotWithCard(props) {
    const [slotTime, setSlotTime] = useState(_calcSlotTime())

    // 计算卡片还有多长时间炼成
    function _calcSlotTime() {
        let res
        let slotState = props.stoveList[props.slotIndex]
        let combTime = parseInt(getData.getCombineRuleByCardId(slotState.cardId).time, 10)
        let timeDis = slotState.putInAtSamp + combTime * 1000 - Date.now()
        // timeDis = 5000
        if (timeDis > 0) {
            // 未炼成，则计算格式化时间
            res = utils.getTimeFormat(timeDis / 1000)
        } else {
            // 已经炼成了
            res = 'done'
        }
        return res
    }

    useEffect(() => {
        // 更新可抽卡的状态
        if (slotTime !== 'done') {
            time.addTask({
                name: 'updateStoveSlotsTime' + props.slotIndex,
                handle: function (now) {
                    let res = _calcSlotTime()
                    setSlotTime(res)
                    if (res === 'done') {
                        time.removeTask('updateStoveSlotsTime' + props.slotIndex)
                        props.setSlotCardDone(props.slotIndex)
                    }
                }
            })
        } else if (!props.stoveList[props.slotIndex].done) {
            props.setSlotCardDone(props.slotIndex)
        }
        return () => {
            // 组件卸载时销毁任务
            time.removeTask('updateStoveSlotsTime' + props.slotIndex)
        }
    }, []);

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
    function handleGetCardBtn() {
        if (props.repStat.bagSlotNum > props.bagList.length) {
            // 从卡槽中删除这张卡片
            let stoveList = JSON.parse(JSON.stringify(props.stoveList))
            stoveList.splice(props.slotIndex, 1)
            dpa.updateStoveList(stoveList)
            // 如有排队中的卡则开始炼制
            // 将卡片加入换卡箱
            let cardId = props.stoveList[props.slotIndex].cardId
            dpa.addACardToBagList(cardId)
            let themeCollected = dpa.getCardFromStoveAndCheckTheme(props.slotIndex)
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

    return (
        <>
            <div className="stoveslot stoveslot_card">
                <span className="stoveslot_card_cont">
                    <Card
                        id={props.stoveList[props.slotIndex].cardId}
                        showNameInBigCard={true}
                        showPrice={true} />
                </span>
            </div>
            {slotTime === 'done' && (<Button type="primary" shape="round" onClick={() => { handleGetCardBtn() }}>取卡</Button>)}
            {slotTime !== 'done' && (<span className="">{slotTime}</span>)}
        </>
    )
}

StoveSlotWithCard.defaultProps = {
}

const mapStateToProps = (state) => {
    return {
        exp: state.exp,
        gold: state.gold,
        power: state.power,
        repStat: state.repStat,
        bagList: state.bagList,
        chestList: state.chestList,
        stoveStat: state.stoveStat,
        stoveList: state.stoveList
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setSlotCardDone: function (slotIndex) {
            dispatch({
                type: 'stove_list/doneACard',
                slotIndex
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoveSlotWithCard)