import React, { useState, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Modal, Tooltip } from 'antd'

import Card from './Card'
import PanelSearch from './PanelSearch'
import PanelMiniResp from './PanelMiniResp'
import MiniFastShopList from './MiniFastShopList'
import getData from '../getData'

import './PanelAlter.css'

function PanelAlter(props) {
    const [fromCardId, setFromCardId] = useState(props.fromCardId)
    const [toCardId, setToCardId] = useState(props.toCardId)
    // 目标卡搜索主题弹窗是否显示
    const [searchModelVisible, setSearchModelVisible] = useState(false)
    // 目标卡所在主题列表弹窗是否显示
    const [themeModelVisible, setThemeModelVisible] = useState(false)
    // 目标卡所在主题id
    const [toCardThemeId, setToCardThemeId] = useState(null)
    // 选择消耗卡弹窗是否可见
    const [respModelVisible, setRespModelVisible] = useState(false)
    // 变卡提示信息
    const alterInfoTxt = useMemo(() => {
        if (fromCardId && toCardId) {
            return fromCardId + ' ' + toCardId
        }
        return '请选择消耗卡与目标卡'
    }, [fromCardId, toCardId])

    // 关闭搜索框并显示主题
    function onSearchResultClicked(themeId) {
        setSearchModelVisible(false)
        setThemeModelVisible(true)
        setToCardThemeId(themeId)
    }

    // 点击选择列表中的目标卡
    function handleToCardClick(cardId) {
        setToCardId(cardId)
        setThemeModelVisible(false)
    }

    return (
        <>
            <div className="alter_w">
                <div className="alter_box_w">
                    <div className="alter_box">
                        <h3>消耗卡</h3>
                        <div className="alter_box_card">
                            {fromCardId && (
                                <>
                                    <Card id={fromCardId} showPrice={true} showNameInBigCard={true} />
                                </>
                            )}
                        </div>
                        <Button type="primary" shape="round" onClick={e => { setFromCardId('1234') }}>选择消耗卡</Button>
                    </div>
                    <Tooltip title="变卡">
                        <span className="alter_arr"></span>
                    </Tooltip>
                    <div className="alter_box">
                        <h3>目标卡</h3>
                        <div className="alter_box_card">
                            {toCardId && (
                                <>
                                    <Card id={toCardId} showPrice={true} showNameInBigCard={true} />
                                </>
                            )}
                        </div>
                        <Button type="primary" shape="round" onClick={e => { setSearchModelVisible(true) }}>选择目标卡</Button>
                    </div>
                </div>
                <p className="alter_info">{alterInfoTxt}</p>
            </div>
            <Modal
                title="请选择用以消耗的卡片"
                visible={respModelVisible}
                width={650}
                centered
                footer={null}
                onOk={e => setRespModelVisible(false)}
                onCancel={e => setRespModelVisible(false)}
            >
                <PanelMiniResp />
            </Modal>
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
            <Modal
                title="请选择要变的卡片"
                visible={themeModelVisible}
                width={650}
                centered
                footer={null}
                onOk={e => setThemeModelVisible(false)}
                onCancel={e => setThemeModelVisible(false)}
            >
                <MiniFastShopList listType="alter" showThemeId={toCardThemeId} onCardClick={handleToCardClick} />
            </Modal>
        </>
    )
}

PanelAlter.defaultProps = {
    fromCardId: null,
    toCardId: null
}

const mapStateToProps = (state) => {
    return {
        bookStat: state.bookStat
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setUserName: (name) => {
            let action = {
                type: 'setUserName',
                name: name
            }
            dispatch(action)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelAlter)