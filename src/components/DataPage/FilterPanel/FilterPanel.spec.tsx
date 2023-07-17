import React from 'react'
import FilterPanel from './FilterPanel'
import {  render, } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import textStyles from '../../../figma/textStyles'
import colorPalette from '../../../figma/colorPalette'
import zIndexes from '../../../components/layout/ZIndexes'
import breakpoints from '../../../components/layout/Breakpoints'

const Provider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider
    theme={{ ...textStyles, ...colorPalette, zIndexes, breakpoints }}
  >
    {children}
  </ThemeProvider>
)

describe('FilterPanel', () => {
  it('renders', () => {
    render(
      <Provider>
        <FilterPanel
          isFilterPanelOpen={true}
        />
      </Provider>
    )
  })
})

