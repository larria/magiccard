import React, { useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Tooltip, Modal, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons';

import './MiniFastShop.css'
import MiniFastShopList from './MiniFastShopList'
import ThemeLogo from './ThemeLogo'
import getData from '../getData'
import { defaultMiniThemeIdList } from '../config'
import PanelSearch from './PanelSearch'

function MiniFastShop(props) {
    // const recommendedThemesList = getRecommendedThemesList(defaultMiniThemeIdList)
    // props.setShowThemeId(recommendedThemesList[0])

    // 推荐主题列表
    const recommendedThemesList = useMemo(() => {
        let res = getRecommendedThemesList(defaultMiniThemeIdList)
        props.setShowThemeId(res[0])
        return res
    }, [])

    const [searchModelVisible, setSearchModelVisible] = useState(false)

    function getRecommendedThemesList(defaultThemeList) {
        let resSet = new Set()
        if (props.minifastshop.showThemeId) {
            resSet.add(props.minifastshop.showThemeId)
        }
        // 优先match炉子中有的主题
        props.stoveList.forEach(slotData => {
            resSet.add(getData.getThemeByCardId(slotData.cardId).id)
        })
        // 如果主题不够，从换卡箱和保险箱里取
        if (resSet.size < 4) {
            let repCardIdList = [...props.bagList, ...props.chestList]
            let repThemeObj = {}
            let repThemeList = []
            repCardIdList.forEach(repCardId => {
                let cardPrice = parseInt(getData.getCardById(repCardId).price, 10)
                let themeData = getData.getThemeByCardId(repCardId)
                let themeId = themeData.id
                // 限制主题类型，不能是活动卡
                if (themeData.type !== '2') {
                    if (themeId in repThemeObj) {
                        repThemeObj[themeId] += cardPrice
                    } else {
                        repThemeObj[themeId] = cardPrice
                    }
                }
            })
            // 根据换卡箱和保险箱的卡判断推荐的主题
            for (let themeId in repThemeObj) {
                repThemeList.push({
                    themeId: themeId,
                    priceTotal: repThemeObj[themeId]
                })
            }
            repThemeList.sort((a, b) => b.priceTotal - a.priceTotal)
            repThemeList.forEach(repThemeItem => {
                resSet.add(repThemeItem.themeId)
            })
            defaultThemeList.forEach(themeId => {
                resSet.add(themeId)
            })
        }
        return [...resSet].slice(0, 4)
    }

    // 关闭搜索框并显示主题
    function onSearchResultClicked(themeId) {
        setSearchModelVisible(false)
        props.setShowThemeId(themeId)
    }

    return (
        <>
            {props.minifastshop.isShow && (<div className="minifastshop_mask"></div>)}
            {props.minifastshop.isShow && (
                <div className="minifastshop_w">
                    <div className="minifastshop_head">
                        <h3 className="minifastshop_title">炼卡攻略</h3>
                        <div className="minifastshop_ctrl">
                            <span className="minifastshop_themelogo_txt">推荐主题</span>
                            {recommendedThemesList.map(themeId => {
                                return (
                                    <span className="minifastshop_themelogo_w" key={themeId}>
                                        <Tooltip title={getData.getThemeById(themeId).name}>
                                            <span onClick={e => props.setShowThemeId(themeId)}>
                                                <ThemeLogo key={themeId} theme_id={themeId} />
                                            </span>
                                        </Tooltip>
                                    </span>
                                )
                            })}
                            <span className="minifastshop_search">
                                <Button type="primary" icon={<SearchOutlined />} size="small" onClick={e => setSearchModelVisible(true)}>查找主题</Button>
                            </span>
                            <Modal
                                title="搜索卡片主题"
                                visible={searchModelVisible}
                                width={650}
                                centered
                                footer={null}
                                onOk={e => setSearchModelVisible(false)}
                                onCancel={e => setSearchModelVisible(false)}
                            >
                                <PanelSearch
                                    themesColectedInfo={props.bookStat}
                                    handleClickResultTheme={onSearchResultClicked}
                                />
                            </Modal>
                        </div>
                    </div>
                    <MiniFastShopList listType="minishopAll" />
                    <span className="minifastshop_close_btn" onClick={props.handleClickClose}>关闭</span>
                </div>
            )}
        </>
    )
}

MiniFastShop.defaultProps = {
}
const mapStateToProps = (state) => {
    return {
        bagList: state.bagList,
        chestList: state.chestList,
        stoveList: state.stoveList,
        minifastshop: state.minifastshop,
        bookStat: state.bookStat
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
        },
        setShowThemeId: (showThemeId) => {
            let action = {
                type: 'minifastshop/setShowTheme',
                showThemeId
            }
            dispatch(action);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MiniFastShop)
