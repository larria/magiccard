import React, { useState, useEffect } from 'react';
import { Radio, Button, Modal, Tooltip } from 'antd';
import { SearchOutlined, UnorderedListOutlined, FileImageOutlined } from '@ant-design/icons';

import getData from '../getData'
// import getURL from '../getURL'
import PanelSearch from './PanelSearch'
import ThemeList from './ThemeList'

import './PanelMuseum.css'

function PanelMuseum(props) {
  const [showType, setShowType] = useState(props.showType)
  const [searchModelVisible, setSearchModelVisible] = useState(false)

  useEffect(() => {
    console.timeEnd('render')
  });

  function onShowTypeChange(e) {
    console.time('click')
    setShowType(e.target.value)
    console.timeEnd('click')
  }

  function onClickSearchButton() {
    setSearchModelVisible(true)
  }

  function handleSearchOk() {
    setSearchModelVisible(false)
  }

  function handleSearchCancel() {
    setSearchModelVisible(false)
  }
  console.time('render')

  return (
    <>
      <div className="museum_hd">
        <Radio.Group onChange={onShowTypeChange} defaultValue={showType}>
          <Radio.Button value="byList"><UnorderedListOutlined /></Radio.Button>
          <Radio.Button value="byBlock"><FileImageOutlined /></Radio.Button>
        </Radio.Group>
        <span className="cardlist_search">
          <Tooltip title="搜索">
            <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={onClickSearchButton} />
          </Tooltip>
        </span>
        <Modal
          title="搜索卡片主题"
          visible={searchModelVisible}
          width={650}
          footer={null}
          onOk={handleSearchOk}
          onCancel={handleSearchCancel}
        >
          <PanelSearch />
        </Modal>
        <p className="museum_state">主题共<span className="museum_state_num">{props.themesList.length}</span>套</p>
      </div>
      <ThemeList showType={showType}></ThemeList>
    </>
  );
}

PanelMuseum.defaultProps = {
  themesList: getData.getThemeList(),
  // showType: 'byBlock',
  showType: 'byList'
}

export default PanelMuseum;