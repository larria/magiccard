const LOC_KEY_NAME = 'magic_card_loc'

export function initLoc() {
    let loc = {
        user: null
    }
    localStorage.setItem(LOC_KEY_NAME, JSON.stringify(loc))
}

export function getLocObj() {
    let res
    let loc = localStorage.getItem(LOC_KEY_NAME)
    if (loc) {
        res = JSON.parse(loc)
    } else {
        res = null
    }
    return res
}

export function getLocUser() {
    let res = null
    let locObj = getLocObj()
    if (locObj) {
        return locObj.user
    }
    return res
}