import loadVersionRaw from 'api/loadVersionRaw'
import { useEffect } from 'react'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import { Record, VersionStatus } from 'reducers/projectReducer/types'
import useDataset from './useDatset'
import useProject from './useProject'
import useUser from './useUser'

const useActiveVersion = (datasetID: string | undefined) => {
  const [user] = useUser()
  const [, projectDispatch] = useProject()
  const dataset = useDataset(datasetID)

  // get the s3 key of the active version
  const versionKey = dataset?.versions?.[dataset.activeVersion]?.key

  // check if the version locally contains rows
  const localData = Boolean(
    dataset?.versions?.[dataset.activeVersion]?.rows?.length
  )

  const researcherID = user.data?.researcherID

  // this whole thing needs to be moved to a useVersion() hook
  // which will return a version either locally or from the server
  useEffect(() => {
    const loadVersionContent = async () => {
      if (!versionKey) return null
      if (!researcherID) return null

      projectDispatch({
        type: ProjectActions.SetVersionStatus,
        payload: {
          datasetID: datasetID,
          status: VersionStatus.Loading,
        },
      })

      const rows = await loadVersionRaw(researcherID, versionKey)

      if (rows) {
        projectDispatch({
          type: ProjectActions.UpdateVersion,
          payload: {
            datasetID,
            version: {
              rows: rows as Record[],
              status: VersionStatus.Saved,
            },
          },
        })
      } else {
        projectDispatch({
          type: ProjectActions.SetVersionStatus,
          payload: {
            datasetID,
            status: VersionStatus.Error,
          },
        })
      }
    }

    if (versionKey && !localData) loadVersionContent()
  }, [researcherID, datasetID, versionKey, localData, projectDispatch])
}

export default useActiveVersion
