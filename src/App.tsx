import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Layout, Menu } from 'antd'
import {
  DesktopOutlined,
  FileOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import {
  Routes,
  Route,
  Link,
  Outlet,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router'
import { useGameStore } from './store/useGameStore'
import logoUrl from './assets/logo.png'

import PannelMuseum from './components/PannelMuseum'
import ThemeCards from './components/ThemeCards'
import PageRegister from './components/PageRegister'
import PanelHome from './components/PanelHome'
import PanelBook from './components/PanelBook'
import PanelSettings from './components/PanelSettings'
import PanelAlter from './components/PanelAlter'
import User from './components/User'

const { Header, Content, Sider } = Layout

// 侧边栏菜单项（items 写法，antd5 推荐）
const siderItems = [
  { key: '/home', icon: <DesktopOutlined />, label: <Link to="/home">我的</Link> },
  { key: '/museum', icon: <FileOutlined />, label: <Link to="/museum">博物馆</Link> },
  { key: '/settings', icon: <SettingOutlined />, label: <Link to="/settings">设置</Link> },
]

// /home 顶部子菜单项
const homeNavItems = [
  { key: '/home/book', label: <Link to="/home/book">集卡册</Link> },
  { key: '/home', label: <Link to="/home">卡片合成</Link> },
  { key: '/home/alter', label: <Link to="/home/alter">变卡</Link> },
]

// /home 下的二级布局：顶部子菜单 + 内容区
function HomeLayout() {
  const location = useLocation()
  return (
    <>
      <Header className="site-layout-background" style={{ padding: 0 }}>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={homeNavItems}
        />
      </Header>
      <Content style={{ margin: '0 16px', padding: '24px 8px', minHeight: 'calc(100vh - 64px)' }}>
        <Outlet />
      </Content>
    </>
  )
}

// 非 /home 路由的内容包裹（无顶部子菜单）
function ContentWrap() {
  return (
    <Content style={{ margin: '0 16px', padding: '24px 8px', minHeight: 'calc(100vh - 64px)' }}>
      <Outlet />
    </Content>
  )
}

// 主布局：侧边栏 + 内容区（通过 Outlet 渲染匹配的子路由）
function MainLayout() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(true)
  const selectedKeys = location.pathname.includes('/home')
    ? ['/home']
    : [location.pathname]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo_main">
          <img src={logoUrl} alt="" />
        </div>
        <Menu
          theme="dark"
          selectedKeys={selectedKeys}
          mode="inline"
          items={siderItems}
        />
      </Sider>
      <Layout className="site-layout">
        <Outlet />
      </Layout>
    </Layout>
  )
}

// 主题卡牌详情路由参数解析
function ThemeCardsRoute() {
  const { theme_id } = useParams()
  return <ThemeCards theme_id={theme_id!} />
}

function UserAnd({ children }: { children: ReactNode }) {
  return (
    <>
      <User />
      {children}
    </>
  )
}

export default function App() {
  const userName = useGameStore((s) => s.userName)
  const avatar = useGameStore((s) => s.avatar)
  const navigate = useNavigate()
  const location = useLocation()

  // 如果没有用户信息，先前往注册（museum 可无需用户信息访问）
  useEffect(() => {
    if (userName === null || avatar === null) {
      if (!location.pathname.includes('/museum')) {
        navigate('/register', { replace: true })
      }
    }
  }, [userName, avatar, location.pathname, navigate])

  return (
    <Routes>
      <Route path="/register" element={<PageRegister />} />
      <Route path="/" element={<MainLayout />}>
        {/* 根路径重定向到 /home */}
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<HomeLayout />}>
          <Route index element={<UserAnd><PanelHome /></UserAnd>} />
          <Route path="book" element={<UserAnd><PanelBook /></UserAnd>} />
          <Route path="alter" element={<UserAnd><PanelAlter /></UserAnd>} />
          <Route path="user" element={<PageRegister checkRegistered={false} />} />
        </Route>
        <Route element={<ContentWrap />}>
          <Route path="museum" element={<PannelMuseum />} />
          <Route path="settings" element={<PanelSettings />} />
          <Route path="theme_card/:theme_id" element={<ThemeCardsRoute />} />
        </Route>
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  )
}
