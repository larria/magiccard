import React from 'react'

import './Stove.css'

function Stove(props) {

    function toggleOpen() {
        
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