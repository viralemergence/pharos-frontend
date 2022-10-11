import useProject from 'hooks/project/useProject'
import useAppState from 'hooks/useAppState'
import useDispatch from 'hooks/useDispatch'
import useUser from 'hooks/useUser'
import localforage from 'localforage'
import { useEffect } from 'react'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import { Dataset, NodeStatus } from 'reducers/projectReducer/types'

const useLoadDatasets = () => {
  const { projectID, datasetIDs } = useProject()
  const dispatch = useDispatch()
  const user = useUser()

  const researcherID = user.data?.researcherID
  if (!researcherID) throw new Error('researcherID required for useDatasets')

  const {
    datasets: { status },
  } = useAppState()

  // Effect for accessing datasets from local indexedDB
  useEffect(() => {
    const loadLocalDatasets = async () => {
      if (datasetIDs.length === 0) return

      // just to be safe, set the datasets object
      // to empty while we query the local DB
      dispatch({
        type: ProjectActions.UpdateDatasets,
        payload: {
          source: 'local',
          data: {},
        },
      })

      const localDatasets = (await localforage.getItems(datasetIDs)) as {
        [key: string]: Dataset
      } | null

      if (localDatasets)
        dispatch({
          type: ProjectActions.UpdateDatasets,
          payload: {
            source: 'local',
            data: localDatasets,
          },
        })
    }
    loadLocalDatasets()
  }, [projectID, dispatch, datasetIDs])

  // effect for loading datasets from remote server
  useEffect(() => {
    const loadDatasets = async () => {
      // debugger
      // skip loading if:
      console.log('effect runs')
      console.log({ projectID })
      console.log({ status })
      console.log({ datasetIDs })

      if (
        datasetIDs.length === 0 ||
        status === NodeStatus.Loading ||
        status === NodeStatus.Offline
      )
        return

      console.log('LOAD DATASETS runs')

      dispatch({
        type: ProjectActions.SetAppStateStatus,
        payload: {
          key: 'datasets',
          status: NodeStatus.Loading,
        },
      })

      console.log('[API]     Request:  /list-datasets')
      const response = await fetch(
        `${process.env.GATSBY_API_URL}/list-datasets`,
        {
          method: 'post',
          body: JSON.stringify({
            researcherID,
            projectID,
          }),
        }
      ).catch(() => {
        dispatch({
          type: ProjectActions.SetAppStateStatus,
          payload: {
            key: 'datasets',
            status: NodeStatus.Offline,
          },
        })
      })

      console.log(`[API]     Response: /list-datasets: ${response?.status}`)
      if (!response || !response.ok) {
        dispatch({
          type: ProjectActions.SetAppStateStatus,
          payload: {
            key: 'datasets',
            status: NodeStatus.Offline,
          },
        })
        return
      }

      const remoteDatsets = (await response.json()) as {
        [key: string]: Dataset
      } | null

      if (remoteDatsets) {
        dispatch({
          type: ProjectActions.UpdateDatasets,
          payload: {
            source: 'local',
            data: remoteDatsets,
          },
        })

        dispatch({
          type: ProjectActions.SetAppStateStatus,
          payload: {
            key: 'datasets',
            status: NodeStatus.Loaded,
          },
        })
      }
    }

    loadDatasets()
  }, [datasetIDs, projectID, researcherID, status, dispatch])
}

export default useLoadDatasets
