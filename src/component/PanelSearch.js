import React, { useState } from 'react';
import { createHashHistory } from 'history';
import { Input, Radio, Rate, Switch, Result, Divider } from 'antd';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';

import getData from '../getData'
import ThemeList from './ThemeList'

import './PanelSearch.css'

function PanelSearch(props) {
    // 搜索条件
    const [searchBy, setSearchBy] = useState({})
    // 根据输入条件找到的搜索结果
    const [searchResultThemeList, setSearchResultThemeList] = useState(props.themesList)

    // 更新搜索条件
    function updateSearchBy(searchKey, searchVal) {
        let _tempSearchBy = JSON.parse(JSON.stringify(searchBy))
        if (_tempSearchBy[searchKey] !== searchVal) {
            _tempSearchBy[searchKey] = searchVal
            setSearchBy(_tempSearchBy)
            setSearchResultThemeList(getData.getThemesBySearch(_tempSearchBy, props.themesList))
        }
    }

    // 删除搜索条件
    function deleteSearchBy(searchKey) {
        let _tempSearchBy = JSON.parse(JSON.stringify(searchBy))
        if (searchKey in _tempSearchBy) {
            delete _tempSearchBy[searchKey]
            setSearchBy(_tempSearchBy)
            setSearchResultThemeList(getData.getThemesBySearch(_tempSearchBy, props.themesList))
        }
    }

    // 输入框输入回调
    function onSearchInput(e) {
        let val = e.target.value
        let str = val.trim()
        if (str.length >= 1) {
            updateSearchBy('name', new RegExp(str, 'i'))
        } else {
            deleteSearchBy('name')
        }
    }

    function setDiff(diff) {
        if (diff >= 1 && diff <= 5) {
            updateSearchBy('diff', diff.toString())
        } else {
            deleteSearchBy('diff')
        }
    }

    function onThemeTypeChange(e) {
        let type = e.target.value
        if (type === "99") {
            deleteSearchBy('type')
        } else {
            updateSearchBy('type', type)
        }
    }

    return (
        <>
            <div className="search_input_w">
                <Input
                    className="search_input"
                    placeholder="请输入卡牌主题名称"
                    prefix={<SearchOutlined />}
                    onChange={onSearchInput}
                />
                <div className="search_diff_w">
                    <Switch
                        checkedChildren="星级" unCheckedChildren="星级"
                        style={{ margin: '0 10px' }}
                    />
                    <Rate
                        style={{ marginLeft: '10px' }}
                        defaultValue={0}
                        // disabled={true}
                        onChange={setDiff}
                    >
                    </Rate>
                </div>
            </div>
            <div className="search_ctrl_w">
                <Radio.Group
                    onChange={onThemeTypeChange}
                    defaultValue="99"
                >
                    <Radio.Button value="99">全部</Radio.Button>
                    <Radio.Button value="0">普通卡</Radio.Button>
                    <Radio.Button value="1">绝版卡</Radio.Button>
                    <Radio.Button value="2">活动卡</Radio.Button>
                    <Radio.Button value="9">闪卡</Radio.Button>
                </Radio.Group>
            </div>
            <div className="search_result_w">
                <Divider></Divider>
                {searchResultThemeList.length === 0 && <Result
                    icon={<LoadingOutlined />}
                    // title="暂未找到匹配卡牌"
                    subTitle="暂未找到匹配卡牌"
                />}
                {searchResultThemeList.length !== 0 && <ThemeList themesList={searchResultThemeList}>
                </ThemeList>}
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