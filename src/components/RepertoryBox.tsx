import { useState, type ReactNode } from 'react'
import { Tabs, Button, Tooltip, Modal, App } from 'antd'
import {
  SearchOutlined,
  MoneyCollectOutlined,
  LoginOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import Card from './Card'
import BagCtrl from './BagCtrl'
import BagList from './BagList'
import ChestList from './ChestList'
import MiniFastShop from './MiniFastShop'
import getData from '../data/getData'
import { useGameStore } from '../store/useGameStore'
import './RepertoryBox.css'

interface RepertoryBoxProps {
  handleClickClose?: () => void
}

export default function RepertoryBox({
  handleClickClose = () => {},
}: RepertoryBoxProps) {
  const { modal } = App.useApp()
  const confirm = modal.confirm
  const bagList = useGameStore((s) => s.bagList)
  const chestList = useGameStore((s) => s.chestList)
  const repStat = useGameStore((s) => s.repStat)
  const addGold = useGameStore((s) => s.addGold)
  const removeCardFromBag = useGameStore((s) => s.removeCardFromBag)
  const addCardToChest = useGameStore((s) => s.addCardToChest)
  const removeCardFromChest = useGameStore((s) => s.removeCardFromChest)
  const addCardToBag = useGameStore((s) => s.addCardToBag)

  const [miniFastShopModelVisible, setMiniFastShopModelVisible] = useState(false)
  const [miniFastShopThemeId, setMiniFastShopThemeId] = useState<string | null>(
    null,
  )

  function addBagHoverBtns(bagCardIndex: number): ReactNode {
    return (
      <ul className="repertory_baglist_btn_w">
        <li>
          <Tooltip title="卖出">
            <Button
              type="primary"
              shape="circle"
              icon={<MoneyCollectOutlined rotate={180} />}
              onClick={() => toSellACardFromBag(bagCardIndex)}
            />
          </Tooltip>
        </li>
        <li>
          <Tooltip title="查看主题">
            <Button
              type="primary"
              shape="circle"
              icon={<SearchOutlined />}
              onClick={() => toShowThemeInShop(bagCardIndex, 'bag')}
            />
          </Tooltip>
        </li>
        <li>
          <Tooltip title="移入保险箱">
            <Button
              type="primary"
              shape="circle"
              icon={<LoginOutlined />}
              onClick={() => toMoveACardFromBagToChest(bagCardIndex)}
            />
          </Tooltip>
        </li>
      </ul>
    )
  }

  function addChestHoverBtns(chestCardIndex: number): ReactNode {
    return (
      <ul className="repertory_baglist_btn_w">
        <li>
          <Tooltip title="查看主题">
            <Button
              type="primary"
              shape="circle"
              icon={<SearchOutlined />}
              onClick={() => toShowThemeInShop(chestCardIndex, 'chest')}
            />
          </Tooltip>
        </li>
        <li>
          <Tooltip title="移入换卡箱">
            <Button
              type="primary"
              shape="circle"
              icon={<LogoutOutlined />}
              onClick={() => toMoveACardFromChestToBag(chestCardIndex)}
            />
          </Tooltip>
        </li>
      </ul>
    )
  }

  function toShowThemeInShop(bagCardIndex: number, from: 'bag' | 'chest') {
    const cardList = from === 'bag' ? bagList : chestList
    const cardId = cardList[bagCardIndex]
    const cardInfo = getData.getCardById(cardId)
    const themeId = getData.getThemeById(cardInfo.theme_id).id
    setMiniFastShopThemeId(themeId)
    setMiniFastShopModelVisible(true)
  }

  function toSellACardFromBag(bagCardIndex: number) {
    const cardId = bagList[bagCardIndex]
    const cardInfo = getData.getCardById(cardId)
    const themeInfo = getData.getThemeById(cardInfo.theme_id)
    if (cardInfo.price === '10' && themeInfo.type === '0') {
      sellACardFromBag(bagCardIndex, cardInfo)
    } else {
      confirm({
        title: '确认要卖出？',
        icon: <ExclamationCircleOutlined />,
        content: (
          <Card showPrice showNameInBigCard id={bagList[bagCardIndex]} />
        ),
        onOk() {
          sellACardFromBag(bagCardIndex, cardInfo)
        },
        onCancel() {
          console.log('已取消')
        },
        okText: '确认',
        cancelText: '取消',
      })
    }
  }

  function sellACardFromBag(bagCardIndex: number, toSellCardInfo: { price: string }) {
    addGold(Number(toSellCardInfo.price))
    removeCardFromBag(bagCardIndex)
  }

  function toMoveACardFromBagToChest(bagCardIndex: number) {
    if (chestList.length < repStat.chestSlotNum) {
      const cardId = bagList[bagCardIndex]
      const cardInfo = getData.getCardById(cardId)
      removeCardFromBag(bagCardIndex)
      addCardToChest(cardInfo.id)
    } else {
      modal.info({ title: '保险箱已满', content: null, onOk() {} })
    }
  }

  function toMoveACardFromChestToBag(chestCardIndex: number) {
    if (bagList.length < repStat.bagSlotNum) {
      const cardId = chestList[chestCardIndex]
      const cardInfo = getData.getCardById(cardId)
      removeCardFromChest(chestCardIndex)
      addCardToBag(cardInfo.id)
    } else {
      modal.info({ title: '换卡箱已满', content: null, onOk() {} })
    }
  }

  const items = [
    {
      key: 'bag',
      label: (
        <>
          <span className="repertory_box_title">换卡箱</span>{' '}
          {bagList.length}/{repStat.bagSlotNum}
        </>
      ),
      children: (
        <>
          <div className="repertory_bag_ctrl">
            <BagCtrl />
          </div>
          <div className="repertory_bag_w">
            <BagList onHoverRet={addBagHoverBtns} />
          </div>
        </>
      ),
    },
    {
      key: 'chest',
      label: (
        <>
          <span className="repertory_box_title">保险箱</span>{' '}
          {chestList.length}/{repStat.chestSlotNum}
        </>
      ),
      children: (
        <>
          <div className="repertory_chest_ctrl">
            <span className="repertory_chest_info">
              这里是安全区，其他玩家无法换走您存放在此处的卡片
            </span>
          </div>
          <div className="repertory_chest_w">
            <ChestList onHoverRet={addChestHoverBtns} />
          </div>
        </>
      ),
    },
  ]

  return (
    <>
      <div className="repertory_box_w">
        <span className="repertory_box_close_btn" onClick={handleClickClose}>
          关闭
        </span>
        <Tabs
          defaultActiveKey="bag"
          items={items}
          tabBarStyle={{ marginLeft: '20px', marginBottom: '0' }}
        />
      </div>
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
        <MiniFastShop defaultThemeId={miniFastShopThemeId ?? undefined} />
      </Modal>
    </>
  )
}
