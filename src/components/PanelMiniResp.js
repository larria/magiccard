import React from 'react'
import { connect } from 'react-redux'

import ThemeLogo from './ThemeLogo'
import Card from './Card'
import DiffStar from './DiffStar'

function PanelMiniResp(props) {
    return (
        <>
        </>
    )
}

PanelMiniResp.defaultProps = {
}

const mapStateToProps = (state) => {
    return {
        bagList: state.bagList,
        chestList: state.chestList,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        addACardToBag: (cardId) => {
            let action = {
                type: 'bag_list/addOneCard',
                cardId
            }
            dispatch(action)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelMiniResp)