import React from 'react'
import { useParams } from 'react-router-dom'

import Papa from 'papaparse'
import { FileUploader } from 'react-drag-drop-files'

import { RegisterStatus } from 'reducers/projectReducer/types'

import { ProjectActions } from 'reducers/projectReducer/projectReducer'

import useProject from 'hooks/project/useProject'
import useUser from 'hooks/useUser'

// import saveVersion from 'api/uploadVersion'

const fileTypes = ['CSV']

const Uploader = () => {
  const { id: datasetID } = useParams()
  const user = useUser()
  const [, projectDispatch] = useProject()

  if (!datasetID) throw new Error('datasetID not found in url')

  const handleChange = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: async results => {
        const plainRows = results.data as { [key: string]: string }[]

        console.log(
          'do some parsing with plainRows to integrate into the register'
        )

        // const rows = plainRows.map(row =>
        //   Object.entries(row).reduce(
        //     (acc, [key, val]) => ({
        //       ...acc,
        //       [key]: { value: val },
        //     }),
        //     {}
        //   )
        // )

        console.log('version status should be saving')
        projectDispatch({
          type: ProjectActions.SetRegisterStatus,
          payload: {
            datasetID,
            status: RegisterStatus.Saving,
          },
        })

        // create a version
        projectDispatch({
          type: ProjectActions.CreateVersion,
          payload: {
            datasetID,
            version: {
              date: String(new Date().toUTCString()),
              name: String(new Date().toUTCString()),
            },
          },
        })

        const researcherID = user.data?.researcherID
        if (!researcherID) throw new Error('User data not found')

        // const newVersionInfo = await saveVersion(
        //   rows,
        //   datasetID,
        //   researcherID,
        //   date
        // )

        console.log('save register to the server here')
        const saved = true

        if (saved) {
          projectDispatch({
            type: ProjectActions.SetRegisterStatus,
            payload: {
              datasetID,
              status: RegisterStatus.Saved,
            },
          })
        } else {
          projectDispatch({
            type: ProjectActions.SetRegisterStatus,
            payload: {
              datasetID,
              status: RegisterStatus.Error,
            },
          })
        }
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
        label="Upload or drop new version"
      />
    </div>
  )
}

export default Uploader
