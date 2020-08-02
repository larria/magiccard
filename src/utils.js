export function getTimeFormat(endTime) {
    let secondTime = parseInt(endTime)//将传入的秒的值转化为Number
    let min = 0// 初始化分
    let h = 0// 初始化小时
    let result = ''
    if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
        min = parseInt(secondTime / 60)//获取分钟，除以60取整数，得到整数分钟
        secondTime = parseInt(secondTime % 60)//获取秒数，秒数取佘，得到整数秒数
        if (min > 60) {//如果分钟大于60，将分钟转换成小时
            h = parseInt(min / 60)//获取小时，获取分钟除以60，得到整数小时
            min = parseInt(min % 60) //获取小时后取佘的分，获取分钟除以60取佘的分
        }
    }
    result = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secondTime.toString().padStart(2, '0')}`
    return result
}

export function getlvl(exp) {
    let res = Math.floor(Math.pow(exp / 10, 1 / 3))
    return res
}

export function getRenderExp(exp) {
    let resNum, res
    let expNum = parseInt(exp, 10)
    if (expNum > 10000) {
        resNum = (expNum / 10000).toFixed(1)
        res = resNum + '万'
    } else {
        res = exp.toString()
    }
    return res
}