import React from 'react'
import { connect } from 'react-redux'

import './MiniFastShop.css'

function MiniFastShop(props) {
    return (
        <>
            {/* <div className="minifastshop_mask"></div> */}
            <div className="minifastshop_w">
                <h3 className="minifastshop_title">炼卡攻略</h3>
                <p className="minifastshop_head">正在收集</p>
                <p className="minifastshop_head">选择套卡</p>
                <p className="minifastshop_head">主题卡片列表</p>
            </div>
        </>
    )
}

MiniFastShop.defaultProps = {
    // 默认显示的主题
    defaultThemeId: '40'
}
const mapStateToProps = (state) => {
    return {
        exp: state.exp,
        gold: state.gold,
        power: state.power,
        repStat: state.repStat,
        bagList: state.bagList,
        chestList: state.chestList,
        minifastshop: state.minifastshop
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        addACardToBag: (cardId) => {
            let action = {
                type: 'bag_list/addOneCard',
                cardId
            }
            dispatch(action);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MiniFastShop)
