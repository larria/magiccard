import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Modal } from 'antd';

import getData from '../getData'
// import * as time from '../time'
import * as utils from '../utils'
import * as dpa from '../dispatchActionWithBusiness'

import './StoveList.css'
import StoveSlotWithCard from './StoveSlotWithCard';
import StoveSlot from './StoveSlot';
import ThemePreview from './ThemePreview';

function StoveList(props) {
    // 当前共解锁了多少炉位
    const slotsNum = useMemo(() => {
        return props.stoveStat.maxStove + 2
    }, [props.stoveStat.maxStove])

    // 更新炉位render数据
    const slotsRenderState = utils.getStoveRenderState(props.stoveList, Date.now())

    // 第一个空的炉位，需要放唯一的炼卡button
    let firstBlankIndex = slotsRenderState.length < slotsNum ? slotsRenderState.length : -1

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
            let cardId = props.stoveList[slotIndex].cardId
            // 从卡槽中删除这张卡片
            let stoveList = JSON.parse(JSON.stringify(props.stoveList))
            stoveList.splice(slotIndex, 1)
            dpa.updateStoveList(stoveList)

            let cardData = getData.getCardById(cardId)
            let exp = parseInt(cardData.price, 10)

            let currentBagList = [...props.bagList, cardId]
            let themeCollected = utils.checkThemeCollected(currentBagList, props.chestList, [cardData.theme_id])
            if (themeCollected) {
                // 有集齐主题所有的卡
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
                let gold = 0
                themeCollected.collectedThemeIds.forEach(themeId => {
                    let diffNum = parseInt(getData.getThemeById(themeId).diff)
                    gold += (diffNum * diffNum * 100)
                    exp += (diffNum * diffNum * 10)
                    // 将合成的主题放入集卡册
                    dpa.addAThemeToBook(themeId)
                })
                dpa.addGold(gold)
                dpa.addExp(exp)
            } else {
                // 没有合成主题，只增加经验
                dpa.addExp(exp)
                // 将卡片加入换卡箱
                dpa.addACardToBagList(cardId)
            }
        } else {
            Modal.info({
                title: '无法取出卡片',
                content: '换卡箱空位不足，请先整理换卡箱',
            });
        }
    }

    // 处理卡片炼制完成
    function handleCardRefined(slotIndex) {
        console.log('卡片倒计时结束')
        // 强刷渲染状态
        dpa.updateStoveList(props.stoveList)
    }

    return (
        <>
            <ul className="stovelist">
                {(new Array(5)).fill(1).map((_, index) => {
                    if (index < slotsNum) {
                        if (slotsRenderState[index]) {
                            return (
                                <li key={Math.random()}>
                                    <StoveSlotWithCard
                                        slotIndex={index}
                                        cardId={slotsRenderState[index].cardId}
                                        state={slotsRenderState[index].state}
                                        restTime={slotsRenderState[index].restTime}
                                        onGetCard={_ => { getACardFromSlot(index) }}
                                        onCardRefined={_ => { handleCardRefined(index) }} />
                                </li>)
                        } else {
                            return (
                                <li key={Math.random()}>
                                    <StoveSlot slotType="blank" />
                                    {firstBlankIndex === index && <Button type="primary" shape="round" onClick={e => {props.showMiniShop()}}>炼卡</Button>}
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
        bagList: state.bagList,
        chestList: state.chestList,
        stoveStat: state.stoveStat,
        stoveList: state.stoveList,
        repStat: state.repStat,
        minifastshop: state.minifastshop
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        showMiniShop: function () {
            dispatch({
                type: 'minifastshop/setShow',
                isShow: true
            })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoveList)