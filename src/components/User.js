import React, { useMemo } from 'react'
import { connect } from 'react-redux'

import './User.css'

function User(props) {

    // 用户等级
    const computeLevel = useMemo(() => {
        return () => {
            return Math.floor(Math.pow(props.exp / 10, 1 / 3))
        }
    }, [props.exp])
    return (
        <>
            <div className="user_w">
                <div className="user_name_avatar_w">
                    <img className="user_avatar" src={props.avatar} alt="" />
                    <div className="user_name_w">
                        <h2 className="user_name">{props.userName}</h2>
                        <span className="user_lvl">等级：{computeLevel()}</span>
                    </div>
                </div>
                <div className="user_exp_w">
                    <span className="user_exp_icon"></span>
                    <span className="user_state_text">经验值：{props.exp}</span>
                </div>
                <div className="user_gold_w">
                    <span className="user_gold_icon"></span>
                    <span className="user_state_text">金币：{props.gold}</span>
                </div>
                <div className="user_power_w">
                    <span className="user_power_icon"></span>
                    <span className="user_state_text">魔力：{props.power}</span>
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