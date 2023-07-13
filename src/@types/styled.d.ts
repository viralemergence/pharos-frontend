import 'styled-components'
import textStyles from 'figma/textStyles'
import colorPalette from 'figma/colorPalette'
import zIndexes from '../components/layout/ZIndexes'
import breakpoints from '../components/layout/Breakpoints'

interface IPalette {
  main: string
  contrastText: string
}
declare module 'styled-components' {
  const theme = { ...textStyles, ...colorPalette, zIndexes, breakpoints }
  type ThemeType = typeof theme
  // eslint-disable-next-line
  export interface DefaultTheme extends ThemeType {}
}
