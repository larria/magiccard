import React from 'react'

import User from './User'

import './PanelHome.css'

function PanelHome(props) {
    return (
        <>
            <User />
            <p>炉子</p>
            <p>背包</p>
            <p>卡箱</p>
        </>
    );
}

PanelHome.defaultProps = {
}

export default PanelHome;