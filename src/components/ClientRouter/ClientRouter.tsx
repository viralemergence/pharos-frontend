import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

import DatasetEditor from 'components/AuthenticatedViews/DatasetEditor/DatasetEditor'
import ResearcherHome from 'components/AuthenticatedViews/ResearcherHome/ResearcherHome'
import Login from 'components/Login/Login'
import RequireAuth from './RequireAuth'
import NavBar from 'components/layout/NavBar/NavBar'

const ClientRouter = () => (
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
)

export default ClientRouter
