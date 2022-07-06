import React from 'react'
import styled from 'styled-components'
import useDatasets from 'hooks/useDatasets'
import { Link } from 'react-router-dom'

const Container = styled.div``

const DatasetsTable = () => {
  const [datasets] = useDatasets()

  if (!datasets) return <p>Loading datasets</p>

  return (
    <Container>
      <ul>
        {Object.entries(datasets).map(([id, dataset]) => (
          <li>
            <Link to={`/dataset/${id}`}>{dataset.name}</Link>
          </li>
        ))}
      </ul>
    </Container>
  )
}

export default DatasetsTable
