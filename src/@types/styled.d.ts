import 'styled-components'
import textStyles from 'figma/textStyles'
import colorPalette from 'figma/colorPalette'
import zIndexes from '../components/layout/ZIndexes'

interface IPalette {
  main: string
  contrastText: string
}
declare module 'styled-components' {
  const theme = { ...textStyles, ...colorPalette, zIndexes }
  type ThemeType = typeof theme
  // eslint-disable-next-line
  export interface DefaultTheme extends ThemeType {}
}
