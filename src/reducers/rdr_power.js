export default (state = 200, action) => {
    switch (action.type) {
        case 'setPower': {
            return action.power;
        }
        case 'addPower': {
            return state + action.power;
        }
        case 'minusPower': {
            return state - action.power;
        }
        default:
            return state;
    }
}