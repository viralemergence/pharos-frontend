import React from 'react'
import styled from 'styled-components'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from 'components/layout/Providers'

import NavBar from 'components/layout/NavBar/NavBar'
import MapPage from 'components/MapPage/MapPage'

const DataViewSelectorContainer = styled.div`
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
`
const DataViewSelector = styled.button<{ selected: boolean }>`
  ${({ theme }) => theme.bigParagraph};
  background: none;
  border: none;
  border: 1px solid ${({ theme }) => theme.white};
  color: ${({ selected, theme }) => (selected ? theme.black : theme.white)};

  padding: 10px 35px;
  background-color: ${({ selected, theme }) =>
    selected ? theme.mint : theme.black};

  &:first-child {
    border-top-left-radius: 5em;
    border-bottom-left-radius: 5em;
  }

  &:last-child {
    border-top-right-radius: 5em;
    border-bottom-right-radius: 5em;
  }
`

enum View {
  table,
  map,
}

const Map = (): JSX.Element => {
  const [view, setView] = React.useState<View>(View.map)

  return (
    <Providers>
      <CMS.SEO />
      <NavBar />
      <DataViewSelectorContainer>
        <DataViewSelector
          selected={view === View.map}
          onClick={() => setView(View.map)}
        >
          Map
        </DataViewSelector>
        <DataViewSelector
          selected={view === View.table}
          onClick={() => setView(View.table)}
        >
          Table
        </DataViewSelector>
      </DataViewSelectorContainer>
      <MapPage style={{ display: view === View.map ? 'block' : 'none' }} />
    </Providers>
  )
}

export default Map
