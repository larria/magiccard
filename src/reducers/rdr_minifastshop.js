export default (state = {
    // 是否显示
    isShow: false,
}, action) => {
    switch (action.type) {
        case 'minifastshop/setShow': {
            let newState = JSON.parse(JSON.stringify(state))
            newState.isShow = !!action.isToShow
            return newState;
        }
        default:
            return state;
    }
}