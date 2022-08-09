import React from 'react'

import ListTable, { HeaderRow } from 'components/ListTable/ListTable'

const ProjectsTable = () => {
  return (
    <ListTable columnTemplate="repeat(7, 1fr)">
      <HeaderRow>
        <div>Project name</div>
        <div>Start date</div>
        <div>Type</div>
        <div>Surveillance type</div>
        <div># of datasets</div>
        <div># of organisms</div>
        <div>Last updated</div>
      </HeaderRow>
    </ListTable>
  )
}

export default ProjectsTable
