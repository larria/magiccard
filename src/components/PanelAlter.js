import React, { useState, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Tooltip } from 'antd'

import Card from './Card'
import getData from '../getData'

import './PanelAlter.css'

function PanelAlter(props) {
    const [fromCardId, setFromCardId] = useState(props.fromCardId)
    const [toCardId, setToCardId] = useState(props.toCardId)
    const alterInfoTxt = useMemo(() => {
        if (fromCardId && toCardId) {
            return fromCardId + ' ' + toCardId
        }
        return '请选择消耗卡与目标卡'
    }, [fromCardId, toCardId])
    return (
        <>
            <div className="alter_w">
                <div className="alter_box_w">
                    <div className="alter_box">
                        <h3>消耗卡</h3>
                        <div className="alter_box_card">
                            {fromCardId && (
                                <>
                                    <Card />
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
                                    <Card />
                                </>
                            )}
                        </div>
                        <Button type="primary" shape="round" onClick={e => { setToCardId('1234') }}>选择目标卡</Button>
                    </div>
                </div>
                <p className="alter_info">{alterInfoTxt}</p>
            </div>
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