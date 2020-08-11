import { store } from './Store'

import getData from './getData'
import * as utils from './utils'

// 该模块的方法只读state

// 从卡炉内取出一张炼好的卡时，检查是否集齐了一套主题
export function getCardFromStoveAndCheckTheme(cardId) {
    const state = JSON.parse(JSON.stringify(store.getState()))
    let themeData = getData.getThemeByCardId(cardId)
    let collectRes = utils.checkThemeCollected(state.bagList, state.chestList, [themeData.id])
    if (collectRes) {
        return collectRes
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

export function addGold(gold = 200) {
    store.dispatch({
        type: 'addGold',
        gold
    })
}

export function addExp(exp = 99) {
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
export function updateBagList(cardList) {
    store.dispatch({
        type: 'bag_list/updateCard',
        cardList
    })
}

// 给换卡箱放1套完整主题，用以测试自动检查主题合成
export function updateChestList(cardList) {
    store.dispatch({
        type: 'chest_list/updateCard',
        cardList
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

// 给已收集放入一个主题
export function addAThemeToBook(themeId = '52') {
    store.dispatch({
        type: 'book_stat/collectOneTheme',
        themeId,
        collectAt: Date.now(),
    })
}

// 放一张卡在炼卡炉
export function addACardToStove(timeSamp, cardId = '9115') {
    store.dispatch({
        type: 'stove_list/putACardInStove',
        cardId,
        startToRefineAt: timeSamp || Date.now(),
    })
}

// 更新炉位列表
export function updateStoveList(slotsList) {
    slotsList = [...slotsList]
    store.dispatch({
        type: 'stove_list/updateSlotsList',
        slotsList
    })
}

// function _checkThemeCol(toAddCardIds) {
// }