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

export function getLocUserName() {
    let res = null
    let locObj = getLocObj()
    if (locObj) {
        try {
            return locObj.user.userName
        } catch (error) {
            console.log('本地数据有误')
            return null
        }
    }
    return res
}

export function getLocAvatar() {
    let res = null
    let locObj = getLocObj()
    if (locObj) {
        try {
            return locObj.user.avatar
        } catch (error) {
            console.log('本地数据有误')
            return null
        }
    }
    return res
}

export function setLocUser(userName) {
    let locObj = getLocObj()
    if (!locObj) {
        locObj = {}
    }
    if (locObj.user) {
        locObj.user.userName = userName
    } else {
        locObj.user = {
            userName: userName
        }
    }
    localStorage.setItem(LOC_KEY_NAME, JSON.stringify(locObj))
}

export function setLocalAvatar(avatar) {
    let locObj = getLocObj()
    if (!locObj) {
        locObj = {}
    }
    if (locObj.user) {
        locObj.user.avatar = avatar
    } else {
        locObj.user = {
            avatar: avatar
        }
    }
    localStorage.setItem(LOC_KEY_NAME, JSON.stringify(locObj))
}