import { useState, useMemo } from 'react'
import { Button, Modal, App } from 'antd'
import getData from '../data/getData'
import * as utils from '../utils'
import * as dpa from '../store/dispatchActionWithBusiness'
import { useGameStore } from '../store/useGameStore'
import Card from './Card'
import ThemePreview from './ThemePreview'
import PanelSearch from './PanelSearch'
import MiniRepertory from './MiniRepertory'
import MiniFastShopList from './MiniFastShopList'
import './PanelAlter.css'

interface PanelAlterProps {
  fromCardId?: string | null
  toCardId?: string | null
}

export default function PanelAlter({
  fromCardId: initFromCardId = null,
  toCardId: initToCardId = null,
}: PanelAlterProps) {
  const { modal } = App.useApp()
  const power = useGameStore((s) => s.power)
  const repStat = useGameStore((s) => s.repStat)
  const bagList = useGameStore((s) => s.bagList)
  const chestList = useGameStore((s) => s.chestList)
  const bookStat = useGameStore((s) => s.bookStat)
  const minusPower = useGameStore((s) => s.minusPower)

  const [fromCardId, setFromCardId] = useState<string | null>(initFromCardId)
  const [toCardId, setToCardId] = useState<string | null>(initToCardId)
  const [searchModelVisible, setSearchModelVisible] = useState(false)
  const [themeModelVisible, setThemeModelVisible] = useState(false)
  const [toCardThemeId, setToCardThemeId] = useState<string | null>(null)
  const [respModelVisible, setRespModelVisible] = useState(false)

  const alterInfoTxt = useMemo(() => {
    if (fromCardId && toCardId) {
      const fromCardData = getData.getCardById(fromCardId)
      const toCardData = getData.getCardById(toCardId)
      if (parseInt(fromCardData.price, 10) < parseInt(toCardData.price, 10)) {
        return (
          <>
            消耗卡面值（
            <span className="alter_info_em">{fromCardData.price}</span>）需大于目标卡面值（
            <span className="alter_info_em">{toCardData.price}</span>）
          </>
        )
      }
      if (fromCardId === toCardId) {
        return (
          <>
            <span className="alter_info_em">消耗卡</span>与
            <span className="alter_info_em">目标卡</span>不能是同一张卡
          </>
        )
      }
      const costPower = Math.ceil(parseInt(toCardData.price) / 50)
      return (
        <>
          目标卡面值<span className="alter_info_em">{toCardData.price}</span>，此次变卡需消耗魔力
          <span className="alter_info_em">{costPower}</span>
        </>
      )
    }
    if (fromCardId) {
      return (
        <>
          请选择<span className="alter_info_em">目标卡</span>
        </>
      )
    }
    if (toCardId) {
      return (
        <>
          请选择<span className="alter_info_em">消耗卡</span>
        </>
      )
    }
    return (
      <>
        请选择<span className="alter_info_em">消耗卡</span>与
        <span className="alter_info_em">目标卡</span>
      </>
    )
  }, [fromCardId, toCardId])

  const isAlterBtnAble = useMemo(() => {
    if (fromCardId && toCardId) {
      const fromCardData = getData.getCardById(fromCardId)
      const toCardData = getData.getCardById(toCardId)
      if (parseInt(fromCardData.price, 10) < parseInt(toCardData.price, 10)) {
        return false
      }
      if (fromCardId === toCardId) return false
      return true
    }
    return false
  }, [fromCardId, toCardId])

  function onSearchResultClicked(themeId: string) {
    setSearchModelVisible(false)
    setThemeModelVisible(true)
    setToCardThemeId(themeId)
  }

  function handleFromCardClick(cardId: string) {
    setFromCardId(cardId)
    setRespModelVisible(false)
  }

  function handleToCardClick(cardId: string) {
    setToCardId(cardId)
    setThemeModelVisible(false)
  }

  function alterCard() {
    if (!toCardId || !fromCardId) return
    const toCardData = getData.getCardById(toCardId)
    const costPower = Math.ceil(parseInt(toCardData.price) / 50)
    if (power >= costPower) {
      const newBagList = [...bagList]
      const newChestList = [...chestList]
      if (newBagList.includes(fromCardId)) {
        const idx = newBagList.findIndex((c) => c === fromCardId)
        newBagList.splice(idx, 1)
      } else if (newChestList.includes(fromCardId)) {
        const idx = newChestList.findIndex((c) => c === fromCardId)
        newChestList.splice(idx, 1)
      } else {
        modal.info({
          title: '换卡箱或保险箱找不到消耗卡',
          content: null,
          onOk() {},
        })
        return
      }
      modal.info({
        title: `您变出了 ${toCardData.name}`,
        content: (
          <>
            <Card id={toCardId} showPrice showNameInBigCard />
          </>
        ),
        onOk() {},
      })
      if (newBagList.length < repStat.bagSlotNum) {
        newBagList.push(toCardId)
      } else {
        newChestList.push(toCardId)
      }
      const themeCollected = utils.checkThemeCollected(newBagList, newChestList, [
        toCardData.theme_id,
      ])
      if (themeCollected) {
        modal.success({
          title: `您合成了${themeCollected.collectedThemeIds.length}套主题`,
          content: (
            <>
              {themeCollected.collectedThemeIds.map((theme_id) => (
                <ThemePreview key={theme_id} theme_id={theme_id} />
              ))}
            </>
          ),
          onOk() {},
        })
        dpa.updateBagList(themeCollected.bagCardIds)
        dpa.updateChestList(themeCollected.chestCardIds)
        let gold = 0
        let exp = 0
        themeCollected.collectedThemeIds.forEach((themeId) => {
          const diffNum = parseInt(getData.getThemeById(themeId).diff)
          gold += diffNum * diffNum * 100
          exp += diffNum * diffNum * 100
          dpa.addAThemeToBook(themeId)
        })
        dpa.addGold(gold)
        dpa.addExp(exp)
      } else {
        dpa.updateBagList(newBagList)
        dpa.updateChestList(newChestList)
      }
      minusPower(costPower)
      setFromCardId(null)
    } else {
      modal.info({
        title: '魔力不足',
        content: `此次变卡需魔力${costPower}，您现存魔力仅有${power}`,
        onOk() {},
      })
    }
  }

  return (
    <>
      <div className="alter_w">
        <div className="alter_box_w">
          <div className="alter_box">
            <h3>消耗卡</h3>
            <div className="alter_box_card">
              {fromCardId && (
                <Card id={fromCardId} showPrice showNameInBigCard />
              )}
            </div>
            <Button onClick={() => setRespModelVisible(true)}>
              选择消耗卡
            </Button>
          </div>
          <div className="alter_ctrl">
            <span className="alter_arr" />
            <Button
              disabled={!isAlterBtnAble}
              type="primary"
              size="large"
              shape="round"
              onClick={alterCard}
            >
              变卡
            </Button>
          </div>
          <div className="alter_box">
            <h3>目标卡</h3>
            <div className="alter_box_card alter_to_box_card">
              {toCardId && (
                <Card id={toCardId} showPrice showNameInBigCard />
              )}
            </div>
            <Button onClick={() => setSearchModelVisible(true)}>
              选择目标卡
            </Button>
          </div>
        </div>
        <p className="alter_info">{alterInfoTxt}</p>
      </div>
      <Modal
        title="请选择用以消耗的卡片"
        open={respModelVisible}
        width={650}
        centered
        footer={null}
        onOk={() => setRespModelVisible(false)}
        onCancel={() => setRespModelVisible(false)}
      >
        <MiniRepertory
          cardIdList={bagList.concat(chestList)}
          cardDisableRule={(cardData) =>
            !!toCardId &&
            parseInt(cardData.price, 10) <
              parseInt(getData.getCardById(toCardId).price, 10)
          }
          onCardClick={(cardData) => handleFromCardClick(cardData.id)}
        />
      </Modal>
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
      <Modal
        title="请选择要变的卡片"
        open={themeModelVisible}
        width={650}
        centered
        footer={null}
        onOk={() => setThemeModelVisible(false)}
        onCancel={() => setThemeModelVisible(false)}
      >
        <MiniFastShopList
          listType="alter"
          showThemeId={toCardThemeId ?? undefined}
          onCardClick={handleToCardClick}
        />
      </Modal>
    </>
  )
}
