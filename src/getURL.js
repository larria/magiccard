
let BaseURL = 'https://appimg2.qq.com'

function getCardSmall (cardId) {
    return `${BaseURL}/card/img/card/${cardId}_56`
}

function getCard (cardId) {
    return `${BaseURL}/card/img/card/${cardId}`
}

function getThemeBigLogo (themeId) {
    return `${BaseURL}/card/img/theme/${themeId}_big_logo`
}

function getThemeLogo (themeId) {
    return `${BaseURL}/card/img/theme/${themeId}_logo`
}

function getThemeBackGround (themeId) {
    return `${BaseURL}/card/img/theme/${themeId}`
}

function getThemeMuseum (themeId) {
    return `${BaseURL}/card/img/theme/${themeId}_museum`
}

export default {
    getCard,
    getCardSmall,
    getThemeBigLogo,
    getThemeLogo,
    getThemeBackGround,
    getThemeMuseum
}