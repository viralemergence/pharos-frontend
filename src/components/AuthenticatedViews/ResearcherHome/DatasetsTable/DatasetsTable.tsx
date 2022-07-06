import React from 'react'
import styled from 'styled-components'
import useDatasetList from 'hooks/useDatasetList'
import { Link } from 'react-router-dom'

const Container = styled.div``

const DatasetsTable = () => {
  const datasets = useDatasetList()

  if (!datasets) return <p>Loading datasets</p>

  return (
    <Container>
      <ol>
        {datasets.map(dataset => (
          <li>
            <Link to={`/dataset/${dataset.datasetID}`}>{dataset.name}</Link>
          </li>
        ))}
      </ol>
    </Container>
  )
}

export default DatasetsTable
