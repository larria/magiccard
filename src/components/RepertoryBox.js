import React from 'react'
import { connect } from 'react-redux'
import { Tabs, Button, Tooltip, Modal } from 'antd';
import { SearchOutlined, MoneyCollectOutlined, LoginOutlined, LogoutOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Card from './Card'
import BagList from './BagList'
import ChestList from './ChestList'

import getData from '../getData'

import './RepertoryBox.css'

const { TabPane } = Tabs;
const { confirm } = Modal;

function RepertoryBox(props) {
    // 换卡箱内卡片鼠标移入时添加
    function onBagHoverRet(bagCardIndex) {
        return (
            <ul className="repertory_baglist_btn_w">
                <li>
                    <Tooltip title="卖出">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<MoneyCollectOutlined />}
                            onClick={toSellACardFromBag.bind(this, bagCardIndex)}
                        />
                    </Tooltip>
                </li>
                <li>
                    <Tooltip title="查看主题">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<SearchOutlined />}
                        />
                    </Tooltip>
                </li>
                <li>
                    <Tooltip title="移入保险箱">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<LoginOutlined />}
                            onClick={toMoveACardFromBagToChest.bind(this, bagCardIndex)}
                        />
                    </Tooltip>
                </li>
            </ul>
        )
    }

    // 保险内卡片鼠标移入时添加
    function onChestHoverRet(chestCardIndex) {
        return (
            <ul className="repertory_baglist_btn_w">
                <li>
                    <Tooltip title="查看主题">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<SearchOutlined />}
                        />
                    </Tooltip>
                </li>
                <li>
                    <Tooltip title="移入换卡箱">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<LogoutOutlined />}
                            onClick={toMoveACardFromChestToBag.bind(this, chestCardIndex)}
                        />
                    </Tooltip>
                </li>
            </ul>
        )
    }

    // 从换卡箱卖一张卡
    function toSellACardFromBag(bagCardIndex) {
        confirm({
            title: '确认要卖出？',
            icon: <ExclamationCircleOutlined />,
            content: <Card
                showPrice={true}
                showNameInBigCard={true}
                id={props.bagList[bagCardIndex]} />,
            onOk() {
                let cardId = props.bagList[bagCardIndex]
                let cardInfo = getData.getCardById(cardId)
                props.sellACardFromBag(bagCardIndex, cardInfo)
            },
            onCancel() {
                console.log('已取消');
            },
            okText: '确认',
            cancelText: '取消'
        });
    }

    // 从换卡箱移到保险箱
    function toMoveACardFromBagToChest(bagCardIndex) {
        if (props.chestList.length < props.repStat.chestSlotNum) {
            let cardId = props.bagList[bagCardIndex]
            let cardInfo = getData.getCardById(cardId)
            props.moveACardFromBagToChest(bagCardIndex, cardInfo)
        } else {
            Modal.info({
                title: '保险箱已满',
                content: null,
                onOk() { },
            });
        }
    }

    // 从保险箱移到换卡箱
    function toMoveACardFromChestToBag(chestCardIndex) {
        if (props.bagList.length < props.repStat.bagSlotNum) {
            let cardId = props.chestList[chestCardIndex]
            let cardInfo = getData.getCardById(cardId)
            props.moveACardFromChestToBag(chestCardIndex, cardInfo)
        } else {
            Modal.info({
                title: '换卡箱已满',
                content: null,
                onOk() { },
            });
        }
    }

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
                {/* <Tabs defaultActiveKey="1" onChange={callback}> */}
                <Tabs defaultActiveKey="bag">
                    <TabPane tab="换卡箱" key="bag">
                        <div className="repertory_bag_w">
                            <h3>换卡箱<span>{props.bagList.length}/{props.repStat.bagSlotNum}</span></h3>
                            <div className="repertory_bag_ctrl">
                                <button onClick={drawACardToBag}>抽一张卡</button>
                                <button>一键抽卡</button>
                                <button>一键卖朴素卡</button>
                            </div>
                            <BagList onHoverRet={onBagHoverRet}
                            />
                        </div>
                    </TabPane>
                    <TabPane tab="保险箱" key="chest">
                        <div className="repertory_chest_w">
                            <h3>保险箱<span>{props.chestList.length}/{props.repStat.chestSlotNum}</span></h3>
                            <div className="repertory_chest_ctrl">
                                xxxx
                        </div>
                            <ChestList onHoverRet={onChestHoverRet}></ChestList>
                        </div>
                    </TabPane>
                </Tabs>
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
                type: 'bag_list/addCard',
                card_id
            }
            dispatch(action);
        },
        sellACardFromBag: (bagCardIndex, toSellCardInfo) => {
            // 增加金币
            dispatch({
                type: 'addGold',
                gold: toSellCardInfo.price
            });
            // 从换卡箱移除卡片
            dispatch({
                type: 'bag_list/removeCard',
                index: bagCardIndex
            });
        },
        moveACardFromBagToChest: (bagCardIndex, toMoveCardInfo) => {
            // 从换卡箱移除卡片
            dispatch({
                type: 'bag_list/removeCard',
                index: bagCardIndex
            });
            // 往保险箱放入卡片
            dispatch({
                type: 'chest_list/addCard',
                card_id: toMoveCardInfo.id
            });
        },
        moveACardFromChestToBag: (chestCardIndex, toMoveCardInfo) => {
            // 从保险箱移除卡片
            dispatch({
                type: 'chest_list/removeCard',
                index: chestCardIndex
            });
            // 往换卡箱放入卡片
            dispatch({
                type: 'bag_list/addCard',
                card_id: toMoveCardInfo.id
            });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RepertoryBox)