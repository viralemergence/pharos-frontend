import React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { stateInitialValue } from 'reducers/stateReducer/initialValues'
import {
  oneMillionRecordsHandler,
  publishedRecordsMetadata,
} from '../../test/serverHandlers'
import DataPage from './data'
import { server } from '../../test/server'

jest.mock('reducers/stateReducer/stateContext', () => ({
  StateContext: React.createContext({ state: stateInitialValue }),
}))

jest.mock('components/layout/NavBar/NavBar', () =>
  jest.fn(({ children }) => children)
)

jest.mock('@talus-analytics/library.airtable-cms', () => {
  const mockedComponent = jest.fn(({ children }) => children)

  return {
    Download: mockedComponent,
    Icon: mockedComponent,
    IconProvider: mockedComponent,
    Image: mockedComponent,
    PlotIcon: mockedComponent,
    RenderRichText: mockedComponent,
    RichText: mockedComponent,
    SEO: mockedComponent,
    SiteMetadataContext: mockedComponent,
    SiteMetadataProvider: mockedComponent,
    Text: mockedComponent,
  }
})

jest.mock('cmsHooks/useIconsQuery', () => jest.fn())
jest.mock('cmsHooks/useIndexPageData', () => jest.fn())
jest.mock('cmsHooks/useSignInPageData', () => jest.fn())
jest.mock('cmsHooks/useSiteMetadataQuery', () => jest.fn())

const mockedMapboxMap = {
  on: jest.fn(),
  addSource: jest.fn(),
  addLayer: jest.fn(),
  queryRenderedFeatures: jest.fn(),
  setProjection: jest.fn(),
}

jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => mockedMapboxMap),
  Popup: jest.fn(() => ({
    setLngLat: jest.fn(),
    setHTML: jest.fn(),
    addTo: jest.fn(),
  })),
}))

const wait = (milliseconds: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds)
  })
}

describe.skip('The public data page', () => {
  // Make window.location available to tests
  const { location } = window
  beforeEach(() => {
    global.window ??= Object.create(window)
    Object.defineProperty(window, 'location', {
      value: {
        ...location,
      },
      writable: true,
    })
  })

  // Helper functions for retrieving elements from the page
  const getAddFilterButton = () => screen.getByText('Add filter')
  const getFilterPanel = (container: HTMLElement) =>
    container.querySelector('aside[role=form]')
  const getFilterPanelToggleButton = () =>
    screen.getByRole('button', { name: 'Filters' })
  const getTableViewButton = () => screen.getByRole('button', { name: 'Table' })
  const getMapViewButton = () => screen.getByRole('button', { name: 'Map' })
  const getGlobeViewButton = () => screen.getByRole('button', { name: 'Globe' })
  const getDataGrid = () => screen.queryByRole('grid')
  // This function will wait for the data grid to appear. It can be used to check
  // that the grid appears after loading published records.
  const getDataGridAfterWaiting = async () =>
    await screen.findByTestId('datagrid')
  const getClearFiltersButton = () => screen.getByText('Clear all')

  it('renders', () => {
    render(<DataPage />)
  })

  it('has a button labeled Table that, when clicked, displays a previously undisplayed grid', async () => {
    render(<DataPage />)
    const tableViewButton = getTableViewButton()
    expect(tableViewButton).toBeInTheDocument()
    expect(getDataGrid()).not.toBeInTheDocument()
    fireEvent.click(getTableViewButton())
    const grid = await getDataGridAfterWaiting()
    expect(grid).toBeInTheDocument()
  })

  it('has a button labeled Table that, when clicked, displays a previously undisplayed grid', async () => {
    render(<DataPage />)
    expect(screen.queryByRole('button', { name: 'Filters' })).toBeNull()
    const tableViewButton = getTableViewButton()
    expect(tableViewButton).toBeInTheDocument()
    expect(getDataGrid()).not.toBeInTheDocument()
    fireEvent.click(getTableViewButton())
    const grid = await getDataGridAfterWaiting()
    expect(grid).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Filters' })).not.toBeNull()
  })

  it('has a button labeled Map that sets the projection of the map to naturalEarth', async () => {
    /** Get the projections that have been assigned to the map, in the order in
     * which they were assigned */
    const getAssignedMapProjections = () =>
      mockedMapboxMap.setProjection.mock.calls
        .map(call => call[0].name)
        // Remove consecutive duplicates since it doesn't matter if the map
        // projection is set to the same value multiple times in a row
        .reduce(
          (acc, value) => (value !== acc.at(-1) ? [...acc, value] : acc),
          []
        )
    render(<DataPage />)
    await act(async () => {
      fireEvent.click(getGlobeViewButton())
      fireEvent.click(getMapViewButton())
    })
    const projections = getAssignedMapProjections()

    // The map should initially use the naturalEarth (in other words, flat) projection
    expect(projections[0]).toBe('mercator')

    // Clicking the Globe button should set the projection to 'globe'
    expect(projections[1]).toBe('globe')

    // Clicking the Map button should set the projection to 'naturalEarth'
    expect(projections[2]).toBe('mercator')

    expect(projections.length).toBe(3)
  })

  it('has a button labeled Filters (visible in Table view) that toggles the Filter Panel', () => {
    const { container } = render(<DataPage />)

    fireEvent.click(getTableViewButton())

    // Initially, the filter panel should be hidden
    const panel = getFilterPanel(container)
    expect(panel).toBeInTheDocument()
    expect(panel).toHaveAttribute('aria-hidden', 'true')

    // When the filter panel is hidden, the Add filter button is not rendered
    expect(screen.queryByText('Add filter')).toBe(null)

    const filterPanelToggleButton = getFilterPanelToggleButton()
    expect(filterPanelToggleButton).toBeInTheDocument()

    // Clicking the button shows the panel
    fireEvent.click(filterPanelToggleButton)
    expect(panel).toHaveAttribute('aria-hidden', 'false')
    expect(panel).toContainElement(getAddFilterButton())

    // Clicking the button again hides the panel
    fireEvent.click(filterPanelToggleButton)
    expect(panel).toHaveAttribute('aria-hidden', 'true')
  })

  it('has a filter panel (visible in Table view) that can be closed by clicking a button', () => {
    const { container } = render(<DataPage />)
    fireEvent.click(getTableViewButton())
    const filterPanelToggleButton = getFilterPanelToggleButton()
    fireEvent.click(filterPanelToggleButton)
    const panel = getFilterPanel(container)
    const closeButtons = screen.getAllByLabelText('Close the Filters panel')
    expect(panel).toContainElement(closeButtons[0])
    expect(panel).toHaveAttribute('aria-hidden', 'false')
    fireEvent.click(closeButtons[0])
    expect(panel).toHaveAttribute('aria-hidden', 'true')
  })

  it('has a filter panel (visible in Table view) that contains buttons for adding filters for fields', async () => {
    render(<DataPage />)
    fireEvent.click(getTableViewButton())
    fireEvent.click(getFilterPanelToggleButton())
    fireEvent.click(getAddFilterButton())
    const expectedButtonLabels = Object.values(
      publishedRecordsMetadata.possibleFilters
    ).map(filter => filter.label)
    await Promise.all(
      expectedButtonLabels.map(label =>
        screen.findByText(label, { selector: 'button' })
      )
    )
  })

  it('has a filter panel (visible in Table view) that contains a button that clears all filters in the panel', async () => {
    render(<DataPage />)

    fireEvent.click(getTableViewButton())
    fireEvent.click(getFilterPanelToggleButton())
    fireEvent.click(getAddFilterButton())
    const addFilterForCollectionDate = await screen.findByLabelText(
      'Add filter for Collection date',
      { selector: 'button' }
    )
    expect(addFilterForCollectionDate).toBeInTheDocument()
    userEvent.click(addFilterForCollectionDate)
    const dateInput = await screen.findByLabelText(
      'Collected on this date or later'
    )
    expect(dateInput).toBeInTheDocument()
    fireEvent.click(getClearFiltersButton())
    expect(
      screen.queryByLabelText('Collected on this date or later')
    ).not.toBeInTheDocument()
  })

  it('lets the user add date fields to the panel', async () => {
    render(<DataPage />)
    fireEvent.click(getTableViewButton())
    fireEvent.click(getFilterPanelToggleButton())
    userEvent.click(getAddFilterButton())
    const addFilterForCollectionDate = await screen.findByText(
      'Collection date',
      { selector: 'button' }
    )
    expect(addFilterForCollectionDate).toBeInTheDocument()
    userEvent.click(addFilterForCollectionDate)

    const filterForBeforeDate = await screen.findByLabelText(
      /^Collected on this date or earlier/
    )
    const filterForAfterDate = await screen.findByLabelText(
      /^Collected on this date or later/
    )
    expect(filterForAfterDate).toBeInTheDocument()
    expect(filterForBeforeDate).toBeInTheDocument()

    const dateFilters = await screen.findAllByLabelText(/^Collected on/)
    expect(dateFilters[0]).toHaveAttribute(
      'aria-label',
      'Collected on this date or later'
    )
    expect(dateFilters[1]).toHaveAttribute(
      'aria-label',
      'Collected on this date or earlier'
    )
  })

  it('lets the user filter by collection start date', async () => {
    render(<DataPage />)
    fireEvent.click(getTableViewButton())
    fireEvent.click(getFilterPanelToggleButton())
    fireEvent.click(getAddFilterButton())
    fireEvent.click(await screen.findByText('Collection date'))
    const filterInput = screen.getByLabelText('Collected on this date or later')
    expect(filterInput).toBeInTheDocument()
    await userEvent.type(filterInput, '2020-04-01')
    const grid = await getDataGridAfterWaiting()
    await waitFor(
      () => {
        expect(grid).toHaveAttribute('aria-rowcount', '10')
      },
      { timeout: 5000 }
    )
  }, 10000)

  it('does not filter by a date if it is invalid', async () => {
    render(<DataPage />)
    fireEvent.click(getTableViewButton())
    fireEvent.click(getFilterPanelToggleButton())
    fireEvent.click(getAddFilterButton())
    fireEvent.click(await screen.findByText('Collection date'))
    const filterInput = screen.getByLabelText<HTMLInputElement>(
      'Collected on this date or later'
    )
    expect(filterInput).toBeInTheDocument()
    await act(async () => {
      fireEvent.change(filterInput, { target: { value: '1800-01-01' } })
    })
    await wait(1000)
    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toBeInTheDocument()
    const grid = await getDataGridAfterWaiting()
    await waitFor(() => {
      expect(grid).toHaveAttribute('aria-rowcount', '51')
    })
  }, 15000)

  it('shows a tooltip if dates are out of order', async () => {
    render(<DataPage />)
    fireEvent.click(getTableViewButton())
    fireEvent.click(getFilterPanelToggleButton())
    fireEvent.click(getAddFilterButton())
    fireEvent.click(await screen.findByText('Collection date'))
    const startDateInput = screen.getByLabelText<HTMLInputElement>(
      'Collected on this date or later'
    )
    const endDateInput = screen.getByLabelText<HTMLInputElement>(
      'Collected on this date or earlier'
    )
    expect(startDateInput).toBeInTheDocument()
    expect(endDateInput).toBeInTheDocument()
    expect(screen.queryByRole('tooltip')).toBeNull()
    await act(async () => {
      fireEvent.change(startDateInput, { target: { value: '2000-01-01' } })
      fireEvent.change(endDateInput, { target: { value: '1999-01-01' } })
    })
    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toBeInTheDocument()
  }, 15000)

  it('provides a host species filter that offers options corresponding to the metadata', async () => {
    render(<DataPage />)
    fireEvent.click(getTableViewButton())
    fireEvent.click(getFilterPanelToggleButton())
    fireEvent.click(getAddFilterButton())
    fireEvent.click(await screen.findByText('Host species'))
    const typeahead = screen.getByLabelText('Host species')
    expect(typeahead).toBeInTheDocument()
    act(() => {
      typeahead.focus()
    })
    let hostSpecies: HTMLElement
    await waitFor(() => {
      hostSpecies = screen.getByRole('option', { name: /bear/i })
      expect(hostSpecies).toBeInTheDocument()
    })

    // NOTE: When doing more extensive testing of the Typeahead, it may be
    // necessary to mock out the svg import in
    // src/components/DataPage/FilterPanel/FilterDarkTypeaheadResult.tsx with something like
    // jest.mock('assets/darkTypeaheadRemove.svg', () => '')
  }, 10000)

  it('has a button labeled Globe that changes the projection of the map to globe', () => {
    render(<DataPage />)
    fireEvent.click(getMapViewButton())
    const howManyTimesMapProjectionWasSet =
      mockedMapboxMap.setProjection.mock.calls.length
    fireEvent.click(getGlobeViewButton())
    // Check that the click caused setProjection to be called once more,
    // with 'globe' as the argument
    expect(mockedMapboxMap.setProjection).toHaveBeenNthCalledWith(
      howManyTimesMapProjectionWasSet + 1,
      { name: 'globe' }
    )
  })

  it('has a button labeled Table that displays a grid but leaves the map in natural-earth mode if it was previously in that mode', () => {
    render(<DataPage />)
    fireEvent.click(getMapViewButton())
    // Count how many times the map projection was changed before table view
    // button was pressed
    const callCount_before = mockedMapboxMap.setProjection.mock.calls.length
    fireEvent.click(getTableViewButton())
    const callCount_after = mockedMapboxMap.setProjection.mock.calls.length
    expect(callCount_after).toEqual(callCount_before)
  })

  it('has a button labeled Table that displays a grid but leaves the map in globe mode if it was previously in that mode', () => {
    render(<DataPage />)
    fireEvent.click(getGlobeViewButton())
    // Count how many times the map projection was changed before the table
    // view button was pressed
    const callCount_before = mockedMapboxMap.setProjection.mock.calls.length
    fireEvent.click(getTableViewButton())
    const callCount_after = mockedMapboxMap.setProjection.mock.calls.length
    expect(callCount_after).toEqual(callCount_before)
  })

  it('displays the first page of published records', async () => {
    render(<DataPage enableTableVirtualization={false} />)
    fireEvent.click(getTableViewButton())
    const grid = await getDataGridAfterWaiting()
    expect(grid).toBeInTheDocument()
    expect(grid).toHaveAttribute('aria-rowcount', '51')
  })

  it('displays the second page of published records when the user scrolls to the bottom of the grid', async () => {
    render(<DataPage enableTableVirtualization={false} />)
    fireEvent.click(getTableViewButton())
    const grid = await getDataGridAfterWaiting()
    expect(grid).toBeInTheDocument()
    // Scroll to the bottom of the grid
    fireEvent.scroll(grid, { target: { scrollY: grid.scrollHeight } })
    waitFor(() => {
      expect(grid).toHaveAttribute('aria-rowcount', '101')
    })
  })

  it.skip('provides a summary of the records, when no filters are used', async () => {
    server.use(oneMillionRecordsHandler)
    render(<DataPage />)
    fireEvent.click(getTableViewButton())
    const summary = await screen.findByRole('status', {
      name: '1,234,567',
    })
    expect(summary).toBeInTheDocument()
  })

  it.skip('provides a summary of the records, when a filter is used', async () => {
    server.use(oneMillionRecordsHandler)
    render(<DataPage />)
    fireEvent.click(getTableViewButton())
    fireEvent.click(getFilterPanelToggleButton())
    fireEvent.click(getAddFilterButton())
    fireEvent.click(await screen.findByText('Collection date'))
    const startDateInput = screen.getByLabelText(
      'Collected on this date or later'
    )
    await userEvent.type(startDateInput, '2020-04-01')
    const summary = await screen.findByRole('status', {
      name: '567 of 1,234,567 records',
    })
    expect(summary).toBeInTheDocument()
  }, 10000)
})
