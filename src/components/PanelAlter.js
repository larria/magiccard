import React, { useState, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Modal, Tooltip } from 'antd'

import getData from '../getData'
import * as utils from '../utils'
import * as dpa from '../dispatchActionWithBusiness'

import Card from './Card'
import ThemePreview from './ThemePreview'
import PanelSearch from './PanelSearch'
import MiniRepertory from './MiniRepertory'
import MiniFastShopList from './MiniFastShopList'

import './PanelAlter.css'

// console.log(utils.checkThemeCollected(["14930", "14931", "14934", "14935", "14936", "14937", "14938", "14932"], ["2746", "14029", "2742", "4219", "2735", "12328", "3210", "6840", "3218", "2744", "3088", "2833", "14933", "3335", "2834", "3214", "6842", "3201", "3153", "6838", "6830", "2746", "3160", "6847", "3342", "3219", "2733", "6828"], ["978"]))

function PanelAlter(props) {
    const [fromCardId, setFromCardId] = useState(props.fromCardId)
    const [toCardId, setToCardId] = useState(props.toCardId)
    // 目标卡搜索主题弹窗是否显示
    const [searchModelVisible, setSearchModelVisible] = useState(false)
    // 目标卡所在主题列表弹窗是否显示
    const [themeModelVisible, setThemeModelVisible] = useState(false)
    // 目标卡所在主题id
    const [toCardThemeId, setToCardThemeId] = useState(null)
    // 选择消耗卡弹窗是否可见
    const [respModelVisible, setRespModelVisible] = useState(false)

    // 变卡提示信息
    const alterInfoTxt = useMemo(() => {
        if (fromCardId && toCardId) {
            let fromCardData = getData.getCardById(fromCardId)
            let toCardData = getData.getCardById(toCardId)
            if (parseInt(fromCardData.price, 10) < parseInt(toCardData.price, 10)) {
                return (<>消耗卡面值（<span className="alter_info_em">{fromCardData.price}</span>）需大于目标卡面值（<span className="alter_info_em">{toCardData.price}</span>）</>)
            }
            let costPower = Math.ceil(parseInt(toCardData.price) / 50)
            return (<>目标卡面值<span className="alter_info_em">{toCardData.price}，此次变卡需消耗魔力{costPower}</span></>)
        } else if (fromCardId) {
            return (<>请选择<span className="alter_info_em">目标卡</span></>)
        } else if (toCardId) {
            return (<>请选择<span className="alter_info_em">消耗卡</span></>)
        }
        return (<>请选择<span className="alter_info_em">消耗卡</span>与<span className="alter_info_em">目标卡</span></>)
    }, [fromCardId, toCardId])

    // 变卡提示信息
    const isAlterBtnAble = useMemo(() => {
        if (fromCardId && toCardId) {
            let fromCardData = getData.getCardById(fromCardId)
            let toCardData = getData.getCardById(toCardId)
            if (parseInt(fromCardData.price, 10) < parseInt(toCardData.price, 10)) {
                return false
            }
            return true
        }
        return false
    }, [fromCardId, toCardId])

    // 关闭搜索框并显示主题
    function onSearchResultClicked(themeId) {
        setSearchModelVisible(false)
        setThemeModelVisible(true)
        setToCardThemeId(themeId)
    }

    // 点击选择列表中的消耗卡
    function handleFromCardClick(cardId) {
        setFromCardId(cardId)
        setRespModelVisible(false)
    }

    // 点击选择列表中的目标卡
    function handleToCardClick(cardId) {
        setToCardId(cardId)
        setThemeModelVisible(false)
    }

    // 变卡
    function alterCard() {
        let toCardData = getData.getCardById(toCardId)
        let costPower = Math.ceil(parseInt(toCardData.price) / 50)
        if (props.power >= costPower) {
            // 找到消耗卡并删除
            let bagList = [...props.bagList]
            let chestList = [...props.chestList]
            // 优先从换卡箱找
            if (bagList.includes(fromCardId)) {
                let bagListIndex = bagList.findIndex(cardId => cardId === fromCardId)
                bagList.splice(bagListIndex, 1)
            } else if (chestList.includes(fromCardId)) {
                let chestListIndex = chestList.findIndex(cardId => cardId === fromCardId)
                chestList.splice(chestListIndex, 1)
            } else {
                Modal.info({
                    title: '换卡箱或保险箱找不到消耗卡',
                    content: null,
                    onOk() { },
                });
                return
            }
            Modal.info({
                title: `您变出了 ${toCardData.name}`,
                content: (
                    <>
                        <Card id={toCardId} />
                    </>),
                onOk() { },
            });
            // 优先将目标卡加入换卡箱
            if (bagList.length < props.repStat.bagSlotNum) {
                bagList.push(toCardId)
            } else {
                chestList.push(toCardId)
            }
            // 检查是否合成了主题
            let themeCollected = utils.checkThemeCollected(bagList, chestList, [toCardData.theme_id])
            if (themeCollected) {
                // 有合成主题
                // collectedThemeIds,
                // bagCardIds,
                // chestCardIds
                Modal.success({
                    title: `您合成了${themeCollected.collectedThemeIds.length}套主题`,
                    content: (
                        <>
                            {
                                themeCollected.collectedThemeIds.map(theme_id => {
                                    return (
                                        <ThemePreview key={theme_id} theme_id={theme_id} />
                                    )
                                })
                            }
                        </>),
                    onOk() {
                    }
                });
                dpa.updateBagList(themeCollected.bagCardIds)
                dpa.updateChestList(themeCollected.chestCardIds)
                // 集齐获得经验、金币、魔力
                let gold = 0
                let exp = 0
                themeCollected.collectedThemeIds.forEach(themeId => {
                    let diffNum = parseInt(getData.getThemeById(themeId).diff)
                    gold += (diffNum * diffNum * 100)
                    exp += (diffNum * diffNum * 100)
                    // 将合成的主题放入集卡册
                    dpa.addAThemeToBook(themeId)
                })
                dpa.addGold(gold)
                dpa.addExp(exp)
            } else {
                dpa.updateBagList(bagList)
                dpa.updateChestList(chestList)
            }
            // 消耗魔力
            props.costPower(costPower)
            // 清除消耗卡槽内的卡片
            setFromCardId(null)
        } else {
            Modal.info({
                title: '魔力不足',
                content: `此次变卡需魔力${costPower}，您现存魔力仅有${props.power}`,
                onOk() { },
            });
        }
    }

    return (
        <>
            <div className="alter_w">
                <div className="alter_box_w">
                    <div className="alter_box">
                        <h3>消耗卡</h3>
                        <div className="alter_box_card">
                            {fromCardId && (
                                <>
                                    <Card id={fromCardId} showPrice={true} showNameInBigCard={true} />
                                </>
                            )}
                        </div>
                        <Button onClick={e => { setRespModelVisible(true) }}>选择消耗卡</Button>
                    </div>
                    <div className="alter_ctrl">
                        {/* <Tooltip title="变卡"> */}
                        <span className="alter_arr"></span>
                        <Button disabled={!isAlterBtnAble} type="primary" size="large" shape="round" onClick={e => { alterCard() }}>变卡</Button>
                        {/* </Tooltip> */}
                    </div>
                    <div className="alter_box">
                        <h3>目标卡</h3>
                        <div className="alter_box_card alter_to_box_card">
                            {toCardId && (
                                <>
                                    <Card id={toCardId} showPrice={true} showNameInBigCard={true} />
                                </>
                            )}
                        </div>
                        <Button onClick={e => { setSearchModelVisible(true) }}>选择目标卡</Button>
                    </div>
                </div>
                <p className="alter_info">{alterInfoTxt}</p>
            </div>
            <Modal
                title="请选择用以消耗的卡片"
                visible={respModelVisible}
                width={650}
                centered
                footer={null}
                onOk={e => setRespModelVisible(false)}
                onCancel={e => setRespModelVisible(false)}
            >
                <MiniRepertory
                    cardIdList={props.bagList.concat(props.chestList)}
                    cardDisableRule={(cardData) => toCardId && parseInt(cardData.price, 10) < parseInt(getData.getCardById(toCardId).price, 10)}
                    onCardClick={cardData => handleFromCardClick(cardData.id)}
                />
            </Modal>
            <Modal
                title="搜索卡片主题"
                visible={searchModelVisible}
                width={650}
                centered
                footer={null}
                onOk={e => setSearchModelVisible(false)}
                onCancel={e => setSearchModelVisible(false)}
            >
                <PanelSearch
                    themesColectedInfo={props.bookStat}
                    handleClickResultTheme={onSearchResultClicked}
                />
            </Modal>
            <Modal
                title="请选择要变的卡片"
                visible={themeModelVisible}
                width={650}
                centered
                footer={null}
                onOk={e => setThemeModelVisible(false)}
                onCancel={e => setThemeModelVisible(false)}
            >
                <MiniFastShopList listType="alter" showThemeId={toCardThemeId} onCardClick={handleToCardClick} />
            </Modal>
        </>
    )
}

PanelAlter.defaultProps = {
    fromCardId: null,
    toCardId: null
}

const mapStateToProps = (state) => {
    return {
        repStat: state.repStat,
        power: state.power,
        bagList: state.bagList,
        chestList: state.chestList,
        bookStat: state.bookStat
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        costPower: (power) => {
            let action = {
                type: 'minusPower',
                power
            }
            dispatch(action)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelAlter)