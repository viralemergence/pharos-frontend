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

  // debugger

  useEffect(() => {
    dispatch({
      type: ProjectActions.UpdateDatasets,
      payload: {
        source: 'local',
        data: {},
      },
    })
  }, [projectID, dispatch])

  useEffect(() => {
    const loadDatasets = async () => {
      // debugger
      // skip loading if:
      console.log('effect runs')
      if (
        // project has no datasets
        datasetIDs.length === 0 ||
        status === NodeStatus.Syncing ||
        status === NodeStatus.Loading
        // if we already tried to load exactly this
        // status === NodeStatus.Synced
      )
        return

      console.log('LOAD DATASETS runs')

      // this needs to be replaced by a status
      // specifically for loading datasets
      dispatch({
        type: ProjectActions.SetAppStateStatus,
        payload: {
          key: 'datasets',
          status: NodeStatus.Loading,
        },
      })

      // dispatch({
      //   type: ProjectActions.UpdateDatasets,
      //   payload: {
      //     source: 'local',
      //     data: {},
      //   },
      // })

      console.log('calling load local')
      console.log({ datasetIDs })
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

      if (status === NodeStatus.Offline) return

      console.log('[API]     Request:  /list-datasets')
      // otherwise, request and sync projects from remote
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
            status: NodeStatus.Synced,
          },
        })
      }
    }

    loadDatasets()
  }, [datasetIDs, projectID, researcherID, status, dispatch])
}

export default useLoadDatasets
