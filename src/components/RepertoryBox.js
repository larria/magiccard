import React from 'react'
import { connect } from 'react-redux'
import BagList from './BagList'
import ChestList from './ChestList'

import getData from '../getData'

import './RepertoryBox.css'

function RepertoryBox(props) {

    // 随机抽一张卡
    function drawACardToBag() {
        if (props.bagList.length < props.repStat.bagSlotNum) {
            props.addACardToBag()
        }
    }
    return (
        <>
            <div className="repertory_box_w">
                <div className="repertory_ctrl">
                    <button onClick={props.handleClickClose}>关闭</button>
                </div>
                <div className="repertory_box_cont">
                    <div className="repertory_bag_w">
                        <h3>换卡箱<span>{props.bagList.length}/{props.repStat.bagSlotNum}</span></h3>
                        <div className="repertory_bag_ctrl">
                            <button onClick={drawACardToBag}>抽一张卡</button>
                            <button>一键抽卡</button>
                            <button>一键卖朴素卡</button>
                        </div>
                        <BagList></BagList>
                    </div>
                    <div className="repertory_chest_w">
                        <h3>保险箱<span>{props.chestList.length}/{props.repStat.chestSlotNum}</span></h3>
                        <div className="repertory_chest_ctrl">
                            xxxx
                        </div>
                        <ChestList></ChestList>
                    </div>
                </div>
            </div>
        </>
    )
}

RepertoryBox.defaultProps = {
    handleClickClose: () => { },
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
        addACardToBag: () => {
            let card_id = getData.getCardsRandomFromCanGet(1)
            let action = {
                type: 'addCard',
                card_id
            }
            dispatch(action);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RepertoryBox)