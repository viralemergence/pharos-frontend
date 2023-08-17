import React from 'react'
import { FormatterProps } from 'react-data-grid'

import { PublishedRecordsAuthor, Row } from '../PublishedRecordsDataGrid'

import { DataGridLink } from './DisplayComponents'

const Author = ({ row }: FormatterProps<Row>) => (
  <div>
    {(row.Author as PublishedRecordsAuthor[]).map(author => (
      <DataGridLink
        key={author.researcherID}
        to={`/researchers/?researcherID=${author.researcherID}`}
      >
        {author.name}
      </DataGridLink>
    ))}
  </div>
)

export default Author
