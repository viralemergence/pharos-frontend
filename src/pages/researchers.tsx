import React from 'react'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from 'components/layout/Providers'
import { HashRouter, Route, Routes } from 'react-router-dom'
import NavBar from 'components/layout/NavBar/NavBar'
import ModalMessageProvider from 'hooks/useModal/ModalMessageProvider'

import ResearchersListPage from 'components/PublicViews/Researchers/ResearchersListPage/ResearchersListPage'
import ResearchersPage from 'components/PublicViews/Researchers/ResearchersPage/ResearcherPage'

const Researchers = () => {
  // on the build server, don't try to render client-side routes
  if (typeof window === 'undefined') return <></>

  return (
    <Providers>
      <CMS.SEO />
      <React.StrictMode>
        <HashRouter>
          <NavBar />
          <Routes>
            <Route
              path="/:researcherID"
              element={
                <ModalMessageProvider>
                  <ResearchersPage />
                </ModalMessageProvider>
              }
            />
            <Route
              path="/"
              element={
                <ModalMessageProvider>
                  <ResearchersListPage />
                </ModalMessageProvider>
              }
            />
          </Routes>
        </HashRouter>
      </React.StrictMode>
    </Providers>
  )
}

export default Researchers
