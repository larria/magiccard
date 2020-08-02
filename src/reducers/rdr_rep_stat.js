export default (state = {
    bagSlotNum: 20,
    chestSlotNum: 40
}, action) => {
    switch (action.type) {
        case 'setBagSlot': {
            return {
                ...state,
                bagSlotNum: action.slotNum
            };
        }
        case 'addBagSlot': {
            return {
                ...state,
                bagSlotNum: state.bagSlotNum + action.slotNum
            };
        }
        case 'setChestSlot': {
            return {
                ...state,
                chestSlotNum: action.slotNum
            };
        }
        case 'addChestSlot': {
            return {
                ...state,
                chestSlotNum: state.chestSlotNum + action.slotNum
            };
        }
        default:
            return state;
    }
}