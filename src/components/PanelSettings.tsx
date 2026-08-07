import { useState, useEffect, useRef } from 'react'
import { App } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import * as dpa from '../store/dispatchActionWithBusiness'
import { useGameStore } from '../store/useGameStore'
import './PanelSettings.css'

export default function PanelSettings() {
  const { modal } = App.useApp()
  const setUserName = useGameStore((s) => s.setUserName)
  const addExp = useGameStore((s) => s.addExp)
  const setExp = useGameStore((s) => s.setExp)

  const [showDebug, setShowDebug] = useState(false)
  const [friendsNum, setFriendsNum] = useState(5)
  // StrictMode 开发模式下 useEffect 会执行两次，用 ref 守卫避免重复弹窗
  const confirmShown = useRef(false)

  function resetLocal() {
    localStorage.clear()
    window.location.reload()
  }

  useEffect(() => {
    if (confirmShown.current) return
    confirmShown.current = true
    modal.confirm({
      title: '设置内容目前包含部分调试功能，无节制使用会减少游戏乐趣，确认要使用设置功能？',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        setShowDebug(true)
      },
      onCancel() {},
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {showDebug && (
        <div className="settings_w">
          <p>修改个人昵称与头像</p>
          <button onClick={() => setFriendsNum(friendsNum + 1)}>
            设置好友数量: {friendsNum}
          </button>
          <p>下载个人数据</p>
          <button onClick={() => addExp(100)}>增加经验值</button>
          <button onClick={() => setExp(3251)}>升级到lv. 5</button>
          <button onClick={() => setExp(10001)}>升级到lv. 10</button>
          <button
            onClick={() =>
              setUserName('Larria' + Date.now().toString().slice(9))
            }
          >
            点击改名
          </button>
          <button onClick={() => dpa.updateBagListWithATheme()}>
            换卡箱变成一套
          </button>
          <button onClick={() => dpa.addAThemeToBook()}>集齐册放一套卡</button>
          <button onClick={() => dpa.addACardToStove(Date.now(), '38')}>
            开始炼一张卡
          </button>
          <button
            onClick={() =>
              dpa.addACardToStove(Date.now() - 1000 * 3600 * 24 * 365, '38')
            }
          >
            炼一张卡并立即完成
          </button>
          <button
            onClick={() => dpa.addACardToStove(Date.now() - 1000 * 3500, '41')}
          >
            炼一张卡并即将完成
          </button>
          <button onClick={() => dpa.updateStoveList([])}>清除炼卡槽</button>
          <button onClick={resetLocal}>清空数据</button>
        </div>
      )}
    </>
  )
}
