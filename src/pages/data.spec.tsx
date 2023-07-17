import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { stateInitialValue } from 'reducers/stateReducer/initialValues'
import { publishedRecordsMetadata } from '../../test/serverHandlers'
import DataPage from './data'

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

describe('The public data page', () => {
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
  const getAddFilterButton = () => screen.getByText('Add filter') // TODO: If this doesn't work try getByText
  const getFilterPanel = (container: HTMLElement) =>
    container.querySelector('aside[role=navigation]')
  const getFilterPanelToggleButton = () =>
    screen.getByRole('button', { name: 'Filters' })
  const getTableViewButton = () => screen.getByRole('button', { name: 'Table' })
  const getMapViewButton = () => screen.getByRole('button', { name: 'Map' })
  const getGlobeViewButton = () => screen.getByRole('button', { name: 'Globe' })
  const getDataGrid = () => screen.queryByRole('grid')
  // This function will wait for the data grid to appear. It can be used to check
  // that the grid appears after loading published records.
  const getDataGridAfterWaiting = async () => await screen.findByRole('grid')

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

  it('has a button labeled Map that sets the projection of the map to naturalEarth', () => {
    render(<DataPage />)
    fireEvent.click(getGlobeViewButton())
    const howManyTimesMapProjectionWasSet =
      mockedMapboxMap.setProjection.mock.calls.length
    fireEvent.click(getMapViewButton())
    // Check that the click caused setProjection to be called once more,
    // with 'naturalEarth' as the argument
    expect(mockedMapboxMap.setProjection).toHaveBeenNthCalledWith(
      howManyTimesMapProjectionWasSet + 1,
      { name: 'naturalEarth' }
    )
  })

  it('has a button labeled Filters that toggles the Filter Panel', () => {
    const { container } = render(<DataPage />)

    // Initially, the filter panel should be hidden
    const panel = getFilterPanel(container)
    expect(panel).toBeInTheDocument()
    expect(panel).toHaveAttribute('aria-hidden', 'true')
    expect(panel).toContainElement(getAddFilterButton())

    const filterPanelToggleButton = getFilterPanelToggleButton()
    expect(filterPanelToggleButton).toBeInTheDocument()

    // Clicking the button shows the panel
    fireEvent.click(filterPanelToggleButton)
    expect(panel).toHaveAttribute('aria-hidden', 'false')

    // Clicking the button again hides the panel
    fireEvent.click(filterPanelToggleButton)
    expect(panel).toHaveAttribute('aria-hidden', 'true')
  })

  it('has a filter panel that can be closed by clicking a button', () => {
    const { container } = render(<DataPage />)
    const filterPanelToggleButton = getFilterPanelToggleButton()
    fireEvent.click(filterPanelToggleButton)
    const panel = getFilterPanel(container)
    const closeButtons = screen.getAllByLabelText('Close the Filters panel')
    expect(panel).toContainElement(closeButtons[0])
    expect(panel).toHaveAttribute('aria-hidden', 'false')
    fireEvent.click(closeButtons[0])
    expect(panel).toHaveAttribute('aria-hidden', 'true')
  })

  it('has a filter panel that contains buttons for adding filters for fields', async () => {
    render(<DataPage />)
    fireEvent.click(getAddFilterButton())
    const expectedButtonLabels = Object.values(publishedRecordsMetadata.fields)
    await Promise.all(
      expectedButtonLabels.map(({ label }) =>
        screen.findByText(label, { selector: 'button' })
      )
    )
  })

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
})
