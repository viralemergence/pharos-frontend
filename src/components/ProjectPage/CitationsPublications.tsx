import React from 'react'

interface CitationsPublicationsProps {
  project: {
    projectPublications?: string[]
    othersCiting?: string[]
    citation?: string
  }
}

const CitationsPublications = ({ project }: CitationsPublicationsProps) => {
  const projectPublications =
    !project.projectPublications || project.projectPublications[0] === '' ? (
      <p>—</p>
    ) : (
      project?.projectPublications?.map(pub => <p>{pub}</p>)
    )

  const othersCiting =
    !project.othersCiting || project.othersCiting[0] === '' ? (
      <p>—</p>
    ) : (
      project?.othersCiting?.map(pub => <p>{pub}</p>)
    )

  return (
    <>
      <h2>How to cite this project</h2>
      <p>{project.citation || '—'}</p>
      <h2>Project publications</h2>
      {projectPublications}
      <h2>Publications citing this project</h2>
      {othersCiting}
    </>
  )
}

export default CitationsPublications
