import MintButton from 'components/ui/MintButton'
import useModal from 'hooks/useModal/useModal'
import React from 'react'
import styled from 'styled-components'

export const DATASET_LENGTH_LIMIT = 50000

const Container = styled.div`
  max-width: 500px;
`

const DatasetLengthExceededModal = () => {
  const setModal = useModal()
  return (
    <Container>
      <h2>Dataset length limit exceeded</h2>
      <p>
        Please limit the number of rows in a dataset to{' '}
        {DATASET_LENGTH_LIMIT.toLocaleString()} or fewer. You may add as many
        datasets as necessary to your project.
      </p>
      <MintButton onClick={() => setModal(null)}>Ok</MintButton>
    </Container>
  )
}

export default DatasetLengthExceededModal
