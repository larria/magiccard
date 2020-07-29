
// let BaseURL = 'https://appimg2.qq.com'
let BaseURL = 'https://larria.github.io/magiccard/assets'
let fix = '.png'
if (BaseURL.includes('qq.com')) {
    fix=''
}

function getCardSmall (cardId) {
    return `${BaseURL}/card/img/card/${cardId}_56${fix}`
}

function getCard (cardId) {
    return `${BaseURL}/card/img/card/${cardId}${fix}`
}

function getThemeBigLogo (themeId) {
    return `${BaseURL}/card/img/theme/${themeId}_big_logo${fix}`
}

function getThemeLogo (themeId) {
    return `${BaseURL}/card/img/theme/${themeId}_logo${fix}`
}

function getThemeBackGround (themeId) {
    return `${BaseURL}/card/img/theme/${themeId}${fix}`
}

function getThemeMuseum (themeId) {
    return `${BaseURL}/card/img/theme/${themeId}_museum${fix}`
}

export default {
    getCard,
    getCardSmall,
    getThemeBigLogo,
    getThemeLogo,
    getThemeBackGround,
    getThemeMuseum
}