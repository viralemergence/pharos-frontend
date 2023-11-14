import React from 'react'
import { navigate } from 'gatsby'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from 'components/layout/Providers'
import NavBar from 'components/layout/NavBar/NavBar'
import DatasetPage from 'components/PublicViews/DatasetPage/DatasetPage'
import ModalMessageProvider from 'hooks/useModal/ModalMessageProvider'
import ProjectPage from 'components/PublicViews/ProjectPage/ProjectPage'

const Projects = () => {
  // // on the build server, don't try to render client-side routes
  // if (typeof window === 'undefined') return <></>

  const params =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams('')

  const projectID = params.get('prj')

  if (typeof window !== 'undefined' && !projectID) navigate('/')

  const datasetID = params.get('set')

  return (
    <Providers>
      <CMS.SEO />
      <React.StrictMode>
        <NavBar />
        <ModalMessageProvider>
          {datasetID ? <DatasetPage /> : <ProjectPage />}
        </ModalMessageProvider>
      </React.StrictMode>
    </Providers>
  )
}

export default Projects
