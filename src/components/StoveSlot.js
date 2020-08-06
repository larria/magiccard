import React from 'react'

function StoveSlot(props) {
    return (
        <>
            {props.slotType === 'blank' && (<div className="stoveslot stoveslot_blank"></div>)}
    {props.slotType === 'locked' && (<div className="stoveslot stoveslot_locked"><span className="stoveslot_locked_inner">{props.slotChild}</span></div>)}
        </>
    )
}

StoveSlot.defaultProps = {
    slotType: 'locked',
    slotChild: ''
}


export default StoveSlot