let BaseURL = 'https://larria.github.io/magiccard/assets'
export const avatarsURLList = (new Array(18)).fill(1).map((item, index) => {
    return `${BaseURL}/other/avatar/avatar${index + 1}.svg`
})

// 用户信息基础数据
export const BaseUserData = {
    userName: null,
    avatar: null,
    exp: 0,
    gold: 0,
    power: 0,
    bonus: []
}

export const defaultMiniThemeIdList = ['40', '45', '166', '177']