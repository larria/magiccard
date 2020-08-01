import React, { useState } from 'react';

function PanelSettings(props) {
    const [friendsNum, setFriendsNum] = useState(5)

    function handleClick() {
        setFriendsNum(friendsNum + 1)
    }
    return (
        <>
            <h2>TODO</h2>
            <h3>个人信息</h3>
            <p>修改个人昵称与头像</p>
            <p onClick={handleClick}>设置好友数量: {friendsNum}</p>
            <h3>数据管理</h3>
            <p>清空个人数据</p>
            <p>下载个人数据</p>
        </>
    )
}


PanelSettings.defaultProps = {
}

export default PanelSettings;