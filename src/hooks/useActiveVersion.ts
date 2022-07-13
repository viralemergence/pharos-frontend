import loadVersionRows from 'api/loadVersionRows'
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

  if (
    datasetID &&
    dataset &&
    dataset.versions &&
    dataset.versions.length === 0
  ) {
    const sampleRows: Record[] = [
      {
        DetectionID: { displayValue: '', dataValue: '' },
        SampleID: { displayValue: '', dataValue: '' },
        DetectionMethod: { displayValue: '', dataValue: '' },
        DetectionOutcome: { displayValue: '', dataValue: '' },
        DetectionComments: { displayValue: '', dataValue: '' },
        PathogenTaxID: { displayValue: '', dataValue: '' },
        GenbankAccession: { displayValue: '', dataValue: '' },
        SRAAccession: { displayValue: '', dataValue: '' },
        GISAIDAccession: { displayValue: '', dataValue: '' },
        GBIFIdentifier: { displayValue: '', dataValue: '' },
      },
    ]
    projectDispatch({
      type: ProjectActions.CreateVersion,
      payload: {
        datasetID: datasetID,
        version: {
          status: VersionStatus.Unsaved,
          date: new Date().toUTCString(),
          rows: sampleRows,
        },
      },
    })
  }

  const researcherID = user.data?.researcherID

  useEffect(() => {
    const loadVersionContent = async () => {
      // condition where we can't or don't need to load a version
      if (!versionKey || !researcherID || !datasetID || localData) return null

      projectDispatch({
        type: ProjectActions.SetVersionStatus,
        payload: {
          datasetID,
          status: VersionStatus.Loading,
        },
      })

      const rows = await loadVersionRows(researcherID, versionKey)

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

    loadVersionContent()
  }, [researcherID, datasetID, versionKey, localData, projectDispatch])
}

export default useActiveVersion
