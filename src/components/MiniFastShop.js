import React from 'react'
import { connect } from 'react-redux'

import './MiniFastShop.css'
import MiniFastShopList from './MiniFastShopList'
import ThemeLogo from './ThemeLogo'

function MiniFastShop(props) {
    return (
        <>
            {props.minifastshop.isShow && (<div className="minifastshop_mask"></div>)}
            {props.minifastshop.isShow && (
                <div className="minifastshop_w">
                    <h3 className="minifastshop_title">炼卡攻略</h3>
                    <div className="minifastshop_ctrl">
                        <p className="minifastshop_head">
                            <span className="minifastshop_themelogo_txt">推荐主题</span>
                            {props.minifastshop.reCommendedThemesList.map(themeId => {
                                return (
                                <span className="minifastshop_themelogo_w"><ThemeLogo key={themeId} theme_id={themeId}></ThemeLogo></span>
                                )
                            })}
                        </p>
                        <span className="minifastshop_close_btn" onClick={props.handleClickClose}>关闭</span>
                    </div>
                    <MiniFastShopList />
                </div>
            )}
        </>
    )
}

MiniFastShop.defaultProps = {
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
        handleClickClose: () => {
            let action = {
                type: 'minifastshop/setShow',
                isShow: false
            }
            dispatch(action);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MiniFastShop)
