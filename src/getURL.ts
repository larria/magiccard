const BaseURL = '/assets'
const fix = '.png'

function getCardSmall(cardId: string | number): string {
  return `${BaseURL}/card/img/card/${cardId}_56${fix}`
}

function getCard(cardId: string | number): string {
  return `${BaseURL}/card/img/card/${cardId}${fix}`
}

function getThemeBigLogo(themeId: string | number): string {
  return `${BaseURL}/card/img/theme/${themeId}_big_logo${fix}`
}

function getThemeLogo(themeId: string | number): string {
  return `${BaseURL}/card/img/theme/${themeId}_logo${fix}`
}

function getThemeBackGround(themeId: string | number): string {
  return `${BaseURL}/card/img/theme/${themeId}${fix}`
}

function getThemeMuseum(themeId: string | number): string {
  return `${BaseURL}/card/img/theme/${themeId}_museum${fix}`
}

export default {
  getCard,
  getCardSmall,
  getThemeBigLogo,
  getThemeLogo,
  getThemeBackGround,
  getThemeMuseum,
}
