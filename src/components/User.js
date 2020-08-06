import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { Progress } from 'antd'

import './User.css'

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
        power: state.power
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