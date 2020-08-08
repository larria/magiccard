import { store } from './Store'

import getData from './getData'

// 该模块的方法只读state

// 从卡炉内取出一张炼好的卡时，检查是否集齐了一套主题
export function getCardFromStoveAndCheckTheme(stoveSlotIndex) {
    const state = JSON.parse(JSON.stringify(store.getState()))
    let cardId = state.stoveList[stoveSlotIndex].cardId
    let themeData = getData.getThemeByCardId(cardId)
    let collectRes = _checkThemeCollected(state.bagList, state.chestList, [themeData.id])
    if (collectRes) {
        // 2.1
        // console.log(collectRes)
        return collectRes
    } else {
        // 2.2
        return false
    }
}

// 检查是否合成了主题
function _checkThemeCollected(bagCardIds, chestCardIds, themeIds) {
    let collectedThemeIds = []
    if (!(themeIds instanceof Array)) {
        console.log('themeIds:' + themeIds + '必须是数组');
        return;
    }
    // 用set排重
    let themeIdsSet = new Set(themeIds)
    // bagCardIds = [...bagCardIds]
    // chestCardIds = [...chestCardIds]
    themeIdsSet.forEach(themeId => {
        let cardOfThemesIdSet = new Set(getData.getCardIdsByThemeId(themeId))
        // console.log(cardOfThemesIdSet)
        let bagCardIdsTemp = [...bagCardIds]
        let chestCardIdsTemp = [...chestCardIds]
        // console.log([...cardOfThemesIdSet])
        // console.log(...bagCardIdsTemp)
        // console.log(...chestCardIdsTemp)
        for (let i = bagCardIdsTemp.length - 1; i >= 0; i--) {
            if (typeof bagCardIdsTemp[i] === 'string') {
                let cardId = bagCardIdsTemp[i]
                // 这张卡属于主题
                if (cardOfThemesIdSet.has(cardId)) {
                    // 从换卡箱中删除
                    bagCardIdsTemp.splice(i, 1)
                    // 从查找的主题中删除
                    cardOfThemesIdSet.delete(cardId)
                }
            } else {
                continue
            }
        }
        for (let i = chestCardIdsTemp.length - 1; i >= 0; i--) {
            if (typeof chestCardIdsTemp[i] === 'string') {
                let cardId = chestCardIdsTemp[i]
                // 这张卡属于主题
                if (cardOfThemesIdSet.has(cardId)) {
                    // 从保险箱中删除
                    chestCardIdsTemp.splice(i, 1)
                    // 从查找的主题中删除
                    cardOfThemesIdSet.delete(cardId)
                }
            } else {
                continue
            }
        }
        // 如果查找的主题卡片列表清空了，说明集齐了
        if (cardOfThemesIdSet.size === 0) {
            // console.log(`检查出${themeId}集齐了`)
            collectedThemeIds.push(themeId)
            bagCardIds = bagCardIdsTemp
            chestCardIds = chestCardIdsTemp
        }
    })
    // 如果有集齐的主题，返回集齐的主题、集齐后的换卡箱、保险箱卡片列表
    if (collectedThemeIds.length > 0) {
        return {
            collectedThemeIds,
            bagCardIds,
            chestCardIds
        }
    } else {
        return false
    }
}

export function setName() {
    // const state = store.getState()
    store.dispatch({
        type: 'setUserName',
        name: 'Lynn'
    })
}

export function addExp(exp = 99) {
    // const state = store.getState()
    store.dispatch({
        type: 'addExp',
        exp
    })
}

export function addACardToBagList(cardId) {
    cardId = cardId.toString()
    store.dispatch({
        type: 'bag_list/addOneCard',
        cardId,
    })
}

// 给换卡箱放1套完整主题，用以测试自动检查主题合成
export function updateBagListWithATheme() {
    // const state = store.getState()
    // let cards = getData.getCardsByThemeId()
    let cardList = ["29", "30", "31", "32", "33", "35", "36", "37", "38", "39", "64", "65", "66"]
    store.dispatch({
        type: 'bag_list/updateCard',
        cardList
    })
}

// 给已收集放入一个主题，测试用
export function addAThemeToBook() {
    store.dispatch({
        type: 'book_stat/collectOneTheme',
        themeId: '52',
        collectAt: Date.now(),
    })
}

// 放一张卡在炼卡炉
export function addACardToStove(timeSamp, cardId = '9115') {
    store.dispatch({
        type: 'stove_list/putACardInStove',
        cardId,
        putInAtSamp: timeSamp || Date.now(),
    })
}

// 放一张卡在炼卡炉
export function updateStoveList(slotsList) {
    slotsList = [...slotsList]
    store.dispatch({
        type: 'stove_list/updateSlotsList',
        slotsList
    })
}

// function _checkThemeCol(toAddCardIds) {
// }