export default (state = 0, action) => {
    switch (action.type) {
        case 'setExp': {
            return action.exp;
        }
        case 'addExp': {
            return state + action.exp;
        }
        default:
            return state;
    }
}