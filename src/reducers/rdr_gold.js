export default (state = 8000, action) => {
    switch (action.type) {
        case 'setGold': {
            let gold = parseInt(action.gold, 10)
            return gold;
        }
        case 'addGold': {
            let gold = parseInt(action.gold, 10)
            return state + gold;
        }
        case 'minusGold': {
            let gold = parseInt(action.gold, 10)
            return state - gold;
        }
        default:
            return state;
    }
}