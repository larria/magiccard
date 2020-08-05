
import React from 'react'
import { Tabs } from 'antd';

import './PanelBook.css'

const { TabPane } = Tabs;

function PanelBook(props) {
    return (
        <>
            <div className="book_w">
                {/* <h2>我的集卡册</h2> */}
                <Tabs
                    defaultActiveKey="gotten"
                    tabBarStyle={{ marginLeft: '20px', marginBottom: '0', fontWeight: 'bolder' }}>
                    <TabPane tab="已集齐" key="gotten">
                        <ul class="booklist">
                            <li></li>
                        </ul>
                    </TabPane>
                    <TabPane tab="待收集" key="ungotten">
                    </TabPane>
                </Tabs>
            </div>
        </>
    )
}

PanelBook.defaultProps = {
}

export default PanelBook