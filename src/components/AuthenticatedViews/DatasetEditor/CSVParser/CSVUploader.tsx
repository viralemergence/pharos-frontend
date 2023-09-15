import React from 'react'
import styled from 'styled-components'
import { FileUploader } from 'react-drag-drop-files'
import useUpdateRegisterFromCSV from './useUpdateRegisterFromCSV'
import useModal from 'hooks/useModal/useModal'
import MintButton from 'components/ui/MintButton'

// import useUser from 'hooks/useUser'
// import useDatasetID from 'hooks/dataset/useDatasetID'
// import useDispatch from 'hooks/useDispatch'

// import parseFile from './parse'

const fileTypes = ['CSV']

const H1 = styled.h1`
  ${({ theme }) => theme.h3};
  color: ${({ theme }) => theme.black};
  margin-top: 0;
`

const Container = styled.div`
  min-width: 400px;
  margin: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 20px;
`

const ControlWrapper = styled.div`
  filter: hue-rotate(309deg) brightness(1.75) saturate(0.25) contrast(1.5);
  // These styles are just a temporary cludge
  // to make this controll smaller until we
  // make the toolbar system.
  > label {
    min-width: unset !important;

    > div {
      justify-content: flex-start;
    }

    > div > span:first-child > span:first-child {
      display: none;
    }

    > div > span:nth-child(2) {
      padding-left: 0.75ex;
    }
  }
`

const CSVUploader = () => {
  const setModal = useModal()
  const updateRegisterFromCSV = useUpdateRegisterFromCSV()
  // const user = useUser()
  // const datasetID = useDatasetID()
  // const projectDispatch = useDispatch()

  const handleChange = (file: File) => {
    updateRegisterFromCSV(file)
    setModal(null)
  }

  return (
    <Container>
      <H1>Add rows from CSV</H1>
      <ControlWrapper>
        <FileUploader
          multiple={false}
          handleChange={handleChange}
          name="file"
          types={fileTypes}
          label="Upload"
        />
      </ControlWrapper>
      <MintButton
        secondary
        onClick={() => setModal(null)}
        style={{ alignSelf: 'flex-start' }}
      >
        Cancel
      </MintButton>
    </Container>
  )
}

export default CSVUploader
