// [{
//     cardId: '12233',
//     startToRefineAt: 1754645,
// }]

export default (state = [], action) => {
    switch (action.type) {
        case 'stove_list/putACardInStove': {
            let newState = JSON.parse(JSON.stringify(state))
            if (action.cardId && action.startToRefineAt) {
                newState.push({
                    cardId: action.cardId.toString(),
                    startToRefineAt: action.startToRefineAt,
                })
            }
            /* // 将练完的卡排在前面
            newState.sort((a, b) => {
                let aa = a.done ? 1 : 0
                let bb = b.done ? 1 : 0
                // 如果状态一样，先入炉的排前面
                if (aa === bb) {
                    aa = a.startToRefineAt
                    bb = b.startToRefineAt
                }
                return aa - bb
            }) */
            return newState;
        }
        case 'stove_list/updateSlotsList': {
            let newState = JSON.parse(JSON.stringify(action.slotsList))
            // 先入炉的排前面
            newState.sort((a, b) => a.startToRefineAt - b.startToRefineAt)
            return newState;
        }
        default:
            return state;
    }
}