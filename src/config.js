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

// 升级奖励
export const levelBonus = function () {
    return (new Array(1000)).fill(1).map((item, index) => {
        if (index === 5 || index === 10) {
            return {
                'maxStove': 1
            }
        }
        if (index % 4 === 0 && index < 81) {
            return {
                'bagSlotNum': 1
            }
        }
        if (index % 4 === 2 && index < 83) {
            return {
                'chestSlotNum': 1
            }
        } else {
            return {
                'gold': index * 1000,
                'power': index * 10
            }
        }
    })
}()

export const defaultMiniThemeIdList = ['40', '45', '166', '177']