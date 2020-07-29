import React, { useState, useEffect } from 'react';
import { createHashHistory } from 'history';
import { AutoComplete, Radio, Rate, Switch } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import getData from '../getData'

import './PanelSearch.css'


function setDiff(diff) {
    console.log(diff)
}

function PanelSearch(props) {
    const [searchBy, setsearchBy] = useState({
        diff: 0,
    });

    const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);

    function onSearchInput(val) {
        let value = val.trim()
        if (val.trim().length >= 1) {
            let options = getData.getThemesByName(value).map(item => {
                return {
                    value: item.name
                }
            })
            setAutoCompleteOptions(options)
        } else {
            setAutoCompleteOptions([])
        }
    }

    return (
        <>
            <div className="search_input_w">
                <AutoComplete
                    options={autoCompleteOptions}
                    prefix={<SearchOutlined />}
                    style={{
                        width: 200,
                    }}
                    // onSelect={onSelect}
                    // onSearch={onSearch}
                    onChange={onSearchInput}
                    placeholder="请输入要搜索的套卡名"
                >
                </AutoComplete>
                <Switch
                    checkedChildren="开" unCheckedChildren="关"
                    style={{ margin: '0 10px' }}
                />
                难度系数
                <Rate
                    defaultValue={0}
                    // disabled={true}
                    onChange={setDiff}
                >
                </Rate>
            </div>
            <div className="search_ctrl_w">
                <Radio.Group
                    // onChange={onChange}
                    defaultValue="99"
                >
                    <Radio.Button value="99">全部</Radio.Button>
                    <Radio.Button value="0">普通卡</Radio.Button>
                    <Radio.Button value="1">绝版卡</Radio.Button>
                    <Radio.Button value="2">活动卡</Radio.Button>
                    <Radio.Button value="9">闪卡</Radio.Button>
                </Radio.Group>
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