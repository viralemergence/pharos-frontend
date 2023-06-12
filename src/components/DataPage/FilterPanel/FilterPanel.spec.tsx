import FilterPanel from './FilterPanel'
import { render } from '@testing-library/react'

describe('FilterPanel', () => {
  it('renders', () => {
    render(
      <FilterPanel
        isFilterPanelOpen={true}
        setIsFilterPanelOpen={jest.fn()}
        fields={{}}
        filters={[]}
        setFilters={jest.fn()}
        clearFilters={jest.fn()}
        updateFilter={jest.fn()}
      />
    )
  })
})
