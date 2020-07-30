import React from 'react';
import { Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import './PageRegister.css'

function PageRegister(props) {
    return (
        <>
            <div className="register_w">
                <Input placeholder="default size" prefix={<UserOutlined />} />
            </div>
        </>
    )
}

PageRegister.defaultProps = {
}

export default PageRegister;