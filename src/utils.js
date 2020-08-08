import getData from './getData'

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

// 换算成等级
export function getlvl(exp) {
    let res = Math.floor(Math.pow(exp / 10, 1 / 3))
    return res
}

// 格式化经验值、金币显示
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

// 基于新的时间点更新炉子列表状态
export function getUpdatedSlotList(stoveList, maxStove, nowSamp) {
    let resList = JSON.parse(JSON.stringify(stoveList))
    let count = maxStove
    let nextStartSampList = []
    let i = 0
    // 第一遍只处理原先在炼的炉位
    while (count > 0 && resList[i]) {
        // 如果该卡片原先没有完成
        if (!resList[i].done) {
            let cardId = resList[i].cardId
            let putInAtSamp = resList[i].putInAtSamp
            let combData = getData.getCombineRuleByCardId(cardId)
            let costSamp = parseInt(combData.time, 10) * 1000
            // 还没炼完，则仍在占用一个炉位
            if (nowSamp - putInAtSamp - costSamp < 0) {
                count--
            } else {
                // 炼完了，则要把剩余时间用来炼下一张卡
                resList[i].done = true
                nextStartSampList.push(putInAtSamp + costSamp)
                // 更早炼完的剩余时间，排到前面
                nextStartSampList.sort((a, b) => a - b)
            }
        }
        i++
    }
    let j = 0
    // 第二遍用剩余时间处理后面排队的炉位
    while (count > 0 && nextStartSampList.length > 0 && resList[i]) {
        // 如果该卡片原先没有完成
        if (!resList[j].done) {
            let cardId = resList[j].cardId
            resList[j].putInAtSamp = nextStartSampList[0]
            let combData = getData.getCombineRuleByCardId(cardId)
            let costSamp = parseInt(combData.time, 10) * 1000
            // 更早炼完的剩余时间，排到前面
            // 还没炼完，则仍在占用一个炉位
            if (nowSamp - resList[j].putInAtSamp - costSamp < 0) {
                nextStartSampList.shift()
                count--
            } else {
                // 炼完了，则要把剩余时间用来炼下一张卡
                resList[i].done = true
                nextStartSampList[0] += costSamp
                // 更早炼完的剩余时间，排到前面
                nextStartSampList.sort((a, b) => a - b)
            }
            nextStartSampList.sort((a, b) => a - b)
        }
        j++
    }
    // 将练完的卡排在前面
    resList.sort((a, b) => {
        let aa = a.done ? 1 : 0
        let bb = b.done ? 1 : 0
        // 如果状态一样，先入炉的排前面
        if (aa === bb) {
            aa = a.putInAtSamp
            bb = b.putInAtSamp
        }
        return aa - bb
    })
    return resList
}