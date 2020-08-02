import React from 'react'
import { connect } from 'react-redux'
import { Button, Popover } from 'antd';

import Card from './Card'

import getData from '../getData'

import './BagList.css'

function BagList(props) {

    const _popContent = (
        <div className="baglist_card_pop">
            <Button type="primary" shape="round">卖出</Button>
            <Button type="primary" shape="round" style={{ marginTop: '10px' }}>放入卡箱</Button>
            <Button type="primary" shape="round" style={{ marginTop: '10px' }}>查看主题</Button>
        </div>
    );
    return (
        <>
            <ul className="baglist_w">
                {
                    new Array(props.repStat.bagSlotNum).fill(1).map((item, index) => {
                        let res
                        if (props.bagList[index]) {
                            res = (
                                <li key={index}>
                                    <Popover content={_popContent} title={null}>
                                        <div className="baglist_card">
                                            <Card
                                                showPrice={true}
                                                showNameInBigCard={true}
                                                id={props.bagList[index]}
                                            />
                                        </div>
                                    </Popover>
                                </li>)
                        } else {
                            res = (
                                <li key={index}>
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

export default connect(mapStateToProps, mapDispatchToProps)(BagList)