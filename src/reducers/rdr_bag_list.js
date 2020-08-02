export default (state = [], action) => {
    switch (action.type) {
        case 'addCard': {
            let cards = [...state]
            cards.push(action.card_id)
            return cards;
        }
        case 'removeCard': {
            let cards = [...state]
            cards = cards.slice(action.index, 1)
            return cards;
        }
        case 'updateCard': {
            return action.cardList;
        }
        default:
            return state;
    }
}