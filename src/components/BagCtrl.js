import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Modal } from 'antd';
import { MoneyCollectOutlined, ExclamationCircleOutlined, DownloadOutlined } from '@ant-design/icons';

import getData from '../getData'
import * as time from '../time'
import * as utils from '../utils'

const { confirm } = Modal;

function BagCtrl(props) {
    // 抽卡间隔/秒
    const DRAW_INTERVAL = 1800
    // 抽卡剩余时间
    const [canDrawLeftTime, setCanDrawLeftTime] = useState(utils.getTimeFormat(Math.max(0, DRAW_INTERVAL - ((Date.now() - props.drawStat.lastResetTimeAtSamp) / 1000))))
    useEffect(() => {
        // 更新可抽卡的状态
        time.addTask({
            name: 'countDrawNum',
            handle: function (now) {
                if (props.drawStat.lastDrawNumLeft < 16) {
                    let drawNumFromTime = (now - props.drawStat.lastResetTimeAtSamp) / (DRAW_INTERVAL * 1000)
                    // 时间到了
                    if (drawNumFromTime > 1) {
                        props.updateDrawStatFromTime(parseInt(drawNumFromTime, 10))
                    }
                    setCanDrawLeftTime(utils.getTimeFormat(Math.max(0, DRAW_INTERVAL - ((Date.now() - props.drawStat.lastResetTimeAtSamp) / 1000))))
                } else {
                    time.removeTask('countDrawNum')
                }
            }
        })
        return () => {
            // 组件卸载
            time.removeTask('countDrawNum')
        }
    }, [props.drawStat.lastDrawNumLeft]);

    // 抽一张卡进换卡箱
    function drawACardToBag() {
        if (props.bagList.length < props.repStat.bagSlotNum) {
            if (props.drawStat.lastDrawNumLeft > 0) {
                props.addACardToBag()
                // 如果之前卡位已满，则重置下一次抽卡时间
                props.drawCards(1, props.drawStat.lastDrawNumLeft === 16)
            } else {
                Modal.info({
                    title: '暂时没有抽卡次数',
                    content: null,
                    onOk() { },
                });
            }
        } else {
            Modal.info({
                title: '换卡箱已满',
                content: null,
                onOk() { },
            });
        }
    }

    // 一键抽卡
    function drawCardsToBag() {
        let num = Math.min(props.repStat.bagSlotNum - props.bagList.length, props.drawStat.lastDrawNumLeft)
        if (num > 0) {
            props.addCardsToBag(num)
            props.drawCards(num, props.drawStat.lastDrawNumLeft === 16)
        } else {
            Modal.info({
                title: '换卡箱已满 或 没有抽卡次数',
                content: null,
            });
        }
    }

    // 一键出售普卡
    function sellAllNormalCards() {
        let toSoldCardsList = []
        let soldGold = 0
        let leftCardsList = []
        props.bagList.forEach(card_id => {
            let cardInfo = getData.getCardById(card_id)
            let themeInfo = getData.getThemeById(cardInfo.theme_id)
            // 面值为10，且属于普通卡
            if (cardInfo.price === '10' && themeInfo.type === '0') {
                toSoldCardsList.push(card_id)
                soldGold += parseInt(cardInfo.price, 10)
            } else {
                leftCardsList.push(card_id)
            }
        })
        if (toSoldCardsList.length > 0) {
            confirm({
                title: `确认要一键卖出${toSoldCardsList.length}张普通素材卡？`,
                icon: <ExclamationCircleOutlined />,
                onOk() {
                    props.addGold(soldGold)
                    props.updateBagList(leftCardsList)
                },
                onCancel() {
                    console.log('已取消');
                },
                okText: '确认',
                cancelText: '取消'
            });
        } else {
            Modal.info({
                title: '换卡箱没有可售出的普通素材卡',
                content: null,
                onOk() { },
            });
        }
    }

    return (
        <>
            <Button className="repertory_bag_btn" icon={<DownloadOutlined />} size="small" onClick={drawACardToBag} disabled={props.drawStat.lastDrawNumLeft <= 0}>抽卡</Button>
            <Button className="repertory_bag_btn" type="primary" icon={<DownloadOutlined />} size="small" disabled={props.drawStat.lastDrawNumLeft <= 0} onClick={drawCardsToBag}>一键抽卡[{props.drawStat.lastDrawNumLeft}]</Button>
            <div className="repertory_draw_stat">
                {props.drawStat.lastDrawNumLeft < 16 && <span className="repertory_draw_time"> 下一张卡：{canDrawLeftTime}</span>}
            </div>
            <span style={{flex: '1'}}></span>
            <Button className="repertory_bag_btn repertory_bag_btn_sell_all" type="primary" icon={<MoneyCollectOutlined />} size="small" onClick={sellAllNormalCards}>一键卖普卡</Button>
        </>
    )
}

BagCtrl.defaultProps = {
}

const mapStateToProps = (state) => {
    return {
        exp: state.exp,
        gold: state.gold,
        power: state.power,
        repStat: state.repStat,
        bagList: state.bagList,
        drawStat: state.drawStat
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        addACardToBag: () => {
            let cardId = getData.getCardsRandomFromCanGet(1)[0]
            let action = {
                type: 'bag_list/addOneCard',
                cardId
            }
            dispatch(action);
        },
        addCardsToBag: (num) => {
            let cardList = getData.getCardsRandomFromCanGet(num)
            let action = {
                type: 'bag_list/addCards',
                cardList
            }
            dispatch(action);
        },
        addGold: (goldToAdd) => {
            // 增加金币
            dispatch({
                type: 'addGold',
                gold: goldToAdd
            });
        },
        updateBagList: (cardList) => {
            // 更新换卡箱列表
            dispatch({
                type: 'bag_list/updateCard',
                cardList
            });
        },
        updateDrawStatFromTime: (numFromTime) => {
            // 定时更新可抽卡的状态
            dispatch({
                type: 'draw/updateDrawStat',
                addDrawNumFromTime: numFromTime,
                time: Date.now()
            });
        },
        drawCards: (num, toReSetDrawTime) => {
            // 抽取一定数量的卡片
            if (toReSetDrawTime) {
                let now = Date.now()
                dispatch({
                    type: 'draw/drawCardsAndResetTime',
                    drawNum: num,
                    now
                })
            } else {
                dispatch({
                    type: 'draw/drawCards',
                    drawNum: num
                })
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BagCtrl)