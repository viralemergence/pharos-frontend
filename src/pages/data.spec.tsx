import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

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

  // Helper functions for retrieving elements from the page
  const getAddFilterButton = () => screen.getByLabelText('Add filter')
  const getFilterPanel = (container: HTMLElement) =>
    container.querySelector('aside[role=navigation]')
  const getTableViewButton = () => screen.getByRole('button', { name: 'Table' })
  const getMapViewButton = () => screen.getByRole('button', { name: 'Map' })

  it('renders', () => {
    render(<DataView />)
  })

  it('has a button labeled Table that, when clicked, displays a previously undisplayed grid', () => {
    render(<DataView />)
    const tableViewButton = getTableViewButton()
    expect(tableViewButton).toBeInTheDocument()
    expect(screen.queryByRole('grid')).not.toBeInTheDocument()
    fireEvent.click(tableViewButton)
    expect(screen.queryByRole('grid')).toBeInTheDocument()
  })

  it('has buttons labeled Map and Globe that change the projection of the map', () => {
    render(<DataView />)
    expect(mockedMapboxMap.setProjection).not.toHaveBeenCalledWith({
      name: 'naturalEarth',
    })
    fireEvent.click(getMapViewButton())
    expect(mockedMapboxMap.setProjection).toHaveBeenCalledWith({
      name: 'naturalEarth',
    })
  })

  it('has a button labeled Filters that toggles the Filter Panel', () => {
    const { container } = render(<DataView />)

    // Initially, the filter panel should be visible
    const panel = getFilterPanel(container)
    expect(panel).toBeInTheDocument()
    expect(panel).toHaveAttribute('aria-hidden', 'false')
    expect(panel).toContainElement(getAddFilterButton())

    const filterPanelButton = screen.getByRole('button', { name: 'Filters' })

    // Clicking the button closes the panel
    fireEvent.click(filterPanelButton)
    expect(panel).toHaveAttribute('aria-hidden', 'true')

    // Clicking the button again opens the panel
    fireEvent.click(filterPanelButton)
    expect(panel).toHaveAttribute('aria-hidden', 'false')
  })

  it('has a filter panel that can be closed by clicking a button', () => {
    const { container } = render(<DataView />)
    const panel = getFilterPanel(container)
    const closeButtons = screen.getAllByLabelText('Close the filters panel')
    expect(panel).toContainElement(closeButtons[0])
    expect(panel).toHaveAttribute('aria-hidden', 'false')
    fireEvent.click(closeButtons[0])
    expect(panel).toHaveAttribute('aria-hidden', 'true')
  })

  it('has a filter panel that contains buttons for adding filters for fields', async () => {
    render(<DataView />)
    fireEvent.click(getAddFilterButton())
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Project name' })
      ).toBeInTheDocument()
    })
  })
})
