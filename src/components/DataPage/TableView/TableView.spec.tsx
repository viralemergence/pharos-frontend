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
import { oneMillionRecordsHandler } from '../../../../test/serverHandlers'

import Providers from 'components/layout/Providers'
import TableView from './TableView'
import { Filter } from 'pages/data'

describe('The public data table', () => {
  const getDataGridAfterWaiting = async () =>
    await screen.findByTestId('datagrid')

  const tableViewProps = {
    setFilters: jest.fn(),
    /** By default react-data-grid only puts the visible rows in the DOM, and
     * creates more DOM elements as you scroll. This prop turns off this
     * 'virtualization' functionality for testing purposes. */
    enableVirtualization: false,
  }

  it('renders', async () => {
    render(
      <Providers>
        <TableView {...tableViewProps} />
      </Providers>
    )
    const grid = await getDataGridAfterWaiting()
    expect(grid).toBeInTheDocument()
  })

  const startDateFilter: Filter = {
    id: 'collection_start_date',
    label: 'Collection date',
    type: 'date',
    addedToPanel: true,
    dataGridKey: 'Collection date',
    options: [],
    panelIndex: 0,
    values: [],
    valid: true,
  }

  const startDateFilterMarch2020: Filter = {
    ...startDateFilter,
    values: ['2020-03-01'],
  }

  it('can be filtered by collection start date', async () => {
    render(
      <Providers>
        <TableView {...tableViewProps} filters={[startDateFilterMarch2020]} />
      </Providers>
    )
    const grid = await getDataGridAfterWaiting()
    await waitFor(() => {
      expect(grid).toHaveAttribute('aria-rowcount', '41')
    })
  })

  it('has clickable project names and researcher names', async () => {
    render(
      <Providers>
        <TableView {...tableViewProps} />
      </Providers>
    )
    const projectLinks = await screen.findAllByRole('link', {
      name: 'Project Zero',
    })
    expect(projectLinks.length).toBeGreaterThan(10)
    const researcherLinks = await screen.findAllByRole('link', {
      name: 'Researcher Zero',
    })
    expect(researcherLinks.length).toBeGreaterThan(10)
  })

  it('provides a summary of the records, when no filters are used', async () => {
    server.use(oneMillionRecordsHandler)
    render(
      <Providers>
        <TableView {...tableViewProps} />
      </Providers>
    )
    const summary = await screen.findByRole('status', {
      name: '1,234,567 records',
    })
    expect(summary).toBeInTheDocument()
  })
  it('provides a summary of the records, when a filter is used', async () => {
    server.use(oneMillionRecordsHandler)
    render(
      <Providers>
        <TableView filters={[startDateFilterMarch2020]} {...tableViewProps} />
      </Providers>
    )
    const summary = await screen.findByRole('status', {
      name: '567 of 1,234,567 records',
    })
    expect(summary).toBeInTheDocument()
  })
})
