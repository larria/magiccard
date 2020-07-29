import cardInfoXML from './data'

let dom = document.createElement('data')
dom.innerHTML = cardInfoXML

function getThemeList() {
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
        /* res.push({
            id: $item.getAttribute('id'),
            name: $item.getAttribute('name'),
            diff: $item.getAttribute('diff'),
            time: $item.getAttribute('time'),
            pages: $item.getAttribute('pages'),
            version: $item.getAttribute('version'),
            gift: $item.getAttribute('gift'),
            flashTheme: $item.getAttribute('flashTheme'),
            type: $item.getAttribute('type'),
            color: $item.getAttribute('color'),
            new_type: $item.getAttribute('new_type'),
            gallery_type: $item.getAttribute('gallery_type'),
            onsale_time: $item.getAttribute('onsale_time'),
            rank_end_time: $item.getAttribute('rank_end_time'),
        }) */
    })
    return res
}

function getThemeById(id) {
    let themeList = getThemeList()
    if (typeof id !== 'string') {
        id = id.toString()
    }
    return themeList.find(item => item.id === id)
}

function getThemesByName(name) {
    let themeList = getThemeList()
    if (typeof name !== 'string') {
        name = name.toString()
    }
    return themeList.filter(item => item.name.includes(name))
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
    res =  themeList.filter(item => {
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
    let res = {}
    let $card = dom.querySelector(`card[id="${id}"]`)
    let attrs = $card.attributes
    for (let key of attrs) {
        res[key.name] = key.value
    }
    return res
}

function getCombineRulesByThemeId(id) {
    let res = []
    let $combs = dom.querySelectorAll(`comb[theme_id="${id}"]`)
    $combs.forEach(function($item, idx) {
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
    let res = {}
    let $comb = dom.querySelector(`comb[id="${id}"]`)
    if ($comb) {
        let attrs = $comb.attributes
        for (let key of attrs) {
            res[key.name] = key.value
        }
        return res
    }
    return null
}

export default {
    getThemeList,
    getThemeById,
    getThemesByName,
    getThemesByDiff,
    getCardsByThemeId,
    getCardsByThemeIdAndSortByPrice,
    getCardById,
    getCombineRulesByThemeId,
    getCombineRuleByCardId
}