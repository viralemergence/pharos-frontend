import ClickToCopy from 'components/ui/ClickToCopy'
import React from 'react'
// import styled from 'styled-components'
import { commaSeparatedList } from 'utilities/grammar'

interface CitationsPublicationsProps {
  project: {
    projectID: string
    projectPublications?: string[]
    othersCiting?: string[]
    citation?: string
    datePublished?: string
    name: string
    authors?: {
      researcherID?: string
      name?: string
    }[]
  }
  published?: boolean
}

// const ProjectLink = styled.a`
//   color: ${({ theme }) => theme.white};
// `

const CitationsPublications = ({
  project,
  published,
}: CitationsPublicationsProps) => {
  const showProjectPublications =
    !published ||
    (project.projectPublications && project.projectPublications[0])

  const projectPublications =
    !project.projectPublications || project.projectPublications[0] === '' ? (
      <p>—</p>
    ) : (
      project?.projectPublications?.map(pub => <p key={pub}>{pub}</p>)
    )

  const showOthersCiting =
    !published || (project.othersCiting && project.othersCiting[0])

  const othersCiting =
    !project.othersCiting || project.othersCiting[0] === '' ? (
      <p>—</p>
    ) : (
      project?.othersCiting?.map(pub => <p key={pub}>{pub}</p>)
    )

  let yearPublished = 'Unpublished'
  if (project.datePublished) {
    yearPublished = new Date(project.datePublished).getFullYear().toString()
  }

  const citationToCopy = `${commaSeparatedList(
    project.authors?.map(author => author?.name ?? '') ?? []
  )}. ${project.name} (${yearPublished}). ${
    window.location.origin
  }/projects/?prj=${project.projectID}. Accessed on ${new Date()
    .toISOString()
    .split('.')[0]
    .split('T')
    .join(' ')} UTC.`

  return (
    <>
      {published && (
        <>
          <h2>How to cite this project</h2>
          <ClickToCopy
            darkmode
            copyContentString={citationToCopy}
            style={{ marginTop: 10 }}
          >
            {commaSeparatedList(
              project.authors?.map(author => author?.name ?? '') ?? []
            )}
            . {project.name} ({yearPublished}). {window.location.hostname}
            /projects/?prj={project.projectID}. Accessed on{' '}
            {new Date().toISOString().split('.')[0].split('T').join(' ')} UTC.
          </ClickToCopy>
        </>
      )}
      {showProjectPublications && (
        <>
          <h2>Project publications</h2>
          {projectPublications}
        </>
      )}
      {showOthersCiting && (
        <>
          <h2>Publications citing this project</h2>
          {othersCiting}
        </>
      )}
    </>
  )
}

export default CitationsPublications
