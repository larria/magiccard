import { useState } from 'react'
import { Input, Radio, Rate, Result, Divider } from 'antd'
import type { RadioChangeEvent } from 'antd'
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router'
import getData from '../data/getData'
import type { ThemeAttr } from '../types/card'
import type { BookStat } from '../store/types'
import ThemeList from './ThemeList'
import './PanelSearch.css'

interface PanelSearchProps {
  themesList?: ThemeAttr[]
  themesColectedInfo?: BookStat | null
  handleClickResultTheme?: (themeId: string) => void
}

export default function PanelSearch({
  themesList = getData.getThemeList(),
  themesColectedInfo = null,
  handleClickResultTheme,
}: PanelSearchProps) {
  const navigate = useNavigate()
  const onClickResult =
    handleClickResultTheme ??
    ((themeId: string) => navigate(`/theme_card/${themeId}`))

  const [searchBy, setSearchBy] = useState<Record<string, string>>({})
  const [searchResultThemeList, setSearchResultThemeList] =
    useState<ThemeAttr[]>(themesList)

  function updateSearchBy(searchKey: string, searchVal: string) {
    const temp = JSON.parse(JSON.stringify(searchBy))
    if (temp[searchKey] !== searchVal) {
      temp[searchKey] = searchVal
      setSearchBy(temp)
      setSearchResultThemeList(getData.getThemesBySearch(temp, themesList))
    }
  }

  function deleteSearchBy(searchKey: string) {
    const temp = JSON.parse(JSON.stringify(searchBy))
    if (searchKey in temp) {
      delete temp[searchKey]
      setSearchBy(temp)
      setSearchResultThemeList(getData.getThemesBySearch(temp, themesList))
    }
  }

  function onSearchInput(e: { target: { value: string } }) {
    const str = e.target.value.trim()
    if (str.length >= 1) {
      updateSearchBy('name', str)
    } else {
      deleteSearchBy('name')
    }
  }

  function setDiff(diff: number) {
    if (diff >= 1 && diff <= 5) {
      updateSearchBy('diff', diff.toString())
    } else {
      deleteSearchBy('diff')
    }
  }

  function onThemeTypeChange(e: RadioChangeEvent) {
    const type = e.target.value as string
    if (type === '99') {
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
          <span style={{ marginLeft: '20px', fontSize: '16px' }}>星级</span>
          <Rate style={{ marginLeft: '10px' }} defaultValue={0} onChange={setDiff} />
        </div>
      </div>
      <div className="search_ctrl_w">
        <Radio.Group onChange={onThemeTypeChange} defaultValue="99">
          <Radio.Button value="99">全部</Radio.Button>
          <Radio.Button value="0">普通卡</Radio.Button>
          <Radio.Button value="1">已下架</Radio.Button>
          <Radio.Button value="2">活动卡</Radio.Button>
          <Radio.Button value="5">绝版卡</Radio.Button>
          <Radio.Button value="9">闪卡</Radio.Button>
        </Radio.Group>
      </div>
      <div className="search_result_w">
        <Divider />
        {searchResultThemeList.length === 0 && (
          <Result icon={<LoadingOutlined />} subTitle="暂未找到匹配卡牌" />
        )}
        {searchResultThemeList.length !== 0 && (
          <ThemeList
            themesList={searchResultThemeList}
            themesColectedInfo={themesColectedInfo}
            handleThemeLogoClick={onClickResult}
          />
        )}
      </div>
    </>
  )
}
