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
import { render, screen, waitFor } from '@testing-library/react'

import { server } from '../../../../test/server'
import {
  routeThatReturnsNoPublishedRecords,
  routeThatIsSometimesSlow,
} from '../../../../test/serverHandlers'
import Providers from 'components/layout/Providers'

import TableView from './TableView'
import { Filter } from 'pages/data'

// TODO: Extract as a utility, use in serverHandlers.ts
const sleep = (milliseconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

describe('The public data table', () => {
  const getDataGridAfterWaiting = async () =>
    await screen.findByTestId('datagrid')

  it('renders', () => {
    render(
      <Providers>
        <TableView filters={[]} setFilters={jest.fn()} />
      </Providers>
    )
  })

  it('displays a message if there are no published records', async () => {
    server.use(routeThatReturnsNoPublishedRecords)
    render(
      <Providers>
        <TableView filters={[]} setFilters={jest.fn()} />
      </Providers>
    )
    const message = await screen.findByText('No records have been published.')
    expect(message).toBeInTheDocument()
  })

  const startDateFilter: Filter = {
    fieldId: 'collection_start_date',
    label: 'Collected on or after',
    type: 'date',
    values: [],
    addedToPanel: true,
    dataGridKey: 'Collection date',
    options: [],
    panelIndex: 0,
  }

  const startDateFilterMarch2020: Filter = {
    ...startDateFilter,
    values: ['2020-03-01'],
  }

  const startDateFilterApril2020: Filter = {
    ...startDateFilter,
    values: ['2020-04-01'],
  }

  it('can be filtered by collection start date', async () => {
    render(
      <Providers>
        <TableView
          filters={[startDateFilterMarch2020]}
          setFilters={jest.fn()}
        />
      </Providers>
    )
    const grid = await getDataGridAfterWaiting()
    await waitFor(() => {
      expect(grid).toHaveAttribute('aria-rowcount', '41')
    })
  })

  it('responds to a change in the start date filter', async () => {
    const { rerender } = render(
      <Providers>
        <TableView
          filters={[startDateFilterMarch2020]}
          setFilters={jest.fn()}
        />
      </Providers>
    )
    const gridBeforeChange = await getDataGridAfterWaiting()
    await waitFor(() => {
      expect(gridBeforeChange).toHaveAttribute('aria-rowcount', '41')
    })
    rerender(
      <Providers>
        <TableView
          filters={[startDateFilterApril2020]}
          setFilters={jest.fn()}
        />
      </Providers>
    )
    const gridAfterChange = await getDataGridAfterWaiting()
    await waitFor(() => {
      expect(gridAfterChange).toHaveAttribute('aria-rowcount', '10')
    })
  })

  it('does not process a GET request for published records if a more recently initiated request has already been processed', async () => {
    server.use(routeThatIsSometimesSlow)
    const { rerender } = render(
      <Providers>
        <TableView
          filters={[startDateFilterMarch2020]}
          setFilters={jest.fn()}
        />
      </Providers>
    )
    sleep(1000)
    // rerender(
    //   <Providers>
    //     <TableView
    //       filters={[startDateFilterApril2020]}
    //       setFilters={jest.fn()}
    //     />
    //   </Providers>
    // )
    const gridAfterChange = await getDataGridAfterWaiting()
    await waitFor(() => {
      expect(gridAfterChange).toHaveAttribute('aria-rowcount', '10')
    })
  })
})
