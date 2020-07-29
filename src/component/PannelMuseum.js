import React, { useState, useEffect } from 'react';
import { Divider, Radio, Button, Modal, Tooltip } from 'antd';
import { SearchOutlined, UnorderedListOutlined, InsertRowBelowOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { createHashHistory } from 'history';

import getData from '../getData'
// import getURL from '../getURL'
import PanelSearch from './PanelSearch'
import ThemePreview from './ThemePreview'
import ThemeLogo from './ThemeLogo'
import DiffStar from './DiffStar'

import './PanelMuseum.css'

const { Title } = Typography;

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
      <Radio.Group onChange={onShowTypeChange} defaultValue={showType}>
        <Radio.Button value="byBlock"><InsertRowBelowOutlined /></Radio.Button>
        <Radio.Button value="byList"><UnorderedListOutlined /></Radio.Button>
      </Radio.Group>
      <span className="cardlist_search">
        <Tooltip title="搜索">
          <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={onClickSearchButton} />
        </Tooltip>
      </span>
      <Modal
        title="请搜索套卡"
        visible={searchModelVisible}
        footer={null}
        onOk={handleSearchOk}
        onCancel={handleSearchCancel}
      >
        <PanelSearch></PanelSearch>
      </Modal>
      {(showType === 'byBlock' && <CardListByBlock />)}
      {(showType === 'byList' && <CardListByList />)}
    </>
  );
}

function CardListByBlock() {
  return (
    <div className="cardlist_by_block">
      {[1, 2, 3, 4, 5].map(diff => {
        return (
          <div key={diff}>
            <Title level={4}>
              <DiffStar diff={diff}></DiffStar>
            </Title>
            <ul>
              {getData.getThemesByDiff(diff).map(item => {
                return (
                  <li key={item.id}>
                    <ThemePreview
                      theme_id={item.id}
                      onCardThemeClick={_toTheme.bind(this, item.id)}
                      showName={item.name}>
                    </ThemePreview>
                  </li>
                )
              })}
            </ul>
            <Divider></Divider>
          </div>
        )
      })}
    </div>
  )
}

function CardListByList() {
  return (
    <div className="cardlist_by_list">
      {[1, 2, 3, 4, 5].map(diff => {
        return (
          <div key={diff}>
            <Title level={4}>
              <DiffStar diff={diff}></DiffStar>
            </Title>
            <ul>
              {getData.getThemesByDiff(diff).map(item => {
                return (
                  <li key={item.id}>
                    <ThemeLogo
                      theme_id={item.id}
                      isBigLogo={false}
                      onThemeLogoClick={_toTheme.bind(this, item.id)}
                      showName={item.name}
                    ></ThemeLogo>
                  </li>
                )
              })}
            </ul>
            <Divider></Divider>
          </div>
        )
      })}
    </div>
  )
}

function _toTheme(theme_id) {
  let history = createHashHistory();
  history.push(`/theme_card/${theme_id}`)
}

PanelMuseum.defaultProps = {
  themesList: getData.getThemeList(),
  showType: 'byBlock'
}

export default PanelMuseum;