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
import { render, screen } from '@testing-library/react'

import { server } from '../../../../test/server'
import { routeThatReturnsNoPublishedRecords } from '../../../../test/serverHandlers'
import Providers from 'components/layout/Providers'

import TableView from './TableView'

describe('The public data table', () => {
  it('renders', () => {
    render(
      <Providers>
        <TableView setFilters={jest.fn()} />
      </Providers>
    )
  })

  it('displays a message if there are no published records', async () => {
    server.use(routeThatReturnsNoPublishedRecords)
    render(
      <Providers>
        <TableView setFilters={jest.fn()} />
      </Providers>
    )
    const message = await screen.findByText('No records have been published.')
    expect(message).toBeInTheDocument()
  })
})
