import React, { useState } from 'react';
import { Input, Divider, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { avatarsURLList } from '../getConfig'
import './PageRegister.css'

import * as local from '../local'
import {
    HashRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
} from "react-router-dom"
import { createHashHistory } from 'history'

function PageRegister(props) {
    let [userName, setUserName] = useState('')
    let [avatar, setAvatar] = useState(null)
    let [ableToSubmit, setAbleToSubmit] = useState(true)

    // 输入框
    function handleInputChange(e) {
        let str = e.target.value.trim()
        setUserName(str)
        if (str.length > 0) {
            if (avatar) {
                setAbleToSubmit(false)
            }
        } else {
            setAbleToSubmit(true)
        }
    }
    function handleAvatarSelect(e) {
        let url = e.target.src
        setAvatar(url)
        if (userName.length) {
            setAbleToSubmit(false)
        }
    }
    function handleSubmit() {
        local.setLocUser(userName)
        local.setLocalAvatar(avatar)
        let history = createHashHistory()
        history.replace('/home')
    }
    return (
        <>
            <div className="register_w">
                <img className="register_welcome_img" src="https://larria.github.io/magiccard/assets/style/imgs/moka_girl.png" alt="" />
                <div className="register_form">
                    <div>
                        <Input
                            placeholder="请输入昵称"
                            autoFocus={true}
                            prefix={<UserOutlined />}
                            onChange={handleInputChange}
                        />
                    </div>
                    <Divider></Divider>
                    <h3>请选择头像</h3>
                    <div className="register_avatar_w">
                        {avatarsURLList.map((url, index) => {
                            return (
                                <img
                                    className="register_avatar"
                                    key={index}
                                    src={url}
                                    alt=""
                                    onClick={handleAvatarSelect}
                                    style={avatar === url ? {
                                        boxShadow: '0 0 5px #1088e9'
                                    } : avatar && {
                                        opacity: '0.5'
                                    }}
                                />
                            )
                        })}
                    </div>
                    <Divider></Divider>
                    <Button className="register_submit_btn" type="primary" disabled={ableToSubmit} onClick={handleSubmit}>确定</Button>
                </div>
            </div>
        </>
    )
}

PageRegister.defaultProps = {
}

export default PageRegister;