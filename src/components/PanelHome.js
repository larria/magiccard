import React from 'react'
import { connect } from 'react-redux';

import './PanelHome.css'

function PanelHome(props) {
    return (
        <>
            <div className="user_w">
                <img src={props.avatar} alt="" />
                <h2 className="user_name">{props.userName}</h2>
            </div>
            <h2>TODO</h2>
            <p onClick={e => props.setUserName('xxxxx')}>个人信息</p>
            <p>炉子</p>
            <p>背包</p>
            <p>卡箱</p>
        </>
    );
}

PanelHome.defaultProps = {
}

const mapStateToProps = (state) => {
    return {
        userName: state.userName,
        avatar: state.avatar
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setUserName: (name) => {
            let action = {
                type: 'setUserName',
                name: name
            }
            dispatch(action);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelHome);