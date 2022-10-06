import React from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from 'components/layout/Providers'

import Login from 'components/Login/Login'
import NavBar from 'components/layout/NavBar/NavBar'
import RequireAuth from 'components/AuthenticatedViews/RequireAuth'

import DatasetEditor from 'components/AuthenticatedViews/DatasetEditor/DatasetEditor'
import ProjectPage from 'components/AuthenticatedViews/ProjectPage/ProjectPage'

import StateContextProvider from 'reducers/projectReducer/projectContext'
import ProjectList from 'components/AuthenticatedViews/PortfolioPage/PortfolioPage'
import ModalMessageProvider from 'hooks/useModal/ModalMessageProvider'

const App = (): JSX.Element => {
  // on the build server, don't try to render the app
  if (typeof window === 'undefined') return <></>

  return (
    <Providers>
      <CMS.SEO />
      <React.StrictMode>
        <StateContextProvider>
          <ModalMessageProvider>
            <HashRouter>
              <NavBar />
              <Routes>
                <Route path={'/login'} element={<Login />} />
                <Route
                  path={'/projects/:projectID/:datasetID'}
                  element={
                    <RequireAuth>
                      <DatasetEditor />
                    </RequireAuth>
                  }
                />
                <Route
                  path={'/projects/:projectID'}
                  element={
                    <RequireAuth>
                      <ProjectPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path={'/projects'}
                  element={
                    <RequireAuth>
                      <ProjectList />
                    </RequireAuth>
                  }
                />
                <Route path={`/`} element={<Navigate to={`/projects`} />} />
              </Routes>
            </HashRouter>
          </ModalMessageProvider>
        </StateContextProvider>
      </React.StrictMode>
    </Providers>
  )
}

export default App
