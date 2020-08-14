export default (state = 0, action) => {
    switch (action.type) {
        case 'lvl_bonus/gotBonus': {
            return action.level;
        }
        default:
            return state;
    }
}