import React, { useState } from 'react'

import StoveList from './StoveList'

import './Stove.css'
// import * as dpa from '../dispatchActionWithBusiness'

function Stove(props) {
    const [showStoveSlots, setShowStoveSlots] = useState(true)

    function toggleOpen() {
        // dpa.setName()
        // dpa.addExp()
        // dpa.updateBagListWithATheme()
        setShowStoveSlots(!showStoveSlots)
    }
    return (
        <>
            <div className="stove_w">
                <span className="stove_icon" onClick={toggleOpen}></span>
                {showStoveSlots && (
                    <div className="stovelist_w">
                        <div className="stovelist_ctrl"></div>
                        <StoveList />
                    </div>
                )}
            </div>
        </>
    )
}

Stove.defaultProps = {
}

export default Stove