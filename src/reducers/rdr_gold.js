export default (state = 0, action) => {
    switch (action.type) {
        case 'setGold': {
            return action.gold;
        }
        case 'addGold': {
            return state + action.gold;
        }
        case 'minusGold': {
            return state - action.gold;
        }
        default:
            return state;
    }
}