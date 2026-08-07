import type { ReactNode } from 'react'
import { Divider, FloatButton } from 'antd'
import { UpOutlined, CheckOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router'
import getData from '../data/getData'
import type { ThemeAttr } from '../types/card'
import type { BookStat } from '../store/types'
import ThemePreview from './ThemePreview'
import ThemeLogo from './ThemeLogo'
import DiffStar from './DiffStar'
import './ThemeList.css'

interface ThemeListProps {
  themesList?: ThemeAttr[]
  themesColectedInfo?: BookStat | null
  showType?: 'byBlock' | 'byList'
  handleThemeLogoClick?: (themeId: string) => void
}

function CardListByBlock({
  themesList,
  themesColectedInfo,
  handleThemeLogoClick,
}: {
  themesList: ThemeAttr[]
  themesColectedInfo?: BookStat | null
  handleThemeLogoClick: (themeId: string) => void
}) {
  return (
    <div className="cardlist_by_block">
      {[1, 2, 3, 4, 5].map((diff) => {
        const themesByDiff = getData.getThemesByDiff(diff, themesList)
        if (themesByDiff.length) {
          return (
            <div key={diff}>
              <h3 className="cardlist_diff_title">
                星级 <DiffStar diff={diff} />
              </h3>
              <ul>
                {themesByDiff.map((item) => {
                  const collected =
                    themesColectedInfo && item.id in themesColectedInfo
                  return (
                    <li key={item.id} className={collected ? 'collected' : ''}>
                      <ThemePreview
                        theme_id={item.id}
                        onCardThemeClick={handleThemeLogoClick}
                        showName={item.name}
                      />
                    </li>
                  )
                })}
              </ul>
              <Divider />
            </div>
          )
        }
        return null
      })}
    </div>
  )
}

function CardListByList({
  themesList,
  themesColectedInfo,
  handleThemeLogoClick,
}: {
  themesList: ThemeAttr[]
  themesColectedInfo?: BookStat | null
  handleThemeLogoClick: (themeId: string) => void
}) {
  return (
    <div className="cardlist_by_list">
      {[1, 2, 3, 4, 5].map((diff) => {
        const themesByDiff = getData.getThemesByDiff(diff, themesList)
        if (themesByDiff.length) {
          return (
            <div key={diff}>
              <h3 className="cardlist_diff_title">
                星级 <DiffStar diff={diff} />
              </h3>
              <ul>
                {themesByDiff.map((item) => {
                  const collected =
                    themesColectedInfo && item.id in themesColectedInfo
                  return (
                    <li key={item.id} className={collected ? 'collected' : ''}>
                      <ThemeLogo
                        theme_id={item.id}
                        isBigLogo={false}
                        onThemeLogoClick={handleThemeLogoClick}
                        showName={item.name}
                      />
                      {collected && (
                        <CheckOutlined
                          style={{ marginLeft: 5, fontSize: 16, color: '#1890ff' }}
                        />
                      )}
                    </li>
                  )
                })}
              </ul>
              <Divider />
            </div>
          )
        }
        return null
      })}
    </div>
  )
}

export default function ThemeList({
  themesList,
  themesColectedInfo = null,
  showType = 'byList',
  handleThemeLogoClick,
}: ThemeListProps) {
  const navigate = useNavigate()
  const onClick =
    handleThemeLogoClick ??
    ((themeId: string) => navigate(`/theme_card/${themeId}`))

  let content: ReactNode = null
  const list = themesList ?? getData.getThemeList()
  if (showType === 'byBlock') {
    content = (
      <CardListByBlock
        themesList={list}
        themesColectedInfo={themesColectedInfo}
        handleThemeLogoClick={onClick}
      />
    )
  } else if (showType === 'byList') {
    content = (
      <CardListByList
        themesList={list}
        themesColectedInfo={themesColectedInfo}
        handleThemeLogoClick={onClick}
      />
    )
  }

  return (
    <>
      {content}
      <FloatButton.BackTop>
        <div className="back_to_top">
          <UpOutlined />
        </div>
      </FloatButton.BackTop>
    </>
  )
}
