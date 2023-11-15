import React from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from 'components/layout/Providers'

import Login from 'components/Authentication/Login/Login'
import NavBar from 'components/layout/NavBar/NavBar'
import RequireAuth from 'components/AuthenticatedViews/RequireAuth'

import DatasetEditor from 'components/AuthenticatedViews/DatasetEditor/DatasetEditor'
import ProjectPage from 'components/AuthenticatedViews/ProjectPage/ProjectPage'

import ProjectList from 'components/AuthenticatedViews/PortfolioPage/PortfolioPage'
import ModalMessageProvider from 'hooks/useModal/ModalMessageProvider'
import DataLoader from 'components/AuthenticatedViews/DataLoader'
import SignUp from 'components/Authentication/SignUp/SignUp'
import ResetPassword from 'components/Authentication/ResetPassword/ResetPassword'

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
            <Route path={'/sign-up'} element={<SignUp />} />
            <Route path={'/login'} element={<Login />} />
            <Route path={'/reset-password'} element={<ResetPassword />} />
            <Route
              path={'/projects/:projectID/:datasetID'}
              element={
                <RequireAuth>
                  <DataLoader>
                    <ModalMessageProvider>
                      <DatasetEditor />
                    </ModalMessageProvider>
                  </DataLoader>
                </RequireAuth>
              }
            />
            <Route
              path={'/projects/:projectID'}
              element={
                <RequireAuth>
                  <DataLoader>
                    <ModalMessageProvider>
                      <ProjectPage />
                    </ModalMessageProvider>
                  </DataLoader>
                </RequireAuth>
              }
            />
            <Route
              path={'/projects'}
              element={
                <RequireAuth>
                  <DataLoader>
                    <ModalMessageProvider>
                      <ProjectList />
                    </ModalMessageProvider>
                  </DataLoader>
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
