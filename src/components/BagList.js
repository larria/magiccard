import React from 'react'
import { connect } from 'react-redux'
// import { Button } from 'antd';

import Card from './Card'

// import getData from '../getData'

import './BagList.css'

function BagList(props) {

    return (
        <>
            <ul className="baglist_w">
                {
                    new Array(props.repStat.bagSlotNum).fill(1).map((item, index) => {
                        let res
                        if (props.bagList[index]) {
                            res = (
                                <li key={Math.random()}>
                                    <div className="baglist_card">
                                        <Card
                                            showPrice={true}
                                            showNameInBigCard={true}
                                            id={props.bagList[index]}
                                        />
                                        {props.onHoverRet && <div className="baglist_card_hover">{props.onHoverRet(index)}</div>}
                                    </div>
                                </li>)
                        } else {
                            res = (
                                <li key={Math.random()}>
                                    <div className="baglist_card_empty">
                                        <span>空卡位</span>
                                    </div>
                                </li>)
                        }
                        return res
                    })
                }
            </ul>
        </>
    )
}

BagList.defaultProps = {
    onHoverRet: null
}

const mapStateToProps = (state) => {
    return {
        exp: state.exp,
        gold: state.gold,
        power: state.power,
        repStat: state.repStat,
        bagList: state.bagList,
        chestList: state.chestList,
        lastDrawTime: state.lastDrawTime
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BagList)