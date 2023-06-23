import 'styled-components'
import textStyles from 'figma/textStyles'
import colorPalette from 'figma/colorPalette'

interface IPalette {
  main: string
  contrastText: string
}
declare module 'styled-components' {
  const theme = { ...textStyles, ...colorPalette }
  type ThemeType = typeof theme
  // eslint-disable-next-line
  export interface DefaultTheme extends ThemeType {}
}
