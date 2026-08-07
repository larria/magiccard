import getURL from '../getURL'
import './ThemeLogo.css'

interface ThemeLogoProps {
  theme_id?: string
  isBigLogo?: boolean
  showName?: string | false
  onThemeLogoClick?: (themeId: string) => void
}

export default function ThemeLogo({
  theme_id = '248',
  isBigLogo = false,
  showName = false,
  onThemeLogoClick = () => {},
}: ThemeLogoProps) {
  if (!isBigLogo) {
    return (
      <div
        className="theme_logo_w"
        onClick={() => onThemeLogoClick(theme_id)}
      >
        <img
          className="theme_logo"
          src={getURL.getThemeLogo(theme_id)}
          alt=""
        />
        {showName && <span className="theme_logo_name">{showName}</span>}
      </div>
    )
  }
  return (
    <div
      className="theme_logo_big_w"
      onClick={() => onThemeLogoClick(theme_id)}
    >
      <img
        className="theme_logo_big"
        src={getURL.getThemeBigLogo(theme_id)}
        alt=""
      />
      {showName && <span className="theme_logo_name">{showName}</span>}
    </div>
  )
}
