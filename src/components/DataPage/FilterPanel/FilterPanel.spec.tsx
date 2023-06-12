import React from 'react'
import FilterPanel from './FilterPanel'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import textStyles from '../../../figma/textStyles'
import colorPalette from '../../../figma/colorPalette'
import zIndexes from '../../../components/layout/ZIndexes'

describe('FilterPanel', () => {
  it('renders', () => {
    render(
      <ThemeProvider theme={{ ...textStyles, ...colorPalette, zIndexes }}>
        <FilterPanel
          isFilterPanelOpen={true}
          setIsFilterPanelOpen={jest.fn()}
          fields={{}}
          filters={[]}
          setFilters={jest.fn()}
          clearFilters={jest.fn()}
          updateFilter={jest.fn()}
        />
      </ThemeProvider>
    )
  })
})
