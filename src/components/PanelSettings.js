import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import * as dpa from '../dispatchActionWithBusiness'

import './PanelSettings.css'

const { confirm } = Modal;

function PanelSettings(props) {
    const [showDebug, setShowDebug] = useState(false)
    const [friendsNum, setFriendsNum] = useState(5)

    function resetLocal() {
        localStorage.clear();
        window.location.reload()
    }

    function handleClick() {
        setFriendsNum(friendsNum + 1)
    }

    useEffect(() => {
        confirm({
            title: '设置内容目前包含部分调试功能，无节制使用会减少游戏乐趣，确认要使用设置功能？',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                setShowDebug(true)
            },
            onCancel() {
            },
        })
    }, [])
    return (
        <>
            {showDebug && (
                <div className="settings_w">
                    <p>修改个人昵称与头像</p>
                    <button onClick={handleClick}>设置好友数量: {friendsNum}</button>
                    <p>下载个人数据</p>
                    <button onClick={e => props.addExp(100)}>增加经验值</button>
                    <button onClick={e => props.setExp(3251)}>升级到lv. 5</button>
                    <button onClick={e => props.setExp(10001)}>升级到lv. 10</button>
                    <button onClick={e => props.setUserName('Larria' + Date.now().toString().slice(9))}>点击改名</button>
                    <button onClick={e => dpa.updateBagListWithATheme()}>换卡箱变成一套</button>
                    <button onClick={e => dpa.addAThemeToBook()}>集齐册放一套卡</button>
                    <button onClick={e => dpa.addACardToStove(Date.now(), '38')}>开始炼一张卡</button>
                    <button onClick={e => dpa.addACardToStove(Date.now() - (1000 * 3600 * 24 * 365), '38')}>炼一张卡并立即完成</button>
                    <button onClick={e => dpa.addACardToStove(Date.now() - (1000 * 3500), '41')}>炼一张卡并即将完成</button>
                    <button onClick={e => dpa.updateStoveList([])}>清除炼卡槽</button>
                    <button onClick={resetLocal}>清空数据</button>
                </div>)
            }
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
                name
            }
            dispatch(action);
        },
        addExp: (exp) => {
            let action = {
                type: 'addExp',
                exp
            }
            dispatch(action);
        },
        setExp: (exp) => {
            let action = {
                type: 'setExp',
                exp
            }
            dispatch(action);
        }
    }
}

PanelSettings.defaultProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelSettings);