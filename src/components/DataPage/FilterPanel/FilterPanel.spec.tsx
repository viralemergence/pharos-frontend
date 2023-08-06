import React from 'react'
import FilterPanel from './FilterPanel'
import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import textStyles from '../../../figma/textStyles'
import colorPalette from '../../../figma/colorPalette'
import breakpoints from '../../../components/layout/Breakpoints'

const Provider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={{ ...textStyles, ...colorPalette, breakpoints }}>
    {children}
  </ThemeProvider>
)

describe('FilterPanel', () => {
  const getAddFilterButton = () => screen.getByText('Add filter')

  it('renders', () => {
    render(
      <Provider>
        <FilterPanel
          isFilterPanelOpen={true}
          setIsFilterPanelOpen={jest.fn()}
          filters={[]}
        />
      </Provider>
    )
  })

  it('renders with filters', () => {
    render(
      <Provider>
        <FilterPanel
          isFilterPanelOpen={true}
          setIsFilterPanelOpen={jest.fn()}
          filters={[
            {
              fieldId: 'field1',
              label: 'Field 1',
              type: 'text',
              options: ['field 1, option 1', 'field 1, option 2'],
              dataGridKey: 'field1',
              panelIndex: 0,
            },
            {
              fieldId: 'field2',
              label: 'Field 2',
              type: 'text',
              options: ['field 2, option 1', 'field 2, option 2'],
              dataGridKey: 'field2',
              panelIndex: 1,
            },
          ]}
        />
      </Provider>
    )
    const addFilterButton = getAddFilterButton()
    expect(addFilterButton).toBeInTheDocument()
    expect(screen.queryByText('Field 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Field 2')).not.toBeInTheDocument()

    fireEvent.click(addFilterButton)
    expect(screen.getByText('Field 1')).toBeInTheDocument()
    expect(screen.getByText('Field 2')).toBeInTheDocument()
  })
})
