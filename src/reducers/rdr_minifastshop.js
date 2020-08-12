export default (state = {
    // 是否显示
    isShow: false,
    // 显示推荐的主题列表
    reCommendedThemesList: ['40', '45', '52', '54'],
}, action) => {
    switch (action.type) {
        case 'minifastshop/setShow': {
            let newState = JSON.parse(JSON.stringify(state))
            newState.isShow = !!action.isShow
            return newState;
        }
        default:
            return state;
    }
}