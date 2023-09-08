import React from 'react'
import { FormatterProps } from 'react-data-grid'

import { PublishedRecordsResearcher, Row } from '../PublishedRecordsDataGrid'

import { DataGridLink } from './DisplayComponents'

const Researcher = ({ row }: FormatterProps<Row>) => (
  <div>
    {(row.Researcher as PublishedRecordsResearcher[]).map(researcher => (
      <DataGridLink
        key={researcher.researcherID}
        to={`/researchers/?researcherID=${researcher.researcherID}`}
      >
        {researcher.name}
      </DataGridLink>
    ))}
  </div>
)

export default Researcher
