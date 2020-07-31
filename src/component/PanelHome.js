import React from 'react'
import * as local from '../local'

function PanelHome(props) {
    return (
        <>
            <p>个人信息</p>
            <p>炉子</p>
            {local.getLocUserName()}
            <img src={local.getLocAvatar()} alt="" />
        </>
    );
}

PanelHome.defaultProps = {
}

export default PanelHome;