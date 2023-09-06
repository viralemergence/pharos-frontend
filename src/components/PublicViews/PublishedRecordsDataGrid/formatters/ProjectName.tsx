import React from 'react'
import { FormatterProps } from 'react-data-grid'
import { Row } from '../PublishedRecordsDataGrid'
import { DataGridLink } from './DisplayComponents'

const ProjectName = ({ row }: FormatterProps<Row>) => {
  const projectName = row['Project'] as string
  const pharosID = row.pharosID
  return (
    <DataGridLink to={`/projects/#/${pharosID.toString().split('-')[0]}`}>
      {projectName}
    </DataGridLink>
  )
}

export default ProjectName
