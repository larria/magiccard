export default (state = [], action) => {
    switch (action.type) {
        case 'chest_list/addCard': {
            let cards = [...state]
            cards.push(action.card_id)
            return cards;
        }
        case 'chest_list/removeCard': {
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