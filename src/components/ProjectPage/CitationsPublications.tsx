import React from 'react'

interface CitationsPublicationsProps {
  project: {
    projectPublications?: string[]
    othersCiting?: string[]
    citation?: string
  }
  published?: boolean
}

const CitationsPublications = ({
  project,
  published,
}: CitationsPublicationsProps) => {
  const showProjectPublications =
    !published ||
    (project.projectPublications && project.projectPublications.length > 0)

  const projectPublications =
    !project.projectPublications || project.projectPublications[0] === '' ? (
      <p>—</p>
    ) : (
      project?.projectPublications?.map(pub => <p key={pub}>{pub}</p>)
    )

  const showOthersCiting =
    !published || (project.othersCiting && project.othersCiting.length > 0)

  const othersCiting =
    !project.othersCiting || project.othersCiting[0] === '' ? (
      <p>—</p>
    ) : (
      project?.othersCiting?.map(pub => <p key={pub}>{pub}</p>)
    )

  return (
    <>
      {(!published || project.citation) && (
        <>
          <h2>How to cite this project</h2>
          <p>{project.citation || '—'}</p>
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
