export default (state = {
    // 上次还剩下的抽卡数
    lastDrawNumLeft: 16,
    // 上次抽卡的时间戳，如：1596522051424
    lastResetTimeAtSamp: 0
}, action) => {
    switch (action.type) {
        case 'draw/drawCardsAndResetTime': {
            return {
                ...state,
                lastDrawNumLeft: state.lastDrawNumLeft - action.drawNum,
                lastResetTimeAtSamp: action.now
            };
        }
        case 'draw/drawCards': {
            return {
                ...state,
                lastDrawNumLeft: state.lastDrawNumLeft - action.drawNum,
            };
        }
        case 'draw/updateDrawStat': {
            let updatedDrawNum = Math.min(16, state.lastDrawNumLeft + action.addDrawNumFromTime)
            return {
                ...state,
                lastDrawNumLeft: updatedDrawNum,
                lastResetTimeAtSamp: action.time
            };
        }
        default:
            return state;
    }
}