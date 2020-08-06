import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Divider, Button } from 'antd';

import Card from './Card'

import getData from '../getData'
import * as time from '../time'
import * as utils from '../utils'

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
            {slotTime === 'done' && (<Button type="primary" shape="round">取卡</Button>)}
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