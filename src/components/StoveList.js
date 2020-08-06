import React, { useMemo, } from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd';

// import getData from '../getData'
// import * as time from '../time'
// import * as utils from '../utils'

import './StoveList.css'
import StoveSlotWithCard from './StoveSlotWithCard';
import StoveSlot from './StoveSlot';

function StoveList(props) {
    // 当前共解锁了多少炉位
    const slotsNum = useMemo(() => {
        return props.stoveStat.maxStove + 2
    }, [props.stoveStat.maxStove])

    return (
        <>
            <ul className="stovelist">
                {(new Array(5)).fill(1).map((_, index) => {
                    if (index < slotsNum) {
                        if (props.stoveList[index]) {
                            return (
                                <li key={Math.random()}>
                                    <StoveSlotWithCard slotIndex={index} />
                                </li>)
                        } else {
                            return (
                                <li key={Math.random()}>
                                    <StoveSlot slotType="blank" />
                                    <Button type="primary" shape="round">炼卡</Button>
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
        stoveList: state.stoveList
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoveList)