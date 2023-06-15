import MintButton from 'components/ui/MintButton'
import useModal from 'hooks/useModal/useModal'
import React from 'react'

export const DATASET_LENGTH_LIMIT = 1000

const DatasetLengthExceededModal = () => {
  const setModal = useModal()
  return (
    <div>
      <h2>Dataset length limit exceeded</h2>
      <p>
        Please limit the number of rows in a dataset to {DATASET_LENGTH_LIMIT}{' '}
        or fewer. You may add as many datasets as necessary to your project.
      </p>
      <MintButton onClick={() => setModal(null)}>Ok</MintButton>
    </div>
  )
}

export default DatasetLengthExceededModal
