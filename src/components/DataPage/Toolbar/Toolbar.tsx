import React, {
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'
import type { Filter } from 'pages/data'
import {
  FilterPanelLauncher,
  DataToolbarButton,
  ContainerForRadioButtons,
  ContainerForFilterPanelLauncher,
  DataToolbarDiv,
  SummaryOfRecordsStyled,
  // SummaryOfRecordsStyled,
} from '../DisplayComponents'
import { SummaryOfRecords } from 'components/PublicViews/PublishedRecordsDataGrid/PublishedRecordsDataGrid'
import DataDownloadButton from './DataDownloadButton'

export enum View {
  map = 'map',
  globe = 'globe',
  table = 'table',
}

export const isView = (str: string): str is View => {
  return Object.values(View).includes(str)
}

// /** For example, convert 1000000 to "1,000,000" */
const addCommasToNumber = (num: number) => num.toLocaleString('en-US')

const RadioButton = ({
  currentView,
  forView,
  label,
  changeView,
}: {
  currentView: View
  forView: View
  label: string
  changeView: (view: View) => void
}) => (
  <DataToolbarButton
    selected={currentView === forView}
    onClick={() => changeView(forView)}
  >
    {label}
  </DataToolbarButton>
)

const DataToolbar = ({
  isFilterPanelOpen,
  setIsFilterPanelOpen,
  view,
  changeView,
  filters = [],
  summaryOfRecords,
}: {
  isFilterPanelOpen: boolean
  setIsFilterPanelOpen: Dispatch<SetStateAction<boolean>>
  view: View
  changeView: (view: View) => void
  filters: Filter[]
  summaryOfRecords: SummaryOfRecords
}) => {
  const filterPanelLauncherRef = useRef<HTMLButtonElement>(null)
  // Keep track of whether the filter panel was open on last render, to detect
  // when the panel closes.
  const [wasFilterPanelOpen, setWasFilterPanelOpen] = useState(false)
  useEffect(() => {
    // If the panel just closed, focus the launcher. We need to check both that
    // the filter panel is currently closed and also that it was previously
    // open. If we skip the second check, the launcher will be focused when the
    // Toolbar first renders.
    if (wasFilterPanelOpen && !isFilterPanelOpen) {
      filterPanelLauncherRef.current?.focus()
    }
    if (isFilterPanelOpen) {
      setWasFilterPanelOpen(true)
    }
  }, [isFilterPanelOpen, wasFilterPanelOpen])

  const appliedFiltersCount = filters.filter(({ applied }) => applied).length

  const { recordCount, matchingRecordCount } = summaryOfRecords ?? {}

  return (
    <DataToolbarDiv isFilterPanelOpen={isFilterPanelOpen}>
      <ContainerForRadioButtons>
        <RadioButton
          forView={View.map}
          currentView={view}
          changeView={changeView}
          label="Map"
        />
        <RadioButton
          forView={View.globe}
          currentView={view}
          changeView={changeView}
          label="Globe"
        />
        <RadioButton
          forView={View.table}
          currentView={view}
          changeView={changeView}
          label="Table"
        />
      </ContainerForRadioButtons>
      {view === View.table && (
        <ContainerForFilterPanelLauncher>
          <FilterPanelLauncher
            selected={isFilterPanelOpen}
            ref={filterPanelLauncherRef}
            onClick={() => {
              setIsFilterPanelOpen(prev => !prev)
            }}
            aria-controls="pharos-filter-panel"
          >
            Filters
            {appliedFiltersCount > 0 && (
              <span style={{ marginLeft: '5px' }}>({appliedFiltersCount})</span>
            )}
          </FilterPanelLauncher>
        </ContainerForFilterPanelLauncher>
      )}
      {view === View.table && recordCount !== undefined && (
        <>
          {
            <DataDownloadButton
              matchingRecordCount={matchingRecordCount}
              filters={filters}
            />
          }
          {
            // <SummaryOfRecordsStyled
            //   role="status"
            //   aria-live="polite"
            //   aria-atomic="true"
            // >
            //   {matchingRecordCount !== undefined && appliedFiltersCount > 0 && (
            //     <>{addCommasToNumber(matchingRecordCount)} of </>
            //   )}
            //   {addCommasToNumber(recordCount)} records
            // </SummaryOfRecordsStyled>
          }
        </>
      )}
    </DataToolbarDiv>
  )
}

export default DataToolbar
