import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { stateInitialValue } from 'reducers/stateReducer/initialValues'
import DataView from './data'

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
    // getDownloadInfo: jest.fn(),
    // getImage: jest.fn(),
    // getText: jest.fn(),
    // parseRichText: jest.fn(),
    // useIcon: jest.fn(),
  }
})

jest.mock('cmsHooks/useIconsQuery', () => jest.fn())
jest.mock('cmsHooks/useIndexPageData', () => jest.fn())
jest.mock('cmsHooks/useSignInPageData', () => jest.fn())
jest.mock('cmsHooks/useSiteMetadataQuery', () => jest.fn())

const mockMapboxMap = {
  on: jest.fn(),
  addSource: jest.fn(),
  addLayer: jest.fn(),
  queryRenderedFeatures: jest.fn(),
  setProjection: jest.fn(),
}

jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => mockMapboxMap),
  Popup: jest.fn(() => ({
    setLngLat: jest.fn(),
    setHTML: jest.fn(),
    addTo: jest.fn(),
  })),
}))

describe('DataPage', () => {
  // Make window.location available to tests
  const { location } = window
  beforeEach(() => {
    global.window = Object.create(window)
    Object.defineProperty(window, 'location', {
      value: {
        ...location,
      },
      writable: true,
    })
  })

  it('renders', () => {
    render(<DataView />)
  })

  it('has a button labeled Table that, when clicked, displays a previously undisplayed grid', () => {
    render(<DataView />)
    const tableViewButton = screen.getByRole('button', { name: /Table/i })
    expect(tableViewButton).toBeInTheDocument()
    expect(screen.queryByRole('grid')).not.toBeInTheDocument()
    fireEvent.click(tableViewButton)
    expect(screen.queryByRole('grid')).toBeInTheDocument()
  })

  it('has buttons labeled Map and Globe that change the projection of the map', () => {
    render(<DataView />)
    // Since globe is the default view, switch to table view first
    const tableViewButton = screen.getByRole('button', { name: /Table/i })
    fireEvent.click(tableViewButton)
    const mapViewButton = screen.getByRole('button', { name: /Map/i })
    const globeViewButton = screen.getByRole('button', { name: /Globe/i })
    fireEvent.click(mapViewButton)
    expect(mockMapboxMap.setProjection).toHaveBeenCalledWith({
      name: 'naturalEarth',
    })
    fireEvent.click(globeViewButton)
    expect(mockMapboxMap.setProjection).toHaveBeenCalledWith({
      name: 'globe',
    })
  })

  it('has a button labeled Filters that toggles the display of a button labeled Add filter', async () => {
    render(<DataView />)
    // Initially the panel is displayed
    const addFilterButton = () => screen.getByLabelText('Add filter')
    expect(addFilterButton()).toBeInTheDocument()

    expect(addFilterButton()).toHaveAttribute('aria-hidden', 'false')

    const filterPanelButton = screen.getByRole('button', { name: /Filters/i })

    // Clicking the button closes the panel
    fireEvent.click(filterPanelButton)
    expect(addFilterButton()).toHaveAttribute('aria-hidden', 'true')

    // Clicking the button again opens the panel
    fireEvent.click(filterPanelButton)
    expect(addFilterButton()).toHaveAttribute('aria-hidden', 'false')
  })
})
