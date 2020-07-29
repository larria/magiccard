import React, { useState, useEffect } from 'react';
import { createHashHistory } from 'history';
import { AutoComplete, Input, Rate, Checkbox } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import getData from '../getData'


function setDiff(diff) {
    console.log(diff)
}

function PanelSearch(props) {
    const [options, setOptions] = useState([{
        value: '111',
    }, {
        value: '222',
    }]);
    return (
        <>
            <div className="search_input_w">
                <AutoComplete
                    options={options}
                    prefix={<SearchOutlined />}
                    style={{
                        width: 200,
                    }}
                    // onSelect={onSelect}
                    // onSearch={onSearch}
                    placeholder="请输入要搜索的套卡名"
                >
                </AutoComplete>
                <Checkbox
                    style={{marginLeft: '10px'}}
                // onChange={}
                >
                    难度系数
                </Checkbox>
                <Rate
                    defaultValue={0}
                    // disabled={true}
                    onChange={setDiff}
                >
                </Rate>
            </div>
            <div className="search_input_w">
                <Checkbox
                    indeterminate={true}
                // onChange={this.onCheckAllChange}
                // checked={this.state.checkAll}
                >
                    闪卡
            </Checkbox>
                <Checkbox
                    indeterminate={true}
                // onChange={this.onCheckAllChange}
                // checked={this.state.checkAll}
                >绝版卡
            </Checkbox>
            </div>
        </>
    )
}

PanelSearch.defaultProps = {
    themesList: getData.getThemeList(),
    onGetResult: (theme_id) => {
        let history = createHashHistory();
        history.push(`/theme_card/${theme_id}`)
    }
}

export default PanelSearch;