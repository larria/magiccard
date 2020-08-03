import React from 'react'

import User from './User'
import Repertory from './Repertory'

import './PanelHome.css'

function PanelHome(props) {
    return (
        <>
            <User />
            <h2>stove</h2>
            <Repertory></Repertory>
        </>
    );
}

PanelHome.defaultProps = {
}

export default PanelHome;