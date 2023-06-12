import React from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import textStyles from '../figma/textStyles'
import colorPalette from '../figma/colorPalette'
import zIndexes from '../components/layout/ZIndexes'

import DataPage from './data'

jest.mock('@talus-analytics/library.airtable-cms', () => {
  return { Image: jest.fn(), IconProvider: jest.fn(), SEO: jest.fn() }
})
jest.mock('cmsHooks/useIconsQuery', () => {
  return jest.fn()
})
jest.mock('cmsHooks/useSiteMetadataQuery', () => {
  return jest.fn()
})

describe('DataPage', () => {
  it('renders', () => {
    render(
      <ThemeProvider theme={{ ...textStyles, ...colorPalette, zIndexes }}>
        <DataPage />
      </ThemeProvider>
    )
  })
})
