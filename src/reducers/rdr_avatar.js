export default (state = null, action) => {
    switch(action.type) {
      case 'setAvatar': {
        return action.avatarURL;
      }
      default:
        return state;
    }
  }