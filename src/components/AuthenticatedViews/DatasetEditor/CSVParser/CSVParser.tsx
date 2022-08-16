import React from 'react'
import styled from 'styled-components'
import { FileUploader } from 'react-drag-drop-files'

import useUser from 'hooks/useUser'
import useDatasetID from 'hooks/dataset/useDatasetID'
import useProjectDispatch from 'hooks/project/useProjectDispatch'

import parseFile from './parse'

const fileTypes = ['CSV']

const Container = styled.div`
  filter: hue-rotate(309deg) brightness(1.75) saturate(0.25) contrast(1.5);
`

const CSVParser = () => {
  const user = useUser()
  const datasetID = useDatasetID()
  const projectDispatch = useProjectDispatch()

  const handleChange = (file: File) => {
    parseFile({ file, datasetID, projectDispatch, user })
  }

  return (
    <Container>
      <FileUploader
        multiple={false}
        handleChange={handleChange}
        name="file"
        types={fileTypes}
        label="Upload or drop new version"
      />
    </Container>
  )
}

export default CSVParser
