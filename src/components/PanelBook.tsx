import { useMemo } from 'react'
import { Tabs } from 'antd'
import ThemeList from './ThemeList'
import getData from '../data/getData'
import { useGameStore } from '../store/useGameStore'
import './PanelBook.css'

export default function PanelBook() {
  const bookStat = useGameStore((s) => s.bookStat)

  const collectedThemeList = useMemo(() => {
    return {
      collected: getData.getThemesInclude(bookStat),
      unCollected: getData.getThemesExclude(bookStat),
    }
  }, [bookStat])

  const totalCollected = collectedThemeList.collected.length
  const totalUncollected = collectedThemeList.unCollected.length

  const items = [
    {
      key: 'gotten',
      label: (
        <>
          已收集
          <span className="book_num">
            （{totalCollected} / {totalCollected + totalUncollected}）
          </span>
        </>
      ),
      children: (
        <div className="booklist_w">
          {totalCollected > 0 ? (
            <ThemeList
              showType="byBlock"
              themesList={collectedThemeList.collected}
              themesColectedInfo={bookStat}
            />
          ) : (
            <p>您还没有集齐任何主题</p>
          )}
        </div>
      ),
    },
    {
      key: 'ungotten',
      label: (
        <>
          待收集<span className="book_num">（{totalUncollected}）</span>
        </>
      ),
      children: (
        <div className="booklist_w">
          {totalUncollected > 0 ? (
            <ThemeList
              showType="byBlock"
              themesList={collectedThemeList.unCollected}
            />
          ) : (
            <p>您已集齐了全部主题</p>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="book_w">
      <Tabs
        defaultActiveKey="gotten"
        items={items}
        tabBarStyle={{ marginLeft: '20px', marginBottom: '0', fontWeight: 'bolder' }}
      />
    </div>
  )
}
