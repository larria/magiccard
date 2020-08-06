import React, { useState } from 'react';
import { connect } from 'react-redux';

import * as dpa from '../dispatchActionWithBusiness'

import './PanelSettings.css'

function PanelSettings(props) {
    const [friendsNum, setFriendsNum] = useState(5)

    function resetLocal() {
        localStorage.clear();
        window.location.reload()
    }

    function handleClick() {
        setFriendsNum(friendsNum + 1)
    }
    return (
        <>
            <div className="settings_w">
                <h2>TODO</h2>
                <h3>个人信息</h3>
                <p>修改个人昵称与头像</p>
                <p onClick={handleClick}>设置好友数量: {friendsNum}</p>
                <h3>数据管理</h3>
                <p>下载个人数据</p>
                <button onClick={e => props.addExp(100)}>增加经验值</button>
                <button onClick={e => props.setExp(0)}>经验值清零</button>
                <button onClick={e => props.setUserName('Larria' + Date.now().toString().slice(9))}>点击改名</button>
                <button onClick={e => dpa.updateBagListWithATheme()}>换卡箱变成一套</button>
                <button onClick={e => dpa.addAThemeToBook()}>集齐册放一套卡</button>
                <button onClick={e => dpa.addACardToStove()}>开始炼一张卡</button>
                <button onClick={e => dpa.addACardToStove(Date.now() - (1000 * 3600 * 24 * 365))}>炼一张卡并立即完成</button>
                <button onClick={resetLocal}>清空数据</button>
            </div>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        userName: state.userName,
        avatar: state.avatar,
        exp: state.exp,
        gold: state.gold,
        power: state.power,
        bookStat: state.bookStat
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

PanelSettings.defaultProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelSettings);