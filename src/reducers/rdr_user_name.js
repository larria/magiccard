export default (state = null, action) => {
  switch(action.type) {
    case 'setUserName': {
      return action.name;
    }
    default:
      return state;
  }
}