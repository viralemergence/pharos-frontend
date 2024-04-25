import React, { useCallback, useEffect, useState } from 'react'
import CMS from 'components/library/airtable-cms'

import Providers from 'components/layout/Providers'
import NavBar from 'components/layout/NavBar/NavBar'
import MapView, { MapProjection } from 'components/DataPage/MapView/MapView'
import TableView from 'components/DataPage/TableView/TableView'
import DataToolbar, { View, isView } from 'components/DataPage/Toolbar/Toolbar'
import FilterPanel from 'components/DataPage/FilterPanel/FilterPanel'
import {
  MapOverlay,
  PageContainer,
  ScreenReaderOnly,
  ViewContainer,
  ViewMain,
} from 'components/DataPage/DisplayComponents'
import { SummaryOfRecords } from 'components/PublicViews/PublishedRecordsDataGrid/PublishedRecordsDataGrid'
import usePublishedRecordsMetadata from 'hooks/publishedRecords/usePublishedRecordsMetadata'
import ModalMessageProvider from 'hooks/useModal/ModalMessageProvider'

export type SimpleFilter = {
  id: string
  /** To filter on a specific field, the user sets values for the field. For
   * example, the host_species filter could receive the values ["Bear", "Wolf"]. */
  values: string[]
}

export type Filter = SimpleFilter & {
  label: string
  type: 'text' | 'date'
  /** In the table (a.k.a. 'data grid') each column has a distinct id a.k.a.
   * 'key'. The dataGridKey of a Filter is the key of its associated
   * column. These keys are also the labels of the columns, e.g.
   * "Collection date". */
  dataGridKey: string
  /** The different possible values for a filter - relevant for typeahead fields. */
  options: string[]
  valid: boolean
  /** A filter has been 'added to the panel' when the panel contains an input
   * (such as a date input or a typeahead) for setting the filter's values. */
  addedToPanel?: boolean
  /** If a filter has been 'applied', this means that it has been applied to
   * the list of records shown in the table, so that only records matching the
   * filter are shown in the table. For example, if the user sets host_species
   * to ['Bear'], then, once the table has been populated with bears and bears
   * only, the host_species filter's 'applied' property will be set to true. */
  applied?: boolean
  /* This number determines the order of the filters in the panel. */
  panelIndex: number
  /** The historically earliest collection date that appears among the
   * published records. Only date filters have this property. */
  earliestDateInDatabase?: string
  /** The historically latest, furthest-into-the-future collection date that
   * appears among the published records. Only date filters have this property.
   * */
  latestDateInDatabase?: string
}

const DataPage = ({
  enableTableVirtualization = true,
}: {
  /** Virtualization should be disabled in tests via this prop, so that all the
   * cells in the table are rendered immediately */
  enableTableVirtualization?: boolean
}): JSX.Element => {
  /* The 'view' is controlled by the three radio buttons */
  const [view, setView] = useState<View>(View.map)
  /* This variable controls the state of the map. If the user clicks the
   * 'Globe' radio button, then the 'Table' radio button, the view will be
   * 'table' and the map projection will be 'globe' */
  const [mapProjection, setMapProjection] = useState<MapProjection>('mercator')
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [filters, setFilters] = useState<Filter[]>([])
  const [summaryOfRecords, setSummaryOfRecords] = useState<SummaryOfRecords>({
    isLastPage: false,
  })

  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState('')

  /** Update the view, and update the map projection view accordingly */
  const changeView = useCallback(
    (newView: View, shouldSetHash = true) => {
      if (shouldSetHash) window.location.hash = newView
      setView(newView)
      if (newView === View.globe && mapProjection !== 'globe') {
        setMapProjection('globe')
      }
      if (newView === View.map && mapProjection !== 'mercator') {
        setMapProjection('mercator')
      }
    },
    [mapProjection]
  )

  const { possibleFilters, sortableFields } =
    usePublishedRecordsMetadata() ?? {}

  useEffect(() => {
    if (possibleFilters) setFilters(possibleFilters)
  }, [possibleFilters])

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (isView(hash)) changeView(hash, false)
  }, [changeView])

  useEffect(() => {
    if (isFilterPanelOpen) {
      setScreenReaderAnnouncement(
        prev =>
          'Filters panel opened' +
          // Alternate adding and removing a period to make the screen
          // reader read the announcement
          (prev.endsWith('.') ? '' : '.')
      )
    }
  }, [isFilterPanelOpen])

  const shouldBlurMap = view === View.table

  return (
    <Providers>
      <CMS.SEO />
      <ModalMessageProvider>
        <PageContainer>
          <NavBar />
          <ViewContainer
            shouldBlurMap={shouldBlurMap}
            isFilterPanelOpen={isFilterPanelOpen}
          >
            <MapView projection={mapProjection} />
            {shouldBlurMap && <MapOverlay />}
            <DataToolbar
              view={view}
              changeView={changeView}
              isFilterPanelOpen={isFilterPanelOpen}
              setIsFilterPanelOpen={setIsFilterPanelOpen}
              filters={filters}
              summaryOfRecords={summaryOfRecords}
            />
            <ViewMain isFilterPanelOpen={isFilterPanelOpen}>
              {view === View.table && (
                <FilterPanel
                  filters={filters}
                  setFilters={setFilters}
                  isFilterPanelOpen={isFilterPanelOpen}
                  setIsFilterPanelOpen={setIsFilterPanelOpen}
                />
              )}
              <TableView
                filters={filters}
                setFilters={setFilters}
                isOpen={view === View.table}
                isFilterPanelOpen={isFilterPanelOpen}
                summaryOfRecords={summaryOfRecords}
                setSummaryOfRecords={setSummaryOfRecords}
                enableVirtualization={enableTableVirtualization}
                sortableFields={sortableFields}
              />
            </ViewMain>
          </ViewContainer>
          <ScreenReaderOnly aria-live="assertive">
            {screenReaderAnnouncement}
          </ScreenReaderOnly>
        </PageContainer>
      </ModalMessageProvider>
    </Providers>
  )
}

export default DataPage
