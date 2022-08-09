import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from 'components/layout/Providers'

import Login from 'components/Login/Login'
import NavBar from 'components/layout/NavBar/NavBar'
import RequireAuth from 'components/AuthenticatedViews/RequireAuth'

import DatasetEditor from 'components/AuthenticatedViews/DatasetEditor/DatasetEditor'
import ProjectPage from 'components/AuthenticatedViews/ProjectPage/ProjectPage'

import ProjectContextProvider from 'reducers/projectReducer/projectContext'
import ProjectList from 'components/AuthenticatedViews/PortfolioPage/PortfolioPage'

const App = (): JSX.Element => {
  // on the build server, don't try to render the app
  if (typeof window === 'undefined') return <></>

  return (
    <Providers>
      <CMS.SEO />
      <ProjectContextProvider>
        <HashRouter>
          <NavBar />
          <Routes>
            <Route path={'/login'} element={<Login />} />
            <Route
              path={'/project/:projectID/:datasetID'}
              element={
                <RequireAuth>
                  <DatasetEditor />
                </RequireAuth>
              }
            />
            <Route
              path={'/project/:projectID'}
              element={
                <RequireAuth>
                  <ProjectPage />
                </RequireAuth>
              }
            />
            <Route
              path={'/'}
              element={
                <RequireAuth>
                  <ProjectList />
                </RequireAuth>
              }
            />
          </Routes>
        </HashRouter>
      </ProjectContextProvider>
    </Providers>
  )
}

export default App
