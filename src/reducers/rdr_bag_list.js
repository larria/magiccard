export default (state = [], action) => {
    switch (action.type) {
        case 'bag_list/addCard': {
            let cards = [...state]
            cards.push(action.card_id)
            return cards;
        }
        case 'bag_list/removeCard': {
            let cards = [...state]
            cards.splice(action.index, 1)
            return cards;
        }
        case 'bag_list/updateCard': {
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