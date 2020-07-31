import React from 'react'
import * as local from '../local'

import './PanelHome.css'

function PanelHome(props) {
    return (
        <>
            <div className="user_w">
                <img src={local.getLocAvatar()} alt="" />
                <h2 className="user_name">{local.getLocUserName()}</h2>
            </div>
            <h2>TODO</h2>
            <p>个人信息</p>
            <p>炉子</p>
            <p>背包</p>
            <p>卡箱</p>
        </>
    );
}

PanelHome.defaultProps = {
}

export default PanelHome;