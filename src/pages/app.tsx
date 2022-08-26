import React from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from 'components/layout/Providers'

import Login from 'components/Login/Login'
import NavBar from 'components/layout/NavBar/NavBar'
import RequireAuth from 'components/AuthenticatedViews/RequireAuth'

import DatasetEditor from 'components/AuthenticatedViews/DatasetEditor/DatasetEditor'
import ProjectPage from 'components/AuthenticatedViews/ProjectPage/ProjectPage'

import ProjectContextProvider from 'reducers/projectReducer/projectContext'
import ProjectList from 'components/AuthenticatedViews/PortfolioPage/PortfolioPage'
import ModalMessageProvider from 'hooks/useModal/ModalMessageProvider'

const App = (): JSX.Element => {
  // on the build server, don't try to render the app
  if (typeof window === 'undefined') return <></>

  return (
    <Providers>
      <CMS.SEO />
      <React.StrictMode>
        <HashRouter>
          <NavBar />
          <Routes>
            <Route path={'/login'} element={<Login />} />
            <Route
              path={'/projects/:projectID/:datasetID'}
              element={
                <RequireAuth>
                  <ProjectContextProvider>
                    <ModalMessageProvider>
                      <DatasetEditor />
                    </ModalMessageProvider>
                  </ProjectContextProvider>
                </RequireAuth>
              }
            />
            <Route
              path={'/projects/:projectID'}
              element={
                <RequireAuth>
                  <ProjectContextProvider>
                    <ModalMessageProvider>
                      <ProjectPage />
                    </ModalMessageProvider>
                  </ProjectContextProvider>
                </RequireAuth>
              }
            />
            <Route
              path={'/projects'}
              element={
                <RequireAuth>
                  <ProjectContextProvider>
                    <ModalMessageProvider>
                      <ProjectList />
                    </ModalMessageProvider>
                  </ProjectContextProvider>
                </RequireAuth>
              }
            />
            <Route path={`/`} element={<Navigate to={`/projects`} />} />
          </Routes>
        </HashRouter>
      </React.StrictMode>
    </Providers>
  )
}

export default App
