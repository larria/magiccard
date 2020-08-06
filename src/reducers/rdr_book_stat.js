// {
//     '123': {
//         themeId: '123',
//         collectAt: 1754575445,
//         collectedNum: 3
//     },
// }

export default (state = {}, action) => {
    switch (action.type) {
        case 'book_stat/collectOneTheme': {
            let collected = JSON.parse(JSON.stringify(state))
            // let collected = {...state}
            if (action.themeId in collected) {
                collected[action.themeId].collectedNum++
            } else {
                collected[action.themeId] = {
                    themeId: action.themeId,
                    collectAt: action.collectAt,
                    collectedNum: 1
                }
            }
            return collected;
        }
        case 'book_stat/updateCollection': {
            let collected = JSON.parse(JSON.stringify(action.collectionObj))
            // let collected = {...action.collectionObj}
            return collected;
        }
        default:
            return state;
    }
}