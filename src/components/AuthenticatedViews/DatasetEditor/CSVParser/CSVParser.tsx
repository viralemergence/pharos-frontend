import React from 'react'
import { FileUploader } from 'react-drag-drop-files'

import useUser from 'hooks/useUser'
import useDatasetID from 'hooks/dataset/useDatasetID'
import useProjectDispatch from 'hooks/project/useProjectDispatch'
import useProject from 'hooks/project/useProject'

import parseFile from './parse'

const fileTypes = ['CSV']

const CSVParser = () => {
  const user = useUser()
  const project = useProject()
  const datasetID = useDatasetID()
  const projectDispatch = useProjectDispatch()

  const handleChange = (file: File) => {
    parseFile({ file, project, datasetID, projectDispatch, user })
  }

  return (
    <div>
      <FileUploader
        multiple={false}
        handleChange={handleChange}
        name="file"
        types={fileTypes}
        label="Upload or drop new version"
      />
    </div>
  )
}

export default CSVParser
