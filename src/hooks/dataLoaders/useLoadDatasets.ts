import { Auth } from 'aws-amplify'
import useProject from 'hooks/project/useProject'
import useAppState from 'hooks/useAppState'
import useDispatch from 'hooks/useDispatch'
import localforage from 'localforage'
import { useEffect, useRef } from 'react'
import { StateActions } from 'reducers/stateReducer/stateReducer'
import { Dataset, DatasetReleaseStatus, NodeStatus } from 'reducers/stateReducer/types'

const useLoadDatasets = () => {
  const { projectID, datasetIDs } = useProject()
  const dispatch = useDispatch()

  const {
    datasets: { status, data },
  } = useAppState()

  const datasetsPoller = useRef<NodeJS.Timeout | null>()

  const releasingDatasets = Object.values(data).some(
    dataset => dataset.releaseStatus === DatasetReleaseStatus.Releasing
  )

  useEffect(() => {
    const invalidateDatasets = () => {
      dispatch({
        type: StateActions.SetMetadataObjStatus,
        payload: {
          key: 'datasets',
          status: NodeStatus.Initial,
        }
      })

      if (releasingDatasets) {
        datasetsPoller.current = setTimeout(() => {
          invalidateDatasets()
        }, 1000)
      }
    }


    if (!datasetsPoller.current && releasingDatasets) {
      datasetsPoller.current = setTimeout(() => {
        invalidateDatasets()
      }, 1000)
    }

    return () => {
      if (datasetsPoller.current) {
        clearTimeout(datasetsPoller.current)
        datasetsPoller.current = null
      }
    }

  }, [releasingDatasets, dispatch])


  useEffect(() => {
    // just to be safe, set the datasets object
    // to empty while we query the local DB
    dispatch({
      type: StateActions.UpdateDatasets,
      payload: {
        source: 'local',
        data: {},
      },
    })

    // set status back to initial so it'll pull
    // the latest datasets from the server again
    dispatch({
      type: StateActions.SetMetadataObjStatus,
      payload: {
        key: 'datasets',
        status: NodeStatus.Initial,
      },
    })
  }, [projectID, dispatch])

  // Effect for accessing datasets from local indexedDB
  useEffect(() => {
    const loadLocalDatasets = async () => {
      if (datasetIDs.length === 0) return

      // early return if the project has the same number of datasets
      // loaded as are currently loaded; this happens when a new
      // dataset is created so we don't need to pull from storage
      if (datasetIDs.length === Object.keys(data).length) return

      const localDatasets = (await localforage.getItems(datasetIDs)) as {
        [key: string]: Dataset
      } | null

      if (localDatasets)
        dispatch({
          type: StateActions.UpdateDatasets,
          payload: {
            source: 'local',
            data: localDatasets,
          },
        })
    }
    loadLocalDatasets()
  }, [projectID, data, datasetIDs, dispatch])

  // effect for loading datasets from remote server
  useEffect(() => {
    const loadDatasets = async () => {
      // skip loading if:
      if (
        datasetIDs.length === 0 ||
        status === NodeStatus.Loading ||
        status === NodeStatus.Loaded ||
        status === NodeStatus.Offline
      )
        return

      let userSession
      try {
        userSession = await Auth.currentSession()
      } catch (e) {
        console.error(e)
        return
      }

      dispatch({
        type: StateActions.SetMetadataObjStatus,
        payload: {
          key: 'datasets',
          status: NodeStatus.Loading,
        },
      })

      console.log(`${'[API]'.padEnd(15)} Request:  /list-datasets`)
      const response = await fetch(
        `${process.env.GATSBY_API_URL}/list-datasets`,
        {
          method: 'post',
          headers: new Headers({
            Authorization: userSession.getIdToken().getJwtToken(),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            projectID,
          }),
        }
      ).catch(() => {
        dispatch({
          type: StateActions.SetMetadataObjStatus,
          payload: {
            key: 'datasets',
            status: NodeStatus.Offline,
          },
        })
      })

      console.log(
        `${'[API]'.padEnd(15)} Response: /list-datasets: ${response?.status}`
      )
      if (!response || !response.ok) {
        dispatch({
          type: StateActions.SetMetadataObjStatus,
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
          type: StateActions.UpdateDatasets,
          payload: {
            source: 'remote',
            data: remoteDatsets,
          },
        })

        dispatch({
          type: StateActions.SetMetadataObjStatus,
          payload: {
            key: 'datasets',
            status: NodeStatus.Loaded,
          },
        })
      }
    }

    loadDatasets()
  }, [datasetIDs, projectID, status, dispatch])
}

export default useLoadDatasets
