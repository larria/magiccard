# 路由

项目使用 [React Router](https://reactrouter.com/) 7，采用 **HashRouter** 模式（兼容 GitHub Pages 子路径，无需服务端 fallback）。

## 路由定义

路由集中在 `src/App.tsx`，采用嵌套 `<Route>` + `<Outlet>` 结构。

### 路由表

| 路径 | 组件 | 说明 |
|---|---|---|
| `/register` | `PageRegister` | 注册页（无需登录） |
| `/` | 重定向到 `/home` | 根路径 |
| `/home` | `HomeLayout` → `User` + `PanelHome` | 卡片合成（炼卡炉 + 换卡箱） |
| `/home/book` | `HomeLayout` → `User` + `PanelBook` | 集卡册 |
| `/home/alter` | `HomeLayout` → `User` + `PanelAlter` | 变卡 |
| `/home/user` | `PageRegister`（checkRegistered=false） | 修改个人信息 |
| `/museum` | `PannelMuseum` | 博物馆（全部主题浏览） |
| `/settings` | `PanelSettings` | 设置（含调试功能） |
| `/theme_card/:theme_id` | `ThemeCards` | 主题卡牌详情 |
| `*` | 重定向到 `/home` | 兜底 |

### 布局结构

```
MainLayout（Sider + Layout.site-layout）
├── /home → HomeLayout（顶部子菜单 Header + Content）
│   └── Outlet → User + PanelHome/PanelBook/PanelAlter
├── museum / settings / theme_card → ContentWrap（Content 带 padding）
│   └── Outlet → 对应组件
```

- `MainLayout`：提供侧边栏（Sider）+ 主内容区，通过 `<Outlet />` 渲染子路由
- `HomeLayout`：`/home` 下的二级布局，渲染顶部子菜单 `<Header>` + `<Content>`，Header 紧贴 Sider 右侧
- `ContentWrap`：无顶部子菜单的路由（博物馆/设置/主题详情）的内容包裹，提供 padding

## 编程式导航

用 `useNavigate` hook 替代了 v5 的 `createHashHistory`：

```tsx
import { useNavigate } from 'react-router'

const navigate = useNavigate()
navigate('/home', { replace: true })   // 替换历史
navigate(`/theme_card/${themeId}`)      // 普通跳转
```

### 使用位置

- `App.tsx`：未注册用户跳转 `/register`
- `PageRegister.tsx`：注册成功跳转 `/home`
- `ThemeList.tsx`、`PanelSearch.tsx`：点击主题跳转 `/theme_card/:id`

## 路由参数

用 `useParams` 读取动态路由参数：

```tsx
// App.tsx
<Route path="theme_card/:theme_id" element={<ThemeCardsRoute />} />

// ThemeCardsRoute
function ThemeCardsRoute() {
  const { theme_id } = useParams()
  return <ThemeCards theme_id={theme_id!} />
}
```

## 当前路径

用 `useLocation` 读取当前路径，用于菜单选中状态：

```tsx
const location = useLocation()
const selectedKeys = location.pathname.includes('/home')
  ? ['/home']
  : [location.pathname]
```

## 与 v5 的主要差异

| 项目 | v5（原） | v7（现） |
|---|---|---|
| 包名 | `react-router-dom` | `react-router` |
| 路由匹配 | `<Switch>` | `<Routes>` / 嵌套 `<Route>` |
| 子路由渲染 | `<Route component>` | `<Outlet />` |
| 重定向 | `<Redirect to>` | `<Navigate to replace />` |
| 编程式导航 | `createHashHistory().push` | `useNavigate()` |
| 路由参数 | `match.params` | `useParams()` |
| 当前路径 | `history.location` | `useLocation()` |

## 注意事项

### 渲染期不要导航

v7 严格模式下，在渲染期间调用 `navigate` 会警告。导航副作用应放在 `useEffect`：

```tsx
// ❌ 错误：渲染期间导航
function App() {
  if (userName === null) navigate('/register')
}

// ✅ 正确：useEffect 中导航
function App() {
  useEffect(() => {
    if (userName === null && !pathname.includes('/museum')) {
      navigate('/register', { replace: true })
    }
  }, [userName, pathname, navigate])
}
```

### 根路径重定向

根路径 `/` 必须有 `index` 路由重定向到 `/home`，否则内容区为空（只剩 Sider 骨架）：

```tsx
<Route path="/" element={<MainLayout />}>
  <Route index element={<Navigate to="/home" replace />} />
  {/* ... */}
</Route>
```
