import React from 'react'

import CMS from 'components/library/airtable-cms'
import Providers from 'components/layout/Providers'
import NavBar from 'components/layout/NavBar/NavBar'

import ResearchersListPage from 'components/PublicViews/Researchers/ResearchersListPage/ResearchersListPage'

const Researchers = () => {
  // on the build server, don't try to render client-side routes
  if (typeof window === 'undefined') return <></>

  return (
    <Providers>
      <CMS.SEO />
      <React.StrictMode>
        <NavBar />
        <ResearchersListPage />
      </React.StrictMode>
    </Providers>
  )
}

export default Researchers
