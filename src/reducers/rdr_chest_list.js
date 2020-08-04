export default (state = [], action) => {
    switch (action.type) {
        case 'chest_list/addOneCard': {
            let cards = [...state]
            cards.push(action.cardId)
            return cards;
        }
        case 'chest_list/addCards': {
            let cards = [...state]
            cards = cards.concat(action.cardList)
            return cards;
        }
        case 'chest_list/removeOneCard': {
            let cards = [...state]
            cards.splice(action.index, 1)
            return cards;
        }
        case 'chest_list/updateCard': {
            let cards
            if (action.cardList instanceof Array) {
                cards = [...action.cardList]
            }
            return cards;
        }
        default:
            return state;
    }
}