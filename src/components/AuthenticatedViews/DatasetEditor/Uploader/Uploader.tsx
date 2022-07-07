import React from 'react'
import Papa from 'papaparse'
import { FileUploader } from 'react-drag-drop-files'

import { DatasetRow } from 'hooks/useDatasets'

const fileTypes = ['CSV']

interface UploaderProps {
  setFile(file: DatasetRow[]): void
}

const Uploader = ({ setFile }: UploaderProps) => {
  const handleChange = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: results => {
        setFile(results.data as DatasetRow[])
      },
    })
  }

  return (
    <div>
      <FileUploader
        multiple={false}
        handleChange={handleChange}
        name="file"
        types={fileTypes}
        label="Upload or drop file"
      />
    </div>
  )
}

export default Uploader
