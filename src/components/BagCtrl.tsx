import { useState, useEffect } from 'react'
import { Button, App } from 'antd'
import {
  MoneyCollectOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import getData from '../data/getData'
import * as time from '../time'
import * as utils from '../utils'
import * as dpa from '../store/dispatchActionWithBusiness'
import { useGameStore } from '../store/useGameStore'
import ThemePreview from './ThemePreview'

const DRAW_INTERVAL = 1800

export default function BagCtrl() {
  const { modal } = App.useApp()
  const drawStat = useGameStore((s) => s.drawStat)
  const bagList = useGameStore((s) => s.bagList)
  const chestList = useGameStore((s) => s.chestList)
  const repStat = useGameStore((s) => s.repStat)
  const drawCards = useGameStore((s) => s.drawCards)
  const drawCardsAndResetTime = useGameStore((s) => s.drawCardsAndResetTime)
  const updateDrawStat = useGameStore((s) => s.updateDrawStat)
  const addGold = useGameStore((s) => s.addGold)
  const addCardsToBag = useGameStore((s) => s.addCardsToBag)
  const updateBagList = useGameStore((s) => s.updateBagList)

  const [canDrawLeftTime, setCanDrawLeftTime] = useState(
    utils.getTimeFormat(
      DRAW_INTERVAL -
        ((Date.now() - drawStat.lastResetTimeAtSamp) / 1000 % DRAW_INTERVAL),
    ),
  )

  useEffect(() => {
    time.addTask({
      name: 'countDrawNum',
      handle: (now) => {
        if (drawStat.lastDrawNumLeft < 16) {
          const drawNumFromTime =
            (now - drawStat.lastResetTimeAtSamp) / (DRAW_INTERVAL * 1000)
          if (drawNumFromTime > 1) {
            const newLastResetTimeAtSamp =
              now - ((now - drawStat.lastResetTimeAtSamp) % (DRAW_INTERVAL * 1000))
            updateDrawStat(parseInt(String(drawNumFromTime), 10), newLastResetTimeAtSamp)
          }
          setCanDrawLeftTime(
            utils.getTimeFormat(
              DRAW_INTERVAL -
                ((Date.now() - drawStat.lastResetTimeAtSamp) / 1000 % DRAW_INTERVAL),
            ),
          )
        } else {
          setCanDrawLeftTime(utils.getTimeFormat(DRAW_INTERVAL))
          time.removeTask('countDrawNum')
        }
      },
    })
    return () => {
      time.removeTask('countDrawNum')
    }
  })

  function applyCollected(themeCollected: ReturnType<typeof utils.checkThemeCollected>) {
    if (!themeCollected) return
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
    dpa.addPower(parseInt(String(exp / 40)))
  }

  function drawACardToBag() {
    if (bagList.length < repStat.bagSlotNum) {
      if (drawStat.lastDrawNumLeft > 0) {
        const cardId = getData.getCardsRandomFromCanGet(1)[0]
        const cardData = getData.getCardById(cardId)
        const currentBagList = [...bagList, cardId]
        const themeCollected = utils.checkThemeCollected(currentBagList, chestList, [
          cardData.theme_id,
        ])
        if (themeCollected) {
          applyCollected(themeCollected)
        } else {
          dpa.addACardToBagList(cardId)
        }
        drawCards(1)
        if (drawStat.lastDrawNumLeft === 16) {
          drawCardsAndResetTime(0, Date.now())
        }
      } else {
        modal.info({ title: '暂时没有抽卡次数', content: null, onOk() {} })
      }
    } else {
      modal.info({ title: '换卡箱已满', content: null, onOk() {} })
    }
  }

  function drawCardsToBag() {
    const num = Math.min(repStat.bagSlotNum - bagList.length, drawStat.lastDrawNumLeft)
    if (num > 0) {
      const cardList = getData.getCardsRandomFromCanGet(num)
      const currentBagList = [...bagList, ...cardList]
      const themeIds = cardList.map((c) => getData.getCardById(c).theme_id)
      const themeCollected = utils.checkThemeCollected(currentBagList, chestList, themeIds)
      if (themeCollected) {
        applyCollected(themeCollected)
      } else {
        addCardsToBag(cardList)
      }
      drawCards(num)
      if (drawStat.lastDrawNumLeft === 16) {
        drawCardsAndResetTime(0, Date.now())
      }
    } else {
      modal.info({ title: '换卡箱已满 或 没有抽卡次数', content: null })
    }
  }

  function sellAllNormalCards() {
    const toSoldCardsList: string[] = []
    let soldGold = 0
    const leftCardsList: string[] = []
    bagList.forEach((card_id) => {
      const cardInfo = getData.getCardById(card_id)
      const themeInfo = getData.getThemeById(cardInfo.theme_id)
      if (cardInfo.price === '10' && themeInfo.type === '0') {
        toSoldCardsList.push(card_id)
        soldGold += parseInt(cardInfo.price, 10)
      } else {
        leftCardsList.push(card_id)
      }
    })
    if (toSoldCardsList.length > 0) {
      modal.confirm({
        title: `确认要一键卖出${toSoldCardsList.length}张普通素材卡？`,
        icon: <ExclamationCircleOutlined />,
        onOk() {
          addGold(soldGold)
          updateBagList(leftCardsList)
        },
        onCancel() {
          console.log('已取消')
        },
        okText: '确认',
        cancelText: '取消',
      })
    } else {
      modal.info({ title: '换卡箱没有可售出的普通素材卡', content: null, onOk() {} })
    }
  }

  return (
    <>
      <Button
        className="repertory_bag_btn"
        icon={<DownloadOutlined />}
        size="small"
        onClick={drawACardToBag}
        disabled={drawStat.lastDrawNumLeft <= 0}
      >
        抽卡
      </Button>
      <Button
        className="repertory_bag_btn"
        type="primary"
        icon={<DownloadOutlined />}
        size="small"
        disabled={drawStat.lastDrawNumLeft <= 0}
        onClick={drawCardsToBag}
      >
        一键抽卡[{drawStat.lastDrawNumLeft}]
      </Button>
      <div className="repertory_draw_stat">
        {drawStat.lastDrawNumLeft < 16 && (
          <span className="repertory_draw_time"> 下一张卡：{canDrawLeftTime}</span>
        )}
      </div>
      <span style={{ flex: '1' }} />
      <Button
        className="repertory_bag_btn repertory_bag_btn_sell_all"
        type="primary"
        icon={<MoneyCollectOutlined rotate={180} />}
        size="small"
        onClick={sellAllNormalCards}
      >
        一键卖普卡
      </Button>
    </>
  )
}
