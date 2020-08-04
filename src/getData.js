import cardInfoXML from './data'

let dom = document.createElement('data')
dom.innerHTML = cardInfoXML

// 格式化数据
const DATA_FORMATTED = function () {
    let res = {
        THEME: {},
        CARD: {},
        COMB: {}
    }
    // 卡片主题
    let $themes = dom.querySelectorAll('theme')
    $themes.forEach(($item) => {
        // <theme id="235" name="鹊桥相会" diff="3" time="1344914792" pages="2" version="1" gift="740|739|738|737" flashTheme="0" type="2" color="0xfa5745" new_type="0" gallery_type="49"  onsale_time="0" rank_end_time="0" ></theme>
        let itemData = {}
        let attrs = $item.attributes
        for (let key of attrs) {
            itemData[key.name] = key.value
        }
        res.THEME[attrs.id.value] = itemData
    })

    // 卡片
    let $card = dom.querySelectorAll('card')
    $card.forEach(($item) => {
        // <theme id="235" name="鹊桥相会" diff="3" time="1344914792" pages="2" version="1" gift="740|739|738|737" flashTheme="0" type="2" color="0xfa5745" new_type="0" gallery_type="49"  onsale_time="0" rank_end_time="0" ></theme>
        let itemData = {}
        let attrs = $item.attributes
        for (let key of attrs) {
            itemData[key.name] = key.value
        }
        res.CARD[attrs.id.value] = itemData
    })

    // 卡片合成
    let $comb = dom.querySelectorAll('comb')
    $comb.forEach(($item) => {
        // <theme id="235" name="鹊桥相会" diff="3" time="1344914792" pages="2" version="1" gift="740|739|738|737" flashTheme="0" type="2" color="0xfa5745" new_type="0" gallery_type="49"  onsale_time="0" rank_end_time="0" ></theme>
        let itemData = {}
        let attrs = $item.attributes
        for (let key of attrs) {
            itemData[key.name] = key.value
        }
        res.COMB[attrs.id.value] = itemData
    })
    // console.log(res.comb)
    return res
}()

// 获取全部主题，已废弃
/* function getThemeList() {
    let res = []
    let $themes = dom.querySelectorAll('theme')
    $themes.forEach(($item) => {
        // <theme id="235" name="鹊桥相会" diff="3" time="1344914792" pages="2" version="1" gift="740|739|738|737" flashTheme="0" type="2" color="0xfa5745" new_type="0" gallery_type="49"  onsale_time="0" rank_end_time="0" ></theme>
        let itemData = {}
        let attrs = $item.attributes
        for (let key of attrs) {
            itemData[key.name] = key.value
        }
        res.push(itemData)
        // res.push({
        //     id: $item.getAttribute('id'),
        //     name: $item.getAttribute('name'),
        //     diff: $item.getAttribute('diff'),
        //     time: $item.getAttribute('time'),
        //     pages: $item.getAttribute('pages'),
        //     version: $item.getAttribute('version'),
        //     gift: $item.getAttribute('gift'),
        //     flashTheme: $item.getAttribute('flashTheme'),
        //     type: $item.getAttribute('type'),
        //     color: $item.getAttribute('color'),
        //     new_type: $item.getAttribute('new_type'),
        //     gallery_type: $item.getAttribute('gallery_type'),
        //     onsale_time: $item.getAttribute('onsale_time'),
        //     rank_end_time: $item.getAttribute('rank_end_time'),
        // })
    })
    return res
} */

// 获取全部主题
function getThemeList() {
    return Object.values(DATA_FORMATTED.THEME)
}

// 通过对象条件搜索卡片主题
function getThemesBySearch(searchObj, fromThemeList) {
    let themeList
    let searchBy = JSON.parse(JSON.stringify(searchObj))

    if ('name' in searchBy) {
        searchBy.name = new RegExp(searchBy.name, 'i')
    }
    if (fromThemeList) {
        themeList = fromThemeList
    } else {
        themeList = getThemeList()
    }
    return themeList.filter(item => {
        let matched = true
        for (let key in searchBy) {
            if (searchBy[key] instanceof RegExp) {
                if (!searchBy[key].test(item[key])) {
                    matched = false
                    break
                }
            } else if (searchBy[key] !== item[key]) {
                matched = false
                break
            }
        }
        return matched
    })
}

function getThemeById(id) {
    if (typeof id !== 'string') {
        id = id.toString()
    }
    return DATA_FORMATTED.THEME[id]
}

function getThemesByDiff(diff, fromThemeList) {
    let res = []
    let themeList
    if (fromThemeList) {
        themeList = fromThemeList
    } else {
        themeList = getThemeList()
    }
    diff = diff.toString()
    res = themeList.filter(item => {
        return diff === item.diff && item.name !== '道具卡'
    })
    return res
}

function getCardsByThemeId(id) {
    let res = []
    let $cards = dom.querySelectorAll(`card[theme_id="${id}"]`)
    $cards.forEach($item => {
        let itemData = {}
        let attrs = $item.attributes
        for (let key of attrs) {
            itemData[key.name] = key.value
        }
        res.push(itemData)
    })
    return res
}

// 返回一套主题里按面值分类的卡片二维数组
function getCardsByThemeIdAndSortByPrice(id) {
    let res = []
    let cards = getCardsByThemeId(id)
    cards.forEach(card => {
        let resItem = res.find(item => {
            return item.price === card.price
        })
        if (resItem) {
            resItem.cards.push(card)
        } else {
            res.push({
                price: card.price,
                cards: [card]
            })
        }
    })
    res.sort((a, b) => parseInt(b.price, 10) - parseInt(a.price, 10))
    return res
}

function getCardById(id) {
    if (typeof id !== 'string') {
        id = id.toString()
    }
    return DATA_FORMATTED.CARD[id]
}

// 从可以获取的卡中随机抽取num张
function getCardsRandomFromCanGet(num) {
    let res = []
    num = parseInt(num, 10)
    let ids = Object.keys(DATA_FORMATTED.CARD)
    while (num > 0) {
        let randomCardIdx = Math.floor(Math.random() * ids.length)
        let randomCardId = ids[randomCardIdx]
        let card = DATA_FORMATTED.CARD[randomCardId]
        // 有的卡对应不到主题，如theme_id为664的卡
        if (DATA_FORMATTED.THEME[card.theme_id]) {
            // 是普通卡或活动卡
            if (DATA_FORMATTED.THEME[card.theme_id].type === '0' || DATA_FORMATTED.THEME[card.theme_id].type === '2') {
                // 如果该卡片不能合成，认定为基础素材卡，可以抽得
                if (!getCombineRuleByCardId(card.id)) {
                    res.push(card.id)
                    num--
                }
            }
        }
    }
    return res
}

function getCombineRulesByThemeId(id) {
    let res = []
    let $combs = dom.querySelectorAll(`comb[theme_id="${id}"]`)
    $combs.forEach(function ($item, idx) {
        let itemData = {}
        let attrs = $item.attributes
        for (let key of attrs) {
            itemData[key.name] = key.value
        }
        res.push(itemData)
    })
    return res
}

function getCombineRuleByCardId(id) {
    if (typeof id !== 'string') {
        id = id.toString()
    }
    return DATA_FORMATTED.COMB[id]
}

export default {
    getThemeList,
    getThemesBySearch,
    getThemeById,
    getThemesByDiff,
    getCardsByThemeId,
    getCardsByThemeIdAndSortByPrice,
    getCardById,
    getCardsRandomFromCanGet,
    getCombineRulesByThemeId,
    getCombineRuleByCardId
}