import React from 'react'

import Papa from 'papaparse'
import { FileUploader } from 'react-drag-drop-files'

import { RegisterStatus } from 'reducers/projectReducer/types'

import { ProjectActions } from 'reducers/projectReducer/projectReducer'

import useUser from 'hooks/useUser'
import useProjectDispatch from 'hooks/project/useProjectDispatch'
import useDatasetID from 'hooks/dataset/useDatasetID'
import parseFile from './parse'
import useProject from 'hooks/project/useProject'

// import saveVersion from 'api/uploadVersion'

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
