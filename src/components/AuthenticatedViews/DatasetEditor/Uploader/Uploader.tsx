import React from 'react'
import { useParams } from 'react-router-dom'

import Papa from 'papaparse'
import { FileUploader } from 'react-drag-drop-files'

import { DatasetRow, VersionStatus } from 'reducers/datasetsReducer/types'

import { DatasetsActions } from 'reducers/datasetsReducer/datasetsReducer'

import useDatasets from 'hooks/useDatasets'
import useUser from 'hooks/useUser'

import saveVersion from 'api/saveVersion'

const fileTypes = ['CSV']

const Uploader = () => {
  const { id } = useParams()
  const [user] = useUser()
  const [datasets, datasetsDispatch] = useDatasets()

  if (!id) throw new Error('datasetID not found in url')

  const handleChange = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: async results => {
        const rows = results.data as unknown as DatasetRow[]

        console.log(rows)

        datasetsDispatch({
          type: DatasetsActions.CreateVersion,
          payload: {
            datasetID: id,
            raw: rows,
          },
        })

        if (!user.data?.researcherID) throw new Error('User data not found')

        const newVersionInfo = await saveVersion(
          rows,
          id,
          user.data?.researcherID
        )

        const versionID = datasets.datasets[id].activeVersion

        if (newVersionInfo) {
          console.log(datasets.datasets[id].versions[versionID])
          console.log(newVersionInfo)

          datasetsDispatch({
            type: DatasetsActions.UpdateVersion,
            payload: {
              datasetID: id,
              version: {
                ...newVersionInfo,
                status: VersionStatus.Saved,
              },
            },
          })
        } else {
          datasetsDispatch({
            type: DatasetsActions.SetVersionStatus,
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
