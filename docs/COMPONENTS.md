# UI 组件

全部组件位于 `src/components/`，均为函数组件 + Hooks，通过 `useGameStore` 订阅状态、`dpa` 门面触发业务 action。UI 库为 Ant Design 5。

## 组件清单

### 页面级组件

| 组件 | 文件 | 路由 | 职责 |
|---|---|---|---|
| `PageRegister` | PageRegister.tsx | `/register`, `/home/user` | 注册昵称 + 头像，或修改个人信息 |
| `PannelMuseum` | PannelMuseum.tsx | `/museum` | 博物馆：浏览全部主题，支持搜索/切换视图 |
| `PanelHome` | PanelHome.tsx | `/home` | 首页：炼卡炉 + 换卡箱入口 |
| `PanelBook` | PanelBook.tsx | `/home/book` | 集卡册：已收集/待收集主题 |
| `PanelAlter` | PanelAlter.tsx | `/home/alter` | 变卡：消耗卡 + 目标卡，消耗魔力变换 |
| `PanelSettings` | PanelSettings.tsx | `/settings` | 设置（含调试功能） |
| `ThemeCards` | ThemeCards.tsx | `/theme_card/:id` | 主题卡牌详情：展示该主题全部卡片与合成关系 |

> 注：`PannelMuseum` 文件名是历史遗留的双 n 拼写，保持不变以匹配 import。

### 业务组件

| 组件 | 文件 | 职责 |
|---|---|---|
| `User` | User.tsx | 顶部用户信息条：昵称、等级、金币、魔力；检测升级发放奖励 |
| `Stove` | Stove.tsx | 炼卡炉入口（可折叠） |
| `StoveList` | StoveList.tsx | 炼卡炉卡槽列表：显示炼制状态、取卡、合成检查 |
| `StoveSlotWithCard` | StoveSlotWithCard.tsx | 有卡的炉位：环形进度条 + 倒计时 |
| `StoveSlot` | StoveSlot.tsx | 空炉位 / 锁定炉位 |
| `Repertory` | Repertory.tsx | 换卡箱入口（可折叠） |
| `RepertoryBox` | RepertoryBox.tsx | 换卡箱/保险箱容器：Tab 切换、卡片操作（卖出/移动/查看主题） |
| `BagList` | BagList.tsx | 换卡箱卡片网格 |
| `ChestList` | ChestList.tsx | 保险箱卡片网格 |
| `BagCtrl` | BagCtrl.tsx | 换卡箱控制条：抽卡、一键抽卡、一键卖普卡 |
| `MiniFastShop` | MiniFastShop.tsx | 炼卡攻略弹窗：推荐主题 + 搜索 + 卡片列表 |
| `MiniFastShopList` | MiniFastShopList.tsx | 卡片列表（购买素材卡 / 合成卡片） |
| `PanelSearch` | PanelSearch.tsx | 主题搜索：按名称/星级/类型筛选 |
| `ThemeList` | ThemeList.tsx | 主题列表（按难度分组，两种视图） |

### 通用组件

| 组件 | 文件 | 职责 |
|---|---|---|
| `Card` | Card.tsx | 卡牌展示（大/小图、显示面值/名称/高亮） |
| `DiffStar` | DiffStar.tsx | 难度星级 |
| `ThemeLogo` | ThemeLogo.tsx | 主题 logo（小/大） |
| `ThemePreview` | ThemePreview.tsx | 主题预览图（博物馆大图） |
| `MiniRepertory` | MiniRepertory.tsx | 迷你卡片列表（变卡选消耗卡用） |

## antd 5 适配要点

项目从 antd 4 迁移到 antd 5，关键变化：

### Menu 用 items 而非 children

```tsx
// ❌ antd 4（已弃用，会警告）
<Menu>
  <Menu.Item key="/home" icon={<Icon />}>我的</Menu.Item>
</Menu>

// ✅ antd 5
<Menu items={[
  { key: '/home', icon: <Icon />, label: <Link to="/home">我的</Link> },
]} />
```

### Tabs 用 items 而非 TabPane

```tsx
// ❌ antd 4
<Tabs>
  <TabPane tab="换卡箱" key="bag">...</TabPane>
</Tabs>

// ✅ antd 5
<Tabs items={[
  { key: 'bag', label: '换卡箱', children: <... /> },
]} />
```

### Modal 用 open 而非 visible

```tsx
// ❌ antd 4
<Modal visible={visible} />

// ✅ antd 5
<Modal open={open} />
```

### 命令式弹窗用 App.useApp()

**重要**：antd 5 的 `Modal.confirm/info/success` 静态方法在 React 19 + `<App>` 包裹下会静默失效（不弹窗、不报错）。必须改用 `App.useApp()` 的实例：

```tsx
// ❌ 静态方法（React 19 下不工作）
import { Modal } from 'antd'
Modal.confirm({ title: '确认？' })

// ✅ App.useApp() 实例
import { App } from 'antd'
const { modal } = App.useApp()
modal.confirm({ title: '确认？' })
```

入口 `main.tsx` 已用 `<AntdApp>` 包裹应用，组件内 `App.useApp()` 即可获取 `modal`/`message`。

### Progress circle 用 size 而非 width

```tsx
// ❌ antd 4
<Progress type="circle" width={80} />

// ✅ antd 5
<Progress type="circle" size={80} />
```

### FloatButton.BackTop 替代 BackTop

```tsx
// ❌ antd 4（已移除）
import { BackTop } from 'antd'
<BackTop>...</BackTop>

// ✅ antd 5
import { FloatButton } from 'antd'
<FloatButton.BackTop>...</FloatButton.BackTop>
```

## 环形进度条深色背景适配

炉位卡片在半透明黑色遮罩上，默认的进度条（黑色文字、近黑轨道）不可见。通过 props 强制配色：

```tsx
<Progress
  type="circle"
  size={80}
  strokeColor="#108ee9"                      // 进度路径蓝色
  trailColor="rgba(255, 255, 255, 0.25)"     // 轨道半透明白
  percent={restPercent}
  format={(p) => (                            // 自定义白色文字
    <span style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>{p}%</span>
  )}
/>
```

## StrictMode 与副作用

React 19 的 `<StrictMode>` 在开发模式下 `useEffect` 执行两次。涉及弹窗/定时器的副作用需 ref 守卫：

- 弹窗：`PanelSettings.tsx`（confirm 只弹一次）
- 升级检测：`User.tsx`（`lastHandledLevel` ref 避免重复发放奖励）
- 定时器：`StoveSlotWithCard.tsx`（倒计时）、`BagCtrl.tsx`（抽卡次数恢复）
