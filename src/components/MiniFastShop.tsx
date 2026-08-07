import { useState } from 'react'
import { Tooltip, Modal, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import './MiniFastShop.css'
import MiniFastShopList from './MiniFastShopList'
import ThemeLogo from './ThemeLogo'
import getData from '../data/getData'
import { defaultMiniThemeIdList } from '../config'
import PanelSearch from './PanelSearch'
import { useGameStore } from '../store/useGameStore'

interface MiniFastShopProps {
  defaultThemeId?: string | null
}

export default function MiniFastShop({
  defaultThemeId = null,
}: MiniFastShopProps) {
  const bagList = useGameStore((s) => s.bagList)
  const chestList = useGameStore((s) => s.chestList)
  const stoveList = useGameStore((s) => s.stoveList)
  const bookStat = useGameStore((s) => s.bookStat)

  const [searchModelVisible, setSearchModelVisible] = useState(false)

  function getRecommendedThemesList(defaultThemeList: string[]): string[] {
    const resSet = new Set<string>()
    stoveList.forEach((slotData) => {
      resSet.add(getData.getThemeByCardId(slotData.cardId).id)
    })
    if (resSet.size < 4) {
      const repCardIdList = [...bagList, ...chestList]
      const repThemeObj: Record<string, number> = {}
      const repThemeList: { themeId: string; priceTotal: number }[] = []
      repCardIdList.forEach((repCardId) => {
        const cardPrice = parseInt(getData.getCardById(repCardId).price, 10)
        const themeData = getData.getThemeByCardId(repCardId)
        const themeId = themeData.id
        if (themeData.type !== '2') {
          if (themeId in repThemeObj) {
            repThemeObj[themeId] += cardPrice
          } else {
            repThemeObj[themeId] = cardPrice
          }
        }
      })
      for (const themeId in repThemeObj) {
        repThemeList.push({ themeId, priceTotal: repThemeObj[themeId] })
      }
      repThemeList.sort((a, b) => b.priceTotal - a.priceTotal)
      repThemeList.forEach((repThemeItem) => {
        resSet.add(repThemeItem.themeId)
      })
      defaultThemeList.forEach((themeId) => {
        resSet.add(themeId)
      })
    }
    return [...resSet].slice(0, 4)
  }

  const recommendedThemesList = getRecommendedThemesList(defaultMiniThemeIdList)
  const [showThemeId, setShowThemeId] = useState<string>(
    defaultThemeId || recommendedThemesList[0],
  )

  function onSearchResultClicked(themeId: string) {
    setSearchModelVisible(false)
    setShowThemeId(themeId)
  }

  return (
    <div className="minifastshop_w">
      <div className="minifastshop_head">
        <h3 className="minifastshop_title">炼卡攻略</h3>
        <div className="minifastshop_ctrl">
          <span className="minifastshop_themelogo_txt">推荐主题</span>
          {recommendedThemesList.map((themeId) => (
            <span className="minifastshop_themelogo_w" key={themeId}>
              <Tooltip title={getData.getThemeById(themeId).name}>
                <span onClick={() => setShowThemeId(themeId)}>
                  <ThemeLogo theme_id={themeId} />
                </span>
              </Tooltip>
            </span>
          ))}
          <span className="minifastshop_search">
            <Button
              type="primary"
              icon={<SearchOutlined />}
              size="small"
              onClick={() => setSearchModelVisible(true)}
            >
              查找主题
            </Button>
          </span>
          <Modal
            title="搜索卡片主题"
            open={searchModelVisible}
            width={650}
            centered
            footer={null}
            onOk={() => setSearchModelVisible(false)}
            onCancel={() => setSearchModelVisible(false)}
          >
            <PanelSearch
              themesColectedInfo={bookStat}
              handleClickResultTheme={onSearchResultClicked}
            />
          </Modal>
        </div>
      </div>
      <MiniFastShopList showThemeId={showThemeId} listType="minishopAll" />
    </div>
  )
}
