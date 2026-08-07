import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { App, Button, Tooltip } from 'antd'
import './MiniFastShopList.css'
import getData from '../data/getData'
import * as utils from '../utils'
import * as dpa from '../store/dispatchActionWithBusiness'
import { useGameStore } from '../store/useGameStore'
import Card from './Card'
import DiffStar from './DiffStar'
import ThemePreview from './ThemePreview'
import ThemeLogo from './ThemeLogo'
import type { CardAttr } from '../types/card'

interface MiniFastShopListProps {
  showThemeId?: string
  listType?: string
  onCardClick?: (cardId: string) => void
}

export default function MiniFastShopList({
  showThemeId = '40',
  listType = 'minishopAll',
  onCardClick,
}: MiniFastShopListProps) {
  const { modal } = App.useApp()
  const themeData = getData.getThemeById(showThemeId)
  const cardsOfTheme = getData.getCardsByThemeId(showThemeId)
  const cardsSortByPrice = getData.getCardsByThemeIdAndSortByPrice(showThemeId)

  const gold = useGameStore((s) => s.gold)
  const bagList = useGameStore((s) => s.bagList)
  const chestList = useGameStore((s) => s.chestList)
  const stoveList = useGameStore((s) => s.stoveList)
  const stoveStat = useGameStore((s) => s.stoveStat)
  const repStat = useGameStore((s) => s.repStat)
  const subGold = useGameStore((s) => s.subGold)
  const addACardToBag = useGameStore((s) => s.addCardToBag)
  const putACardInStove = useGameStore((s) => s.putACardInStove)

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)

  const fromSelectCardIdList = useMemo<string[] | null>(() => {
    if (selectedCardId) {
      const combData = getData.getCombineRuleByCardId(selectedCardId)
      if (combData) return combData.from.split(',')
    }
    return null
  }, [selectedCardId])

  function getCardStyle(cardId: string): CSSProperties {
    if (selectedCardId === cardId) return { backgroundColor: 'gold' }
    if (fromSelectCardIdList && fromSelectCardIdList.includes(cardId)) {
      return { backgroundColor: 'tomato' }
    }
    return {}
  }

  function getCardInfoInRepAndStove(cardId: string) {
    const repList = bagList.concat(chestList)
    const numsInRep = repList.filter((c) => c === cardId).length
    const numsInStove = stoveList.filter((s) => s.cardId === cardId).length
    return { numsInRep, numsInStove }
  }

  function handleClickCard(cardId: string) {
    if (listType.includes('minishop')) {
      setSelectedCardId(cardId)
    } else {
      onCardClick && onCardClick(cardId)
    }
  }

  function handleBuyCard(cardId: string) {
    const cardData = getData.getCardById(cardId)
    if (gold >= Number(cardData.price)) {
      if (repStat.bagSlotNum > bagList.length) {
        subGold(Number(cardData.price))
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
          let goldGain = 0
          let exp = 0
          themeCollected.collectedThemeIds.forEach((themeId) => {
            const diffNum = parseInt(getData.getThemeById(themeId).diff)
            goldGain += diffNum * diffNum * 100
            exp += diffNum * diffNum * 10
            dpa.addAThemeToBook(themeId)
          })
          dpa.addGold(goldGain)
          dpa.addExp(exp)
          dpa.addPower(parseInt(String(goldGain / 10)))
        } else {
          addACardToBag(cardId)
        }
      } else {
        modal.info({ title: '换卡箱满了', content: '请整理换卡箱' })
      }
    } else {
      modal.info({
        title: '金币不够',
        content: `购买卡片${cardData.name}需要支付${cardData.price}金币`,
      })
    }
  }

  function handleRefineCard(cardId: string) {
    if (stoveList.length < stoveStat.maxStove + 2) {
      const startToRefineAt = utils.getStartToRefineAt(stoveList, stoveStat.maxStove)
      putACardInStove(cardId, startToRefineAt)

      const combData = getData.getCombineRuleByCardId(cardId)
      const fromCardIdList = combData.from.split(',')
      const newBagList: string[] = JSON.parse(JSON.stringify(bagList))
      const newChestList: string[] = JSON.parse(JSON.stringify(chestList))
      fromCardIdList.forEach((cid) => {
        const cardIndexInBagList = newBagList.findIndex((c) => c === cid)
        if (cardIndexInBagList === -1) {
          const cardIndexInChestList = newChestList.findIndex((c) => c === cid)
          if (cardIndexInChestList === -1) {
            alert('换卡箱和保险箱都找不到素材卡，程序疑似错误')
          } else {
            newChestList.splice(cardIndexInChestList, 1)
          }
        } else {
          newBagList.splice(cardIndexInBagList, 1)
        }
      })
      if (newBagList.length !== bagList.length) {
        dpa.updateBagList(newBagList)
      }
      if (newChestList.length !== chestList.length) {
        dpa.updateChestList(newChestList)
      }
    } else {
      modal.info({ title: '炉位已满', content: null })
    }
  }

  function getListCardJSX(cardData: CardAttr) {
    const cardNums = getCardInfoInRepAndStove(cardData.id)
    const showBuyBtn = themeData.type === '0' && cardData.price === '10'

    let showCombBtn = true
    const combData = getData.getCombineRuleByCardId(cardData.id)
    if (combData && listType.includes('minishop')) {
      if (listType === 'minishopLv2' && cardData.price !== '40') {
        showCombBtn = false
      } else {
        const fromCardIdList = combData.from.split(',')
        for (let i = 0; i < fromCardIdList.length; i++) {
          const fromCardId = fromCardIdList[i]
          if (!bagList.includes(fromCardId) && !chestList.includes(fromCardId)) {
            showCombBtn = false
            break
          }
        }
      }
    } else {
      showCombBtn = false
    }

    return (
      <li key={cardData.id}>
        <Tooltip title={cardData.name}>
          <span
            className="minifastshop_list_card_w"
            onClick={() => handleClickCard(cardData.id)}
            style={getCardStyle(cardData.id)}
          >
            <Card id={cardData.id} isSmall />
            {cardNums.numsInRep !== 0 && (
              <>
                <span className="minifastshop_list_card_rep_num">
                  {cardNums.numsInRep}
                </span>
                <span className="minifastshop_list_card_rep_num_bg" />
              </>
            )}
            {cardNums.numsInStove !== 0 && (
              <span className="minifastshop_list_card_mask">合成中</span>
            )}
            {cardNums.numsInRep === 0 && cardNums.numsInStove === 0 && (
              <span className="minifastshop_list_card_mask" />
            )}
          </span>
        </Tooltip>
        {showBuyBtn && (
          <Button
            type="primary"
            size="small"
            onClick={() => handleBuyCard(cardData.id)}
          >
            购买
          </Button>
        )}
        {showCombBtn && (
          <Button
            type="primary"
            size="small"
            onClick={() => handleRefineCard(cardData.id)}
          >
            合成
          </Button>
        )}
      </li>
    )
  }

  return (
    <div className="minifastshop_list_w">
      <div className="minifastshop_list_head">
        <ThemeLogo theme_id={themeData.id} />
        <h4 className="minifastshop_list_title">{themeData.name}</h4>
        <DiffStar diff={themeData.diff} size={14} />
        <p className="minifastshop_list_info">共{cardsOfTheme.length}张卡片</p>
      </div>
      <ul className="minifastshop_list">
        {cardsSortByPrice.map((cardsByPriceObj) => (
          <li className="minifastshop_list_price_lvl" key={cardsByPriceObj.price}>
            <p className="minifastshop_list_price_lvl_info">
              <span>面值：{cardsByPriceObj.price}</span>
              {getData.getCombineRuleByCardId(cardsByPriceObj.cards[0].id) && (
                <span>
                  合成时间：
                  {utils.getTimeFormat(
                    parseInt(
                      getData.getCombineRuleByCardId(cardsByPriceObj.cards[0].id).time,
                      10,
                    ),
                  )}
                </span>
              )}
            </p>
            <ul className="minifastshop_list_price_lvl_list">
              {cardsByPriceObj.cards.map((cardData) => getListCardJSX(cardData))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
