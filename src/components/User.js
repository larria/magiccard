import React, { useMemo } from 'react'
import { connect } from 'react-redux';

import './User.css'

function User(props) {
    const computeLevel = useMemo(() => {
        console.log('memo 触发')
        return () => props.exp / 10
    }, [props.exp])
    return (
        <>
            <div className="user_w">
                <img src={props.avatar} alt="" />
                <h2 className="user_name">{props.userName}</h2>
            </div>
            <div className="user_state_w">
                <div className="user_exp_icon"></div>
                <div className="user_power_icon"></div>
                <div className="user_gold_icon"></div>
            </div>
            <p>经验值：{props.exp}</p>
            <p>等级：{computeLevel()}</p>
            <button onClick={e => props.addExp(10)}>点击增加经验值</button>
            <p>金币：{props.gold}</p>
            <p>魔力：{props.power}</p>
            <button onClick={e => props.setUserName('Larria' + Date.now().toString().slice(9))}>点击改名</button>
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(User);