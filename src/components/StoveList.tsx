import { useState, useMemo } from 'react'
import { Button, Modal, App } from 'antd'
import getData from '../data/getData'
import * as utils from '../utils'
import * as dpa from '../store/dispatchActionWithBusiness'
import { useGameStore } from '../store/useGameStore'
import './StoveList.css'
import StoveSlotWithCard from './StoveSlotWithCard'
import StoveSlot from './StoveSlot'
import ThemePreview from './ThemePreview'
import MiniFastShop from './MiniFastShop'

export default function StoveList() {
  const { modal } = App.useApp()
  const bagList = useGameStore((s) => s.bagList)
  const chestList = useGameStore((s) => s.chestList)
  const stoveStat = useGameStore((s) => s.stoveStat)
  const stoveList = useGameStore((s) => s.stoveList)
  const repStat = useGameStore((s) => s.repStat)

  const [miniFastShopModelVisible, setMiniFastShopModelVisible] =
    useState(false)

  const slotsNum = useMemo(
    () => stoveStat.maxStove + 2,
    [stoveStat.maxStove],
  )

  const slotsRenderState = utils.getStoveRenderState(stoveList, Date.now())
  const firstBlankIndex =
    slotsRenderState.length < slotsNum ? slotsRenderState.length : -1

  function getACardFromSlot(slotIndex: number) {
    if (repStat.bagSlotNum > bagList.length) {
      const cardId = stoveList[slotIndex].cardId
      const newStoveList = JSON.parse(JSON.stringify(stoveList))
      newStoveList.splice(slotIndex, 1)
      dpa.updateStoveList(newStoveList)

      const cardData = getData.getCardById(cardId)
      let exp = parseInt(cardData.price, 10)

      const currentBagList = [...bagList, cardId]
      const themeCollected = utils.checkThemeCollected(currentBagList, chestList, [
        cardData.theme_id,
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
        themeCollected.collectedThemeIds.forEach((themeId) => {
          const diffNum = parseInt(getData.getThemeById(themeId).diff)
          gold += diffNum * diffNum * 100
          exp += diffNum * diffNum * 100
          dpa.addAThemeToBook(themeId)
        })
        dpa.addGold(gold)
        dpa.addExp(exp)
        dpa.addPower(parseInt(String(gold / 10)))
      } else {
        dpa.addExp(exp)
        dpa.addPower(parseInt(String(exp / 40)))
        dpa.addACardToBagList(cardId)
      }
    } else {
      modal.info({
        title: '无法取出卡片',
        content: '换卡箱空位不足，请先整理换卡箱',
      })
    }
  }

  function handleCardRefined(_slotIndex: number) {
    console.log('卡片倒计时结束')
    dpa.updateStoveList(stoveList)
  }

  return (
    <>
      <ul className="stovelist">
        {new Array(5).fill(1).map((_, index) => {
          if (index < slotsNum) {
            if (slotsRenderState[index]) {
              return (
                <li key={index}>
                  <StoveSlotWithCard
                    slotIndex={index}
                    cardId={slotsRenderState[index].cardId}
                    state={slotsRenderState[index].state}
                    totalTime={parseInt(
                      getData.getCombineRuleByCardId(slotsRenderState[index].cardId).time,
                      10,
                    )}
                    restTime={slotsRenderState[index].restTime}
                    onGetCard={() => getACardFromSlot(index)}
                    onCardRefined={() => handleCardRefined(index)}
                  />
                </li>
              )
            }
            return (
              <li key={index}>
                <StoveSlot slotType="blank" />
                {firstBlankIndex === index && (
                  <Button
                    type="primary"
                    shape="round"
                    onClick={() => setMiniFastShopModelVisible(true)}
                  >
                    炼卡
                  </Button>
                )}
              </li>
            )
          }
          return (
            <li key={index}>
              <StoveSlot
                slotType="locked"
                slotChild={index === 3 ? '5级解锁' : '10级解锁'}
              />
            </li>
          )
        })}
      </ul>
      <Modal
        title={null}
        open={miniFastShopModelVisible}
        width="70%"
        centered
        footer={null}
        onOk={() => setMiniFastShopModelVisible(false)}
        onCancel={() => setMiniFastShopModelVisible(false)}
        destroyOnClose
      >
        <MiniFastShop />
      </Modal>
    </>
  )
}
