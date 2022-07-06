import React from 'react'
import styled from 'styled-components'
import useDatasets from 'hooks/useDatasetList'
import { Link } from 'react-router-dom'

const Container = styled.div``

const DatasetsTable = () => {
  const [datasets] = useDatasets()

  if (!datasets) return <p>Loading datasets</p>

  return (
    <Container>
      <ul>
        {datasets.map(dataset => (
          <li>
            <Link to={`/dataset/${dataset.datasetID}`}>{dataset.name}</Link>
          </li>
        ))}
      </ul>
    </Container>
  )
}

export default DatasetsTable
