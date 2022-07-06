import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from 'components/layout/Providers'

import Login from 'components/Login/Login'
import NavBar from 'components/layout/NavBar/NavBar'
import RequireAuth from 'components/ClientRouter/RequireAuth'

import DatasetEditor from 'components/AuthenticatedViews/DatasetEditor/DatasetEditor'
import ResearcherHome from 'components/AuthenticatedViews/ResearcherHome/ResearcherHome'

const App = (): JSX.Element => {
  // on the buidl server, don't try to render the app
  if (typeof window === 'undefined') return <></>

  return (
    <Providers>
      <CMS.SEO />
      <HashRouter>
        <NavBar />
        <Routes>
          <Route path={'/login'} element={<Login />} />
          <Route
            path={'/dataset'}
            element={
              <RequireAuth>
                <DatasetEditor />
              </RequireAuth>
            }
          />
          <Route
            path={'/'}
            element={
              <RequireAuth>
                <ResearcherHome />
              </RequireAuth>
            }
          />
        </Routes>
      </HashRouter>
    </Providers>
  )
}

export default App
