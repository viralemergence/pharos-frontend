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
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { server } from '../../../../test/server'
import { routeThatReturnsNoPublishedRecords } from '../../../../test/serverHandlers'
import Providers from 'components/layout/Providers'

import TableView from './TableView'

describe('The public data table', () => {
  it('renders', () => {
    render(
      <Providers>
        <TableView />
      </Providers>
    )
  })

  const getDataGridAfterWaiting = async () =>
    await screen.findByTestId('datagrid')

  it('displays the first page of published records', async () => {
    render(
      <Providers>
        <TableView enableVirtualization={false} />
      </Providers>
    )
    const grid = await getDataGridAfterWaiting()
    expect(grid).toBeInTheDocument()
    expect(grid).toHaveAttribute('aria-rowcount', '51')
  })

  // Skipping this test since fireEvent.scroll does not work well when circleci runs `yarn run test`
  it.skip('displays the second page of published records when the user scrolls to the bottom', async () => {
    render(
      <Providers>
        <TableView enableVirtualization={false} />
      </Providers>
    )
    const grid = await getDataGridAfterWaiting()
    expect(grid).toBeInTheDocument()
    // Scroll to the bottom of the grid
    fireEvent.scroll(grid, { target: { scrollY: grid.scrollHeight } })
    await waitFor(async () => {
      const rows = await screen.findAllByRole('row')
      expect(rows).toHaveLength(101) // 100 rows plus the header
      expect(
        await screen.findByText('row 1 - project name')
      ).toBeInTheDocument()
      expect(
        await screen.findByText('row 1 - host species')
      ).toBeInTheDocument()
      expect(
        await screen.findByText('row 1 - spatial uncertainty')
      ).toBeInTheDocument()
      expect(
        await screen.findByText('row 50 - project name')
      ).toBeInTheDocument()
      expect(
        await screen.findByText('row 50 - host species')
      ).toBeInTheDocument()
      expect(
        await screen.findByText('row 50 - spatial uncertainty')
      ).toBeInTheDocument()
      expect(
        await screen.findByText('row 100 - project name')
      ).toBeInTheDocument()
      expect(
        await screen.findByText('row 100 - host species')
      ).toBeInTheDocument()
      expect(
        await screen.findByText('row 100 - spatial uncertainty')
      ).toBeInTheDocument()
    })
  })

  it('displays a message if there are no published records', async () => {
    server.use(routeThatReturnsNoPublishedRecords)
    render(
      <Providers>
        <TableView />
      </Providers>
    )
    const message = await screen.findByText('No records have been published.')
    expect(message).toBeInTheDocument()
  })
})
