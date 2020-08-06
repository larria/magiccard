// [{
//     cardId: '12233',
//     putInAtSamp: 1754645,
//     done: false
// }]

export default (state = [], action) => {
    switch (action.type) {
        case 'stove_list/putACardInStove': {
            let newState = JSON.parse(JSON.stringify(state))
            if (action.cardId && action.putInAtSamp) {
                newState.push({
                    cardId: action.cardId.toString(),
                    putInAtSamp: action.putInAtSamp,
                    done: false
                })
            }
            return newState;
        }
        case 'stove_list/doneACard': {
            let newState = JSON.parse(JSON.stringify(state))
            newState[action.slotIndex].done = true
            // 如果炼卡完成，需将练完的卡排在前面
            newState.sort((a, b) => {
                let aa = a.done ? 1 : 0
                let bb = b.done ? 1 : 0
                return bb - aa
            })
            return newState;
        }
        case 'stove_list/updateSlotsList': {
            let newState = JSON.parse(JSON.stringify(action.slotsList))
            return newState;
        }
        default:
            return state;
    }
}