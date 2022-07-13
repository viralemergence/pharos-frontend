import React from 'react'
import { useParams } from 'react-router-dom'

import Papa from 'papaparse'
import { FileUploader } from 'react-drag-drop-files'

import { VersionStatus } from 'reducers/projectReducer/types'

import { ProjectActions } from 'reducers/projectReducer/projectReducer'

import useProject from 'hooks/useProject'
import useUser from 'hooks/useUser'

import saveVersion from 'api/uploadVersion'

const fileTypes = ['CSV']

const Uploader = () => {
  const { id: datasetID } = useParams()
  const [user] = useUser()
  const [, projectDispatch] = useProject()

  if (!datasetID) throw new Error('datasetID not found in url')

  const handleChange = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: async results => {
        const plainRows = results.data as { [key: string]: string }[]

        const rows = plainRows.map(row =>
          Object.entries(row).reduce(
            (acc, [key, val]) => ({
              ...acc,
              [key]: { value: val },
            }),
            {}
          )
        )

        // create timestamp for the version
        const date = new Date().toUTCString()

        console.log('version status should be saving')
        projectDispatch({
          type: ProjectActions.CreateVersion,
          payload: {
            datasetID: datasetID,
            version: {
              status: VersionStatus.Saving,
              date,
              rows,
            },
          },
        })

        const researcherID = user.data?.researcherID
        if (!researcherID) throw new Error('User data not found')

        const newVersionInfo = await saveVersion(
          rows,
          datasetID,
          researcherID,
          date
        )

        if (newVersionInfo) {
          projectDispatch({
            type: ProjectActions.UpdateVersion,
            payload: {
              datasetID: datasetID,
              version: {
                ...newVersionInfo,
                status: VersionStatus.Saved,
              },
            },
          })
        } else {
          projectDispatch({
            type: ProjectActions.SetVersionStatus,
            payload: {
              datasetID: datasetID,
              status: VersionStatus.Error,
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
