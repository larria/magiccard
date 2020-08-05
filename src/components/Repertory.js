import React, { useState } from 'react'

import RepertoryBox from './RepertoryBox'

import './Repertory.css'

function Repertory(props) {
    // 打开箱子或关闭
    const [open, setOpen] = useState(false)

    function toggleOpen() {
        setOpen(!open)
    }

    function _close() {
        setOpen(false)
    }

    return (
        <>
            <div className="repertory_w">
                <span className="repertory_icon" onClick={toggleOpen}></span>
                <div style={{
                    display: open ? 'flex' : 'none'
                }}>
                    <RepertoryBox handleClickClose={_close}></RepertoryBox>
                </div>
                {/* <div className="repertory_box_mask" style={{
                    display: open ? 'flex' : 'none'
                }}></div> */}
            </div>
        </>
    )
}

// export default connect(mapStateToProps, mapDispatchToProps)(Repertory);
export default Repertory