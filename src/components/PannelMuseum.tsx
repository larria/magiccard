import { useState } from 'react'
import { Radio, Button, Modal, Tooltip } from 'antd'
import type { RadioChangeEvent } from 'antd'
import { SearchOutlined, UnorderedListOutlined, FileImageOutlined } from '@ant-design/icons'
import getData from '../data/getData'
import PanelSearch from './PanelSearch'
import ThemeList from './ThemeList'
import './PanelMuseum.css'

interface PanelMuseumProps {
  themesList?: ReturnType<typeof getData.getThemeList>
  showType?: 'byList' | 'byBlock'
}

export default function PanelMuseum({
  themesList = getData.getThemeList(),
  showType = 'byList',
}: PanelMuseumProps) {
  const [curShowType, setShowType] = useState(showType)
  const [searchModelVisible, setSearchModelVisible] = useState(false)

  function onShowTypeChange(e: RadioChangeEvent) {
    setShowType(e.target.value as 'byList' | 'byBlock')
  }

  return (
    <>
      <div className="museum_hd">
        <Radio.Group onChange={onShowTypeChange} defaultValue={showType}>
          <Radio.Button value="byList">
            <UnorderedListOutlined />
          </Radio.Button>
          <Radio.Button value="byBlock">
            <FileImageOutlined />
          </Radio.Button>
        </Radio.Group>
        <span className="cardlist_search">
          <Tooltip title="搜索">
            <Button
              type="primary"
              shape="circle"
              icon={<SearchOutlined />}
              onClick={() => setSearchModelVisible(true)}
            />
          </Tooltip>
        </span>
        <Modal
          title="搜索卡片主题"
          open={searchModelVisible}
          width={650}
          footer={null}
          onOk={() => setSearchModelVisible(false)}
          onCancel={() => setSearchModelVisible(false)}
        >
          <PanelSearch />
        </Modal>
        <p className="museum_state">
          主题共<span className="museum_state_num">{themesList.length}</span>套
        </p>
      </div>
      <ThemeList showType={curShowType} />
    </>
  )
}
