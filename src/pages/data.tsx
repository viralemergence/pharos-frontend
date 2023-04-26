import React, { useEffect } from 'react'
import styled from 'styled-components'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from 'components/layout/Providers'

import NavBar from 'components/layout/NavBar/NavBar'
import MapPage from 'components/MapView/MapView'

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
    border-left: 0px;
  }
`

enum View {
  table = 'table',
  map = 'map',
}

const Map = (): JSX.Element => {
  const [view, setView] = React.useState<View>(View.map)

  const changeView = (view: View) => {
    window.location.hash = view
    setView(view)
  }

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')

    function hashIsView(hash: string): hash is View {
      return Object.values(View).includes(hash)
    }

    if (hashIsView(hash)) {
      setView(hash)
    }
  }, [])

  return (
    <Providers>
      <CMS.SEO />
      <NavBar />
      <DataViewSelectorContainer>
        <DataViewSelector
          selected={view === View.map}
          onClick={() => changeView(View.map)}
        >
          Map
        </DataViewSelector>
        <DataViewSelector
          selected={view === View.table}
          onClick={() => changeView(View.table)}
        >
          Table
        </DataViewSelector>
      </DataViewSelectorContainer>
      <MapPage style={{ display: view === View.map ? 'block' : 'none' }} />
    </Providers>
  )
}

export default Map
