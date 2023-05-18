import React from 'react'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from 'components/layout/Providers'
import { HashRouter, Route, Routes } from 'react-router-dom'
import NavBar from 'components/layout/NavBar/NavBar'
import DatasetPage from 'components/PublicViews/DatasetPage/DatasetPage'
import ModalMessageProvider from 'hooks/useModal/ModalMessageProvider'
import ProjectPage from 'components/PublicViews/ProjectPage/ProjectPage'

const Projects = () => {
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
              path="/:projectID/:datasetID"
              element={
                <ModalMessageProvider>
                  <DatasetPage />
                </ModalMessageProvider>
              }
            />
            <Route
              path="/:projectID"
              element={
                <ModalMessageProvider>
                  <ProjectPage />
                </ModalMessageProvider>
              }
            />
          </Routes>
        </HashRouter>
      </React.StrictMode>
    </Providers>
  )
}

export default Projects
