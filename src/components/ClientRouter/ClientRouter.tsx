import React from 'react'

import { UserStatus, View } from 'components/Login/UserContextProvider'
import useUser from 'hooks/useUser'

import LoggedOutLanding from 'components/LoggedOutLanding/LoggedOutLanding'
import DatasetEditor from 'components/AuthenticatedViews/DatasetEditor/DatasetEditor'
import ResearcherHome from 'components/AuthenticatedViews/ResearcherHome/ResearcherHome'

const ClientRouter = () => {
  const [user] = useUser()

  if (user.status === UserStatus.loggedOut) return <LoggedOutLanding />

  switch (user.view) {
    case View.datagrid:
      return <DatasetEditor />
    case View.home:
      return <ResearcherHome />
    default:
      return <ResearcherHome />
  }
}

export default ClientRouter
