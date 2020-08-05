import React from 'react'

import './Stove.css'
import * as dpa from '../dispatchActionWithBusiness'

function Stove(props) {

    function toggleOpen() {
        // dpa.setName()
        // dpa.addExp()
        dpa.updateBagListWithATheme()
    }
    return (
        <>
            <div className="stove_w">
                <span className="stove_icon" onClick={toggleOpen}></span>
            </div>
        </>
    )
}

Stove.defaultProps = {
}

export default Stove