import React, { useState, useMemo } from 'react'
import { connect } from 'react-redux'
import { Modal, Button, Tooltip } from 'antd'

import './MiniFastShopList.css'
import getData from '../getData'
import * as utils from '../utils'
import * as dpa from '../dispatchActionWithBusiness'

import Card from './Card'
import DiffStar from './DiffStar'
import ThemePreview from './ThemePreview'
import ThemeLogo from './ThemeLogo'

function MiniFastShopList(props) {
    let themeData = getData.getThemeById(props.showThemeId)
    let cardsOfTheme = getData.getCardsByThemeId(props.showThemeId)
    let cardsSortByPrice = getData.getCardsByThemeIdAndSortByPrice(props.showThemeId)

    // 点击选中的卡片
    const [selectedCardId, setSelectedCardId] = useState(null)

    // 选中卡片的合成信息
    let fromSelectCardIdList = useMemo(() => {
        if (selectedCardId) {
            let combData = getData.getCombineRuleByCardId(selectedCardId)
            if (combData) {
                return combData.from.split(',')
            }
        }
        return null
    }, [selectedCardId])

    function getCardStyle(cardId) {
        if (selectedCardId && selectedCardId === cardId) {
            return {
                backgroundColor: 'gold'
            }
        }
        if (fromSelectCardIdList && fromSelectCardIdList.includes(cardId)) {
            return {
                backgroundColor: 'tomato'
            }
        }
        return {}
    }

    // 已经获得的卡片个数
    function getCardInfoInRepAndStove(cardId) {
        let repList = props.bagList.concat(props.chestList)
        let numsInRep = repList.filter(cardIdInRep => cardIdInRep === cardId).length
        let numsInStove = props.stoveList.filter(stoveItem => stoveItem.cardId === cardId).length
        return {
            numsInRep,
            numsInStove
        }
    }

    function handleClickCard(cardId) {
        if (props.listType.includes('minishop')) {
            setSelectedCardId(cardId)
        } else {
            props.onCardClick && props.onCardClick(cardId)
        }
    }

    // 购买素材卡
    function handleBuyCard(cardId) {
        let cardData = getData.getCardById(cardId)
        if (props.gold >= cardData.price) {
            if (props.repStat.bagSlotNum > props.bagList.length) {
                props.buyACardFromShop(cardData.price)
                // 检查是否合成了一套卡
                let currentBagList = [...props.bagList, cardId]
                let themeCollected = utils.checkThemeCollected(currentBagList, props.chestList, [cardData.theme_id])
                // 有集齐主题所有的卡
                // collectedThemeIds,
                // bagCardIds,
                // chestCardIds
                if (themeCollected) {
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
                        exp += (diffNum * diffNum * 10)
                        // 将合成的主题放入集卡册
                        dpa.addAThemeToBook(themeId)
                    })
                    dpa.addGold(gold)
                    dpa.addExp(exp)
                    dpa.addPower(parseInt(gold / 10))
                } else {
                    props.addACardToBag(cardId)
                }
            } else {
                Modal.info({
                    title: '换卡箱满了',
                    content: `请整理换卡箱`,
                })
            }

        } else {
            Modal.info({
                title: '金币不够',
                content: `购买卡片${cardData.name}需要支付${cardData.price}金币`,
            })
        }
    }

    // 炼这张卡
    function handleRefineCard(cardId) {
        if (props.stoveList.length < props.stoveStat.maxStove + 2) {
            // 将卡片加入炉位
            let startToRefineAt = utils.getStartToRefineAt(props.stoveList, props.stoveStat.maxStove)
            props.addACardToStove(cardId, startToRefineAt)

            // 从换卡箱和保险箱移除素材卡
            let combData = getData.getCombineRuleByCardId(cardId)
            let fromCardIdList = combData.from.split(',')
            let newBagList = JSON.parse(JSON.stringify(props.bagList))
            let newChestList = JSON.parse(JSON.stringify(props.chestList))
            fromCardIdList.forEach(cardId => {
                // 优先从换卡箱中移除
                let cardIndexInBagList = newBagList.findIndex(cardIdInBagList => cardIdInBagList === cardId)
                if (cardIndexInBagList === -1) {
                    let cardIndexInChestList = newChestList.findIndex(cardIdInChestList => cardIdInChestList === cardId)
                    if (cardIndexInChestList === -1) {
                        alert('换卡箱和保险箱都找不到素材卡，程序疑似错误')
                    } else {
                        newChestList.splice(cardIndexInChestList, 1)
                    }
                } else {
                    newBagList.splice(cardIndexInBagList, 1)
                }
            })
            if (newBagList.length !== props.bagList.length) {
                dpa.updateBagList(newBagList)
            }
            if (newChestList.length !== props.chestList.length) {
                dpa.updateChestList(newChestList)
            }
        } else {
            Modal.info({
                title: '炉位已满',
                content: null,
            })
        }
    }

    // 每张卡片的jsx
    function getListCardJSX(cardData) {
        let cardNums = getCardInfoInRepAndStove(cardData.id)
        // 普通卡的10面值卡支持购买
        let showBuyBtn =  themeData.type === '0' && cardData.price === '10'

        // 是否显示合成按钮
        let showCombBtn = true
        let combData = getData.getCombineRuleByCardId(cardData.id)
        if (combData && props.listType.includes('minishop')) {
            // 如果可合成及炼卡类型
            if (props.listType === 'minishopLv2' && cardData.price !== '40') {
                // 如果是偷炉炼卡类型，非40面值的卡不显示合成按钮
                showCombBtn = false
            } else {
                // 普通炼卡类型，检查合成的材料卡是否齐备，否则不显示合成按钮
                let fromCardIdList = combData.from.split(',')
                for (let i = 0; i < fromCardIdList.length; i++) {
                    let fromCardId = fromCardIdList[i]
                    if (!props.bagList.includes(fromCardId) && !props.chestList.includes(fromCardId)) {
                        showCombBtn = false
                        break
                    }
                }
            }
        } else {
            showCombBtn = false
        }

        return (
            <li key={cardData.id}>
                <Tooltip title={cardData.name}>
                    <span className="minifastshop_list_card_w" onClick={e => handleClickCard(cardData.id)} style={getCardStyle(cardData.id)}>
                        <Card id={cardData.id} isSmall={true} />
                        {cardNums.numsInRep !== 0 && (
                            <>
                                <span className="minifastshop_list_card_rep_num">{cardNums.numsInRep}</span>
                                <span className="minifastshop_list_card_rep_num_bg"></span>
                            </>
                        )}
                        {cardNums.numsInStove !== 0 && (
                            <span className="minifastshop_list_card_mask">合成中</span>
                        )}
                        {cardNums.numsInRep === 0 && cardNums.numsInStove === 0 && (
                            <span className="minifastshop_list_card_mask"></span>
                        )}
                    </span>
                </Tooltip>
                {showBuyBtn && (
                    <Button
                        type="primary"
                        size="small"
                        onClick={e => { handleBuyCard(cardData.id) }}
                    >购买</Button>
                )}
                {showCombBtn && (
                    <Button
                        type="primary"
                        size="small"
                        onClick={e => { handleRefineCard(cardData.id) }}
                    >合成</Button>
                )}
            </li>)
    }

    return (
        <>
            <div className="minifastshop_list_w">
                <div className="minifastshop_list_head">
                    <ThemeLogo theme_id={themeData.id} />
                    <h4 className="minifastshop_list_title">{themeData.name}</h4>
                    <DiffStar diff={themeData.diff} size={14} />
                    <p className="minifastshop_list_info">共{cardsOfTheme.length}张卡片</p>
                </div>
                <ul className="minifastshop_list">
                    {
                        cardsSortByPrice.map(cardsByPriceObj => {
                            return (
                                <li className="minifastshop_list_price_lvl" key={cardsByPriceObj.price}>
                                    <p className="minifastshop_list_price_lvl_info">
                                        <span>面值：{cardsByPriceObj.price}</span>
                                        {getData.getCombineRuleByCardId(cardsByPriceObj.cards[0].id) && (<span>合成时间：{utils.getTimeFormat(parseInt(getData.getCombineRuleByCardId(cardsByPriceObj.cards[0].id).time, 10))}</span>)}
                                    </p>
                                    <ul className="minifastshop_list_price_lvl_list">
                                        {cardsByPriceObj.cards.map(cardData => {
                                            return getListCardJSX(cardData)
                                        })}
                                    </ul>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </>
    )
}

MiniFastShopList.defaultProps = {
    showThemeId: '40',
    // 该列表的使用场景：
    // 1. 'minishopAll' - 炼卡时用，可购买素材卡，合成所有可合成卡片
    // 1. 'minishopLv2' - 炼卡时用，可购买素材卡，只能合成底层素材卡可合成的卡片，用于偷炉
    // 2. 'alter' - 变卡时用，可购买素材卡。合成卡片
    listType: 'minishopAll',
    // 每张卡片的点击回调，目前仅变卡（listType为'alter'）时可用
    onCardClick: () => {}
}
const mapStateToProps = (state) => {
    return {
        exp: state.exp,
        gold: state.gold,
        power: state.power,
        repStat: state.repStat,
        bagList: state.bagList,
        chestList: state.chestList,
        stoveList: state.stoveList,
        stoveStat: state.stoveStat
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        addACardToBag: (cardId) => {
            let action = {
                type: 'bag_list/addOneCard',
                cardId
            }
            dispatch(action);
        },
        addACardToStove: (cardId, startToRefineAt) => {
            let action = {
                type: 'stove_list/putACardInStove',
                cardId,
                startToRefineAt
            }
            dispatch(action);
        },
        buyACardFromShop: (gold) => {
            let action = {
                type: 'subGold',
                gold
            }
            dispatch(action);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MiniFastShopList)
