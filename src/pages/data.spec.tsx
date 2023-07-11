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

import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { stateInitialValue } from 'reducers/stateReducer/initialValues'

import DataPage from './data'

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
