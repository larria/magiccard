# 开发规范

## 命令

```bash
npm install        # 安装依赖
npm run dev        # 开发服务器（http://localhost:5173/）
npm run build      # 类型检查 + 生产构建
npm run typecheck  # 仅类型检查
npm run preview    # 预览构建（注意：不支持子路径，见 PWA_DEPLOY.md）
npm run deploy     # 构建并部署到 GitHub Pages
```

## TypeScript

- **strict 模式**：`tsconfig.json` 开启 `strict`、`noUnusedLocals`、`noUnusedParameters`
- **全量 TS**：所有源码为 `.ts` / `.tsx`，不允许新增 `.js`
- **类型优先**：避免 `any`，必要的类型断言用 `as unknown as T`（如 JSON 导入）
- **非空断言 `!`** 谨慎使用，仅用于确实不可能为 null 的场景（如路由参数 `useParams()` 的返回值）

### 常用类型导入

```ts
import type { ThemeAttr, CardAttr, CombAttr } from '../types/card'
import type { CollectResult, StoveSlot, BookStat } from '../store/types'
```

`import type` 在 `verbatimModuleSyntax` 下是必需的。

## 组件规范

### 函数组件 + Hooks

全部使用函数组件，不使用 class 组件。

```tsx
export default function MyComponent({ prop1, prop2 }: MyComponentProps) {
  const state = useGameStore((s) => s.xxx)
  // ...
  return <div>...</div>
}
```

### Props 类型

为每个组件定义 Props 接口，可选属性带默认值：

```tsx
interface CardProps {
  id?: string
  isSmall?: boolean
  highlightType?: 'highlight1' | 'highlight2' | 'fade' | false
  onCardClick?: () => void
}

export default function Card({
  id = '3660',
  isSmall = false,
  highlightType = false,
  onCardClick = () => {},
}: CardProps) { /* ... */ }
```

### 事件处理

用 antd / React 标准事件类型，不要用结构化字面量：

```tsx
// ✅ 正确
function handleChange(e: ChangeEvent<HTMLInputElement>) { /* ... */ }
function handleRadioChange(e: RadioChangeEvent) { /* ... */ }

// ❌ 错误（类型不兼容）
function handleChange(e: { target: { value: string } }) { /* ... */ }
```

## 状态管理规范

### selector 单字段订阅

```tsx
// ✅ 推荐：单字段 selector
const userName = useGameStore((s) => s.userName)
const gold = useGameStore((s) => s.gold)

// ❌ 禁止：返回新对象（每次渲染都触发重渲染）
const { userName, gold } = useGameStore((s) => ({ userName: s.userName, gold: s.gold }))
```

### 业务逻辑放 dpa

涉及「读 state + 判定 + 多次写 state」的逻辑放 `dispatchActionWithBusiness.ts`，组件只调 `dpa.xxx()`：

```tsx
// ✅ 业务逻辑在 dpa
dpa.updateStoveList(newList)

// ❌ 组件内直接编排多步状态
const stoveList = useGameStore(s => s.stoveList)
const updateStoveList = useGameStore(s => s.updateStoveSlotsList)
// 组件内做复杂判定 + 多次调用 update
```

### 持久化字段

新增状态字段时，记得在 `useGameStore.ts` 的 `partialize` 中加入，否则不会持久化。

## antd 5 规范

### 命令式弹窗用 App.useApp()

```tsx
import { App } from 'antd'

function MyComponent() {
  const { modal, message } = App.useApp()
  // modal.confirm / modal.info / modal.success
  // message.info / message.success
}
```

入口 `main.tsx` 已用 `<AntdApp>` 包裹。**不要用 `Modal.confirm` 静态方法**——React 19 下会静默失效。

### Menu / Tabs 用 items

不用 `Menu.Item` / `TabPane` 子元素，用 `items` prop。

## React 19 + StrictMode

开发模式下 `useEffect` 执行两次。涉及弹窗、定时器的副作用需 ref 守卫：

```tsx
const shown = useRef(false)
useEffect(() => {
  if (shown.current) return
  shown.current = true
  // 弹窗 / 注册定时器
}, [])
```

## 图片资源

### 路径拼接

JS 中引用 `public/assets` 下的图片，必须用 `import.meta.env.BASE_URL` 拼接（适配 GitHub Pages 子路径）：

```ts
const url = `${import.meta.env.BASE_URL}assets/...`
```

CSS 背景图直接写 `/assets/...`，Vite 构建时会自动加 base 前缀。

### 资源放置

- `src/assets/`：走构建管线的资源（如 `logo.png`，通过 `import` 引入，有 hash 缓存）
- `public/assets/`：原样拷贝的静态资源（卡牌图、主题图、UI 精灵图、头像）
- `public/` 根：PWA 图标、favicon

## 提交规范

提交信息格式：

```
<type>: <简要描述>

<可选的详细说明>

Co-Authored-By: Claude <noreply@anthropic.com>
```

`type` 用 `feat` / `fix` / `chore` / `docs` / `refactor` 等。

## 常见坑

1. **`vite preview` 不支持子路径**：预览生产构建用 `npx serve dist` 或 python http.server（配合子路径软链），见 PWA_DEPLOY.md
2. **`Modal.confirm` 静态方法失效**：React 19 + antd 5 下不工作，必须用 `App.useApp()` 的 `modal`
3. **StrictMode 双调用**：副作用用 ref 守卫
4. **图片 404（GitHub Pages）**：JS 里图片路径必须用 `import.meta.env.BASE_URL` 拼接
5. **路由根路径空白**：`/` 必须有 `index` 路由重定向到 `/home`
