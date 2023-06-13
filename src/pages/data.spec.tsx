import React from 'react'
import { screen, render } from '@testing-library/react'
// import { ThemeProvider } from 'styled-components'
// import textStyles from '../figma/textStyles'
// import colorPalette from '../figma/colorPalette'
// import zIndexes from '../components/layout/ZIndexes'

import DataView from './data'

jest.mock('@talus-analytics/library.airtable-cms', () => {
  return {
    Download: jest.fn(),
    Icon: jest.fn(),
    IconProvider: jest.fn(),
    Image: jest.fn(),
    PlotIcon: jest.fn(),
    RenderRichText: jest.fn(),
    RichText: jest.fn(),
    SEO: jest.fn(),
    SiteMetadataContext: jest.fn(),
    SiteMetadataProvider: jest.fn(),
    Text: jest.fn(),
    getDownloadInfo: jest.fn(),
    getImage: jest.fn(),
    getText: jest.fn(),
    parseRichText: jest.fn(),
    useIcon: jest.fn(),
  }
})

// jest.mock('@talus-analytics/library.airtable-cms', () => {
//   const cmsModule = jest.requireActual('@talus-analytics/library.airtable-cms')
//   // Mock out all functions in this module
//   Object.keys(cmsModule).forEach(key => {
//     if (typeof cmsModule[key] === 'function') {
//       cmsModule[key] = jest.fn()
//     }
//   })
//   return cmsModule
// })

jest.mock('cmsHooks/useIconsQuery', () => {
  return jest.fn()
})
jest.mock('cmsHooks/useSiteMetadataQuery', () => {
  return jest.fn()
})

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
    render(
      //<ThemeProvider theme={{ ...textStyles, ...colorPalette, zIndexes }}>
      <DataView />
      //</ThemeProvider>
    )
    screen.debug()
  })
})
