import React, { useState } from 'react';

function PanelSettings(props) {
    return (
        <>
            <p>设置好友数量</p>
            <h2>数据管理</h2>
            <p>清空个人数据</p>
            <p>下载个人数据</p>
        </>
    )
}


PanelSettings.defaultProps = {
}

export default PanelSettings;