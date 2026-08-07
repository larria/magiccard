import getURL from '../getURL'
import './ThemePreview.css'

interface ThemePreviewProps {
  theme_id?: string
  showName?: string | false
  onCardThemeClick?: (themeId: string) => void
}

export default function ThemePreview({
  theme_id = '248',
  showName = false,
  onCardThemeClick = () => {},
}: ThemePreviewProps) {
  return (
    <div className="theme_preview_w">
      <img
        className="theme_preview"
        src={getURL.getThemeMuseum(theme_id)}
        onClick={() => onCardThemeClick(theme_id)}
        alt=""
      />
      {showName && <span className="theme_preview_name">{showName}</span>}
    </div>
  )
}

// 兼容原 ThemePreview 调用方传入的 style（部分调用未传，这里保持简单）
export type { ThemePreviewProps }
