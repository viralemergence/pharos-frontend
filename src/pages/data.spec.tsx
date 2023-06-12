import React from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import textStyles from '../figma/textStyles'
import colorPalette from '../figma/colorPalette'
import zIndexes from '../components/layout/ZIndexes'

import DataPage from './data'

describe('DataPage', () => {
  it('renders', () => {
    render(
      <ThemeProvider theme={{ ...textStyles, ...colorPalette, zIndexes }}>
        <DataPage />
      </ThemeProvider>
    )
  })
})
