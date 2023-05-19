import React from 'react'
import styled from 'styled-components'
import { FileUploader } from 'react-drag-drop-files'
import useUpdateRegisterFromCSV from './useUpdateRegisterFromCSV'

// import useUser from 'hooks/useUser'
// import useDatasetID from 'hooks/dataset/useDatasetID'
// import useDispatch from 'hooks/useDispatch'

// import parseFile from './parse'

const fileTypes = ['CSV']

const Container = styled.div`
  filter: hue-rotate(309deg) brightness(1.75) saturate(0.25) contrast(1.5);

  // These styles are just a temporary cludge
  // to make this controll smaller until we
  // make the toolbar system.
  > label {
    min-width: unset !important;

    > div > span:first-child > span:first-child {
      display: none;
    }

    > div > span:nth-child(2) {
      padding-left: 0.75ex;
    }
  }
`

const CSVUploader = () => {
  const updateRegisterFromCSV = useUpdateRegisterFromCSV()
  // const user = useUser()
  // const datasetID = useDatasetID()
  // const projectDispatch = useDispatch()

  const handleChange = (file: File) => {
    updateRegisterFromCSV(file)
  }

  return (
    <Container>
      <FileUploader
        multiple={false}
        handleChange={handleChange}
        name="file"
        types={fileTypes}
        label="Upload"
      />
    </Container>
  )
}

export default CSVUploader
