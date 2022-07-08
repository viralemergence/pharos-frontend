import React from 'react'
import { useParams } from 'react-router-dom'

import Papa from 'papaparse'
import { FileUploader } from 'react-drag-drop-files'

import { Record, VersionStatus } from 'reducers/projectReducer/types'

import { ProjectActions } from 'reducers/projectReducer/projectReducer'

import useProject from 'hooks/useProject'
import useUser from 'hooks/useUser'

import saveVersion from 'api/saveVersion'

const fileTypes = ['CSV']

const Uploader = () => {
  const { id } = useParams()
  const [user] = useUser()
  const [, projectDispatch] = useProject()

  if (!id) throw new Error('datasetID not found in url')

  const handleChange = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: async results => {
        const rows = results.data as unknown as Record[]

        projectDispatch({
          type: ProjectActions.CreateVersion,
          payload: {
            datasetID: id,
            raw: rows,
          },
        })
        projectDispatch({
          type: ProjectActions.SetVersionStatus,
          payload: {
            datasetID: id,
            status: VersionStatus.Saving,
          },
        })

        if (!user.data?.researcherID) throw new Error('User data not found')

        const newVersionInfo = await saveVersion(
          rows,
          id,
          user.data?.researcherID
        )

        if (newVersionInfo) {
          projectDispatch({
            type: ProjectActions.UpdateVersion,
            payload: {
              datasetID: id,
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
              datasetID: id,
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
        label="Upload or drop file"
      />
    </div>
  )
}

export default Uploader
