import React from 'react'

import Stove from './Stove'
import Repertory from './Repertory'

import './PanelHome.css'

function PanelHome(props) {
    return (
        <>
            <div className="home_w">
                <Stove />
                <Repertory />
            </div>
        </>
    );
}

PanelHome.defaultProps = {
}

export default PanelHome;