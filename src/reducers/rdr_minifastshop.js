export default (state = {
    // 是否显示
    isShow: false,
    // 优先展示的主题
    showThemeId: null
}, action) => {
    switch (action.type) {
        case 'minifastshop/setShow': {
            let newState = JSON.parse(JSON.stringify(state))
            newState.isShow = !!action.isShow
            return newState;
        }
        case 'minifastshop/setShowTheme': {
            let newState = JSON.parse(JSON.stringify(state))
            newState.showThemeId = action.showThemeId.toString()
            return newState;
        }
        default:
            return state;
    }
}