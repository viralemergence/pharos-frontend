import React from 'react'
import FilterPanel from './FilterPanel'
import { screen, render } from '@testing-library/react'
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
    screen.debug()
  })

  it('renders with fields', () => {
    render(
      <ThemeProvider theme={{ ...textStyles, ...colorPalette, zIndexes }}>
        <FilterPanel
          isFilterPanelOpen={true}
          setIsFilterPanelOpen={jest.fn()}
          fields={{
            field1: {
              label: 'Field 1',
              type: 'text',
              options: ['field 1, option 1', 'field 1, option 2'],
            },
            field2: {
              label: 'Field 2',
              type: 'text',
              options: ['field 2, option 1', 'field 2, option 2'],
            },
          }}
          filters={[]}
          setFilters={jest.fn()}
          clearFilters={jest.fn()}
          updateFilter={jest.fn()}
        />
      </ThemeProvider>
    )
  })
})
