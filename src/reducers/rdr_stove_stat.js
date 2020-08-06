export default (state = {
    // 同时运作的炉子上限
    maxStove: 1,
}, action) => {
    switch (action.type) {
        case 'stove_stat/setSlotsNum': {
            let newState = {...state}
            newState.maxStove = parseInt(action.slotNum, 10)
            return newState;
        }
        default:
            return state;
    }
}