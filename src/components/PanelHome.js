import React from 'react'

import User from './User'
import Stove from './Stove'
import Repertory from './Repertory'
import MiniFastShop from './MiniFastShop'

import './PanelHome.css'

function PanelHome(props) {
    return (
        <>
            <div className="home_w">
                <User />
                <div className="home_cont">
                    <Stove />
                    <Repertory />
                    <MiniFastShop />
                </div>
            </div>
        </>
    );
}

PanelHome.defaultProps = {
}

export default PanelHome;