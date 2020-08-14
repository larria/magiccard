import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { Progress, Modal } from 'antd'

import './User.css'
import * as config from '../config'
import * as utils from '../utils'
import * as dpa from '../dispatchActionWithBusiness'

function User(props) {

    // 用户等级
    const level = useMemo(() => {
        return Math.floor(Math.pow(props.exp / 100, 1 / 2))
    }, [props.exp])
    // 用户升级进度
    const levelProgress = useMemo(() => {
        let lvl = Math.floor(Math.pow(props.exp / 100, 1 / 2))
        let nextLvlExp = 100 * Math.pow(lvl + 1, 2)
        let thisLvStartExp = 100 * Math.pow(lvl, 2)
        return 100 * (props.exp - thisLvStartExp) / (nextLvlExp - thisLvStartExp)
    }, [props.exp])

    // 升级了
    if (level !== props.lvlBonus) {
        let lvlUponList = []
        for (let i = props.lvlBonus + 1; i <= level; i++) {
            lvlUponList.push(i)
        }
        Modal.success({
            title: `恭喜您提升等级至lv.${level}~`,
            content: (
                <div className="user_bonus_w">
                    <p>升级奖励：</p>
                    {lvlUponList.map(lvlUpon => {
                        let bonus = config.levelBonus[lvlUpon]
                        return (
                            <div className="user_bonus" key={lvlUpon}>
                                {bonus.maxStove && (<p>最大炉位 +{bonus.maxStove}</p>)}
                                {bonus.bagSlotNum && (<p>换卡箱卡位解锁 +{bonus.bagSlotNum}</p>)}
                                {bonus.chestSlotNum && (<p>保险箱箱卡位解锁 +{bonus.chestSlotNum}</p>)}
                                {bonus.gold && (<p>金币 +{bonus.gold}</p>)}
                                {bonus.power && (<p>魔力 +{bonus.power}</p>)}
                            </div>
                        )
                    })}
                </div>),
            onOk() {
            }
        });
        lvlUponList.forEach(lvlUpon => {
            let bonus = config.levelBonus[lvlUpon]
            if (bonus.maxStove) {
                // 如果更新了炉位上限  要更新stoveList的toStartRefine
                let stoveList = utils.getUpdatedStoveListByMaxStove(props.stoveList, props.stoveStat.maxStove + bonus.maxStove)
                dpa.updateStoveList(stoveList)
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
    }

    return (
        <>
            <div className="user_w">
                <div className="user_name_avatar_w">
                    <img className="user_avatar" src={props.avatar} alt="" />
                    <div className="user_name_w">
                        <h2 className="user_name">{props.userName}<span className="user_lvl_text">Lv.{level}</span></h2>
                        <Progress percent={levelProgress} showInfo={false} />
                    </div>
                </div>
                {/* <div className="user_exp_w">
                    <span className="user_exp_icon"></span>
                    <span className="user_state_text">经验值：{props.exp}</span>
                </div> */}
                <div className="user_gold_w">
                    <span className="user_gold_icon"></span>
                    <span className="user_state_text">{props.gold}</span>
                </div>
                <div className="user_power_w">
                    <span className="user_power_icon"></span>
                    <span className="user_state_text">{props.power}</span>
                </div>
            </div>
        </>
    )
}

User.defaultProps = {
}

const mapStateToProps = (state) => {
    return {
        userName: state.userName,
        avatar: state.avatar,
        exp: state.exp,
        gold: state.gold,
        power: state.power,
        lvlBonus: state.lvlBonus,
        stoveStat: state.stoveStat,
        stoveList: state.stoveList,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setUserName: (name) => {
            let action = {
                type: 'setUserName',
                name: name
            }
            dispatch(action);
        },
        addExp: (exp) => {
            let action = {
                type: 'addExp',
                exp: exp
            }
            dispatch(action);
        },
        setExp: (exp) => {
            let action = {
                type: 'setExp',
                exp: exp
            }
            dispatch(action);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(User);