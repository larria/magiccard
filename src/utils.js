import getData from './getData'

export function getTimeFormat(endTime) {
    let secondTime = parseInt(endTime)//将传入的秒的值转化为Number
    let min = 0// 初始化分
    let h = 0// 初始化小时
    let result = ''
    if (secondTime >= 60) {//如果秒数大于60，将秒数转换成整数
        min = parseInt(secondTime / 60)//获取分钟，除以60取整数，得到整数分钟
        secondTime = parseInt(secondTime % 60)//获取秒数，秒数取佘，得到整数秒数
        if (min >= 60) {//如果分钟大于60，将分钟转换成小时
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

// 推测获得所有炉位在某特定时间的渲染状态
export function getStoveRenderState(slotsList, toTimeSamp) {
    let res = []
    let theSlotsList = JSON.parse(JSON.stringify(slotsList))

    theSlotsList.forEach(slot => {
        let costTime = parseInt(getData.getCombineRuleByCardId(slot.cardId).time) * 1000
        let restTime = slot.startToRefineAt + costTime - toTimeSamp
        let resItem = {
            cardId: slot.cardId,
            restTime,
            startToRefineAt: slot.startToRefineAt
        }
        if (restTime > 0) {
            if (slot.startToRefineAt > toTimeSamp) {
                // 还在等待，没开始炼
                resItem.state = 'queue'
            } else {
                // 开始炼了，但还没炼完
                resItem.state = 'refining'
            }
        } else {
            // 炼完了
            resItem.state = 'refined'
        }
        res.push(resItem)
    })
    // 重新排序
    // 首先：炼完的排前面，其中都炼完的再按炼完的时间点排序，更早炼完的排更前面
    // 其次：还没炼完的和还在等待的排后面，其中都没炼完的或还在等待，再按开始炼制的时间点排序，更早开始炼制排在前面
    /* res.sort((a, b) => {
        let aVal = a.state === 'refined' ? 1 : 1e20
        let bVal = b.state === 'refined' ? 1 : 1e20
        if (a.state === b.state) {
            if (a.state === 'refined') {
                aVal += a.restTime
                bVal += b.restTime
            } else {
                aVal += a.startToRefineAt
                bVal += b.startToRefineAt
            }
        }
        return aVal - bVal
    }) */
    return res
}

// 往炼制列表再加一张卡时，获取其能开始炼制的时间
export function getStartToRefineAt(slotsList, maxStove) {
    let theSlotsList = JSON.parse(JSON.stringify(slotsList))
    let count = parseInt(maxStove, 10)
    // 已有数据列表按开始炼制的时间排序
    theSlotsList.sort((a, b) => a.startToRefineAt - b.startToRefineAt)
    let nowSamp = Date.now()
    let refiningRefinedAtList = []
    let queueCostList = []
    theSlotsList.forEach(slot => {
        let costTime = parseInt(getData.getCombineRuleByCardId(slot.cardId).time) * 1000
        let refinedTime = slot.startToRefineAt + costTime
        if (refinedTime > nowSamp) {
            // 已完成的炉位不计入计算
            if (slot.startToRefineAt < nowSamp) {
                // 还未完成的炉位中
                // 已经开始炼制的炉位，记录其炼完的时间点
                refiningRefinedAtList.push(slot.startToRefineAt + costTime)
                // 占用一个活跃炉子
                count--
            } else {
                // 还在排队的炉位，记录其需要炼制的时间长度
                queueCostList.push(costTime)
            }
        }
    })
    if (count > 0) {
        // 还有剩余的活跃炉子，可即刻开始炼制新卡
        return nowSamp
    } else {
        // 没有剩余的活跃炉子了，则要找出排队之后最早能开始的时间点
        refiningRefinedAtList.sort((a, b) => a - b)
        queueCostList.sort((a, b) => a - b)
        while(queueCostList.length > 0) {
            let earliestQueueCost = queueCostList.shift()
            // 早完成的炉子用来炼制先等待的卡
            refiningRefinedAtList[0] += earliestQueueCost
            refiningRefinedAtList.sort((a, b) => a - b)
        }
        // 最早能空出来的炉位时间
        return refiningRefinedAtList[0]
    }
}

// 当同时炼卡的炉子数量上限改变（升级解锁了炉子、租了炉子、租的炉子到期）时，更新炉子数据列表（其中的开始炼制的时间startToRefineAt）
// todo
export function getUpdatedStoveListByMaxStove(slotsList, fromMaxStove, toMaxStove) {
    return
}

// 检查是否合成了主题
export function checkThemeCollected(bagCardIds, chestCardIds, themeIds) {
    let collectedThemeIds = []
    if (!(themeIds instanceof Array)) {
        console.log('themeIds:' + themeIds + '必须是数组');
        return;
    }
    // 用set排重
    let themeIdsSet = new Set(themeIds)
    // bagCardIds = [...bagCardIds]
    // chestCardIds = [...chestCardIds]
    themeIdsSet.forEach(themeId => {
        let cardOfThemesIdSet = new Set(getData.getCardIdsByThemeId(themeId))
        // console.log(cardOfThemesIdSet)
        let bagCardIdsTemp = [...bagCardIds]
        let chestCardIdsTemp = [...chestCardIds]
        // console.log([...cardOfThemesIdSet])
        // console.log(...bagCardIdsTemp)
        // console.log(...chestCardIdsTemp)
        for (let i = bagCardIdsTemp.length - 1; i >= 0; i--) {
            if (typeof bagCardIdsTemp[i] === 'string') {
                let cardId = bagCardIdsTemp[i]
                // 这张卡属于主题
                if (cardOfThemesIdSet.has(cardId)) {
                    // 从换卡箱中删除
                    bagCardIdsTemp.splice(i, 1)
                    // 从查找的主题中删除
                    cardOfThemesIdSet.delete(cardId)
                }
            } else {
                continue
            }
        }
        for (let i = chestCardIdsTemp.length - 1; i >= 0; i--) {
            if (typeof chestCardIdsTemp[i] === 'string') {
                let cardId = chestCardIdsTemp[i]
                // 这张卡属于主题
                if (cardOfThemesIdSet.has(cardId)) {
                    // 从保险箱中删除
                    chestCardIdsTemp.splice(i, 1)
                    // 从查找的主题中删除
                    cardOfThemesIdSet.delete(cardId)
                }
            } else {
                continue
            }
        }
        // 如果查找的主题卡片列表清空了，说明集齐了
        if (cardOfThemesIdSet.size === 0) {
            // console.log(`检查出${themeId}集齐了`)
            collectedThemeIds.push(themeId)
            bagCardIds = bagCardIdsTemp
            chestCardIds = chestCardIdsTemp
        }
    })
    // 如果有集齐的主题，返回集齐的主题、集齐后的换卡箱、保险箱卡片列表
    if (collectedThemeIds.length > 0) {
        return {
            collectedThemeIds,
            bagCardIds,
            chestCardIds
        }
    } else {
        return false
    }
}