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
            // 将练完的卡排在前面
            newState.sort((a, b) => {
                let aa = a.done ? 1 : 0
                let bb = b.done ? 1 : 0
                // 如果状态一样，先入炉的排前面
                if (aa === bb) {
                    aa = a.putInAtSamp
                    bb = b.putInAtSamp
                }
                return aa - bb
            })
            return newState;
        }
        case 'stove_list/doneACard': {
            let newState = JSON.parse(JSON.stringify(state))
            newState[action.slotIndex].done = true
            // 将练完的卡排在前面
            newState.sort((a, b) => {
                let aa = a.done ? 1 : 0
                let bb = b.done ? 1 : 0
                // 如果状态一样，先入炉的排前面
                if (aa === bb) {
                    aa = a.putInAtSamp
                    bb = b.putInAtSamp
                }
                return aa - bb
            })
            return newState;
        }
        case 'stove_list/updateSlotsList': {
            let newState = JSON.parse(JSON.stringify(action.slotsList))
            // 将练完的卡排在前面
            newState.sort((a, b) => {
                let aa = a.done ? 1 : 0
                let bb = b.done ? 1 : 0
                // 如果状态一样，先入炉的排前面
                if (aa === bb) {
                    aa = a.putInAtSamp
                    bb = b.putInAtSamp
                }
                return aa - bb
            })
            return newState;
        }
        default:
            return state;
    }
}