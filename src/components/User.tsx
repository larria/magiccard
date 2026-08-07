import { useMemo, useEffect, useRef } from 'react'
import { Progress, App, Tooltip } from 'antd'
import './User.css'
import * as config from '../config'
import * as utils from '../utils'
import * as dpa from '../store/dispatchActionWithBusiness'
import { useGameStore } from '../store/useGameStore'

export default function User() {
  const { modal } = App.useApp()
  const exp = useGameStore((s) => s.exp)
  const gold = useGameStore((s) => s.gold)
  const power = useGameStore((s) => s.power)
  const lvlBonus = useGameStore((s) => s.lvlBonus)
  const stoveStat = useGameStore((s) => s.stoveStat)
  const stoveList = useGameStore((s) => s.stoveList)
  const userName = useGameStore((s) => s.userName)
  const avatar = useGameStore((s) => s.avatar)

  const level = useMemo(() => Math.floor(Math.pow(exp / 100, 1 / 2)), [exp])
  const levelProgress = useMemo(() => {
    const lvl = Math.floor(Math.pow(exp / 100, 1 / 2))
    const nextLvlExp = 100 * Math.pow(lvl + 1, 2)
    const thisLvStartExp = 100 * Math.pow(lvl, 2)
    return (100 * (exp - thisLvStartExp)) / (nextLvlExp - thisLvStartExp)
  }, [exp])

  // 升级检测：仅在实际等级超过已领取等级时触发一次
  const lastHandledLevel = useRef(lvlBonus)
  useEffect(() => {
    if (level <= lastHandledLevel.current) return
    const lvlUponList: number[] = []
    for (let i = lastHandledLevel.current + 1; i <= level; i++) {
      lvlUponList.push(i)
    }
    modal.success({
      title: `恭喜您提升等级至lv.${level}~`,
      content: (
        <div className="user_bonus_w">
          <p>升级奖励：</p>
          {lvlUponList.map((lvlUpon) => {
            const bonus = config.levelBonus[lvlUpon]
            return (
              <div className="user_bonus" key={lvlUpon}>
                {bonus.maxStove && <p>最大炉位 +{bonus.maxStove}</p>}
                {bonus.bagSlotNum && <p>换卡箱卡位解锁 +{bonus.bagSlotNum}</p>}
                {bonus.chestSlotNum && <p>保险箱卡位解锁 +{bonus.chestSlotNum}</p>}
                {bonus.gold && <p>金币 +{bonus.gold}</p>}
                {bonus.power && <p>魔力 +{bonus.power}</p>}
              </div>
            )
          })}
        </div>
      ),
      onOk() {},
    })
    lvlUponList.forEach((lvlUpon) => {
      const bonus = config.levelBonus[lvlUpon]
      if (bonus.maxStove) {
        const newStoveList = utils.getUpdatedStoveListByMaxStove(
          stoveList,
          stoveStat.maxStove + bonus.maxStove,
        )
        dpa.updateStoveList(newStoveList)
        dpa.addMaxStove(bonus.maxStove)
      }
      if (bonus.bagSlotNum) {
        dpa.addBagSlotNum(bonus.bagSlotNum)
      }
      if (bonus.chestSlotNum) {
        dpa.addChestSlotNum(bonus.chestSlotNum)
      }
      if (bonus.gold) {
        dpa.addGold(bonus.gold)
      }
      if (bonus.power) {
        dpa.addPower(bonus.power)
      }
    })
    dpa.setLevelBonusGot(level)
    lastHandledLevel.current = level
  }, [level, lvlBonus, stoveList, stoveStat.maxStove])

  return (
    <div className="user_w">
      <div className="user_name_avatar_w">
        <img className="user_avatar" src={avatar ?? undefined} alt="" />
        <div className="user_name_w">
          <h2 className="user_name">
            {userName}
            <span className="user_lvl_text">Lv.{level}</span>
          </h2>
          <Progress percent={levelProgress} showInfo={false} />
        </div>
      </div>
      <Tooltip title="金币，可用以购买卡片">
        <div className="user_gold_w">
          <span className="user_gold_icon" />
          <span className="user_state_text">{gold}</span>
        </div>
      </Tooltip>
      <Tooltip title="魔力，变卡时消耗">
        <div className="user_power_w">
          <span className="user_power_icon" />
          <span className="user_state_text">{power}</span>
        </div>
      </Tooltip>
    </div>
  )
}
