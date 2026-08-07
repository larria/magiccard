import { useState, useEffect } from 'react'
import type { MouseEvent, CSSProperties, ChangeEvent } from 'react'
import { Input, Divider, Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router'
import { avatarsURLList } from '../config'
import { useGameStore } from '../store/useGameStore'
import './PageRegister.css'

interface PageRegisterProps {
  checkRegistered?: boolean
}

export default function PageRegister({ checkRegistered = true }: PageRegisterProps) {
  const userName = useGameStore((s) => s.userName)
  const avatar = useGameStore((s) => s.avatar)
  const setUserName = useGameStore((s) => s.setUserName)
  const setAvatar = useGameStore((s) => s.setAvatar)
  const navigate = useNavigate()

  // 如果已有个人信息，则前往主页
  useEffect(() => {
    if (checkRegistered) {
      if (typeof userName === 'string' && typeof avatar === 'string') {
        navigate('/home', { replace: true })
      }
    }
  }, [checkRegistered, userName, avatar, navigate])

  const [tempUserName, settempUserName] = useState('')
  const [tempAvatar, settempAvatar] = useState<string | null>(null)
  const [ableToSubmit, setAbleToSubmit] = useState(true)

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const str = e.target.value.trim()
    settempUserName(str)
    if (str.length > 0) {
      if (tempAvatar) {
        setAbleToSubmit(false)
      }
    } else {
      setAbleToSubmit(true)
    }
  }

  function handleAvatarSelect(e: MouseEvent<HTMLImageElement>) {
    const url = (e.currentTarget as HTMLImageElement).src
    settempAvatar(url)
    if (tempUserName.length) {
      setAbleToSubmit(false)
    }
  }

  function handleSubmit() {
    if (tempUserName.length && tempAvatar && tempAvatar.length) {
      setUserName(tempUserName)
      setAvatar(tempAvatar)
    } else {
      console.log('个人信息尚未完善')
    }
  }

  const avatarStyle = (url: string): CSSProperties => {
    if (tempAvatar === url) return { boxShadow: '0 0 5px #1088e9' }
    if (tempAvatar) return { opacity: '0.5' }
    return {}
  }

  return (
    <div className="register_w">
      <img
        className="register_welcome_img"
        src={`${import.meta.env.BASE_URL}assets/style/imgs/moka_girl.png`}
        alt=""
      />
      <div className="register_form">
        <h3>您的昵称</h3>
        <div>
          <Input
            placeholder="请输入昵称"
            autoFocus
            size="large"
            maxLength={8}
            prefix={<UserOutlined />}
            onChange={handleInputChange}
          />
        </div>
        <Divider />
        <h3>请选择头像</h3>
        <div className="register_avatar_w">
          {avatarsURLList.map((url, i) => (
            <img
              className="register_avatar"
              key={i}
              src={url}
              alt=""
              onClick={handleAvatarSelect}
              style={avatarStyle(url)}
            />
          ))}
        </div>
        <Divider />
        <Button
          className="register_submit_btn"
          type="primary"
          disabled={ableToSubmit}
          onClick={handleSubmit}
        >
          确定
        </Button>
      </div>
    </div>
  )
}
