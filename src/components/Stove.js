import React, { useState } from 'react'
import { connect } from 'react-redux';

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
                {new Array(props.stoveStat.maxStove).fill(1).map((item, index) => {
                    return <span className="stove_icon" key={index} onClick={toggleOpen}></span>
                })}
                {showStoveSlots && (
                    <div className="stovelist_w">
                        <div className="stovelist_ctrl">
                            <h3>炼卡炉</h3>
                            <span className="stovelist_close_btn" onClick={() => { setShowStoveSlots(false) }}>关闭</span>
                        </div>
                        <StoveList />
                    </div>
                )}
            </div>
        </>
    )
}

Stove.defaultProps = {
}

const mapStateToProps = (state) => {
    return {
        stoveStat: state.stoveStat
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stove)