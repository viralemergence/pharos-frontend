import { useEffect } from 'react'
import localforage from 'localforage'

import useUser from 'hooks/useUser'
import useDispatch from 'hooks/useDispatch'

import { NodeStatus, Register } from 'reducers/stateReducer/types'
import { StateActions } from 'reducers/stateReducer/stateReducer'

import useAppState from 'hooks/useAppState'
import useDatasetID from 'hooks/dataset/useDatasetID'

const useLoadRegister = () => {
  const user = useUser()
  const datasetID = useDatasetID()
  const dispatch = useDispatch()

  const researcherID = user.data?.researcherID
  if (!researcherID) throw new Error('researcherID required for useDatasets')

  const {
    register: { status },
  } = useAppState()

  // set the register empty when the projectID changes
  useEffect(() => {
    dispatch({
      type: StateActions.UpdateRegister,
      payload: {
        source: 'local',
        datasetID,
        data: {},
      },
    })
    dispatch({
      type: StateActions.SetMetadataObjStatus,
      payload: {
        key: 'register',
        status: NodeStatus.Initial,
      },
    })
  }, [datasetID, dispatch])

  // load and process register from indexedDB
  useEffect(() => {
    const loadLocalDatasets = async () => {
      if (!datasetID) return

      const localRegister = (await localforage.getItem(
        `${datasetID}-register`
      )) as Register | null

      if (localRegister)
        dispatch({
          type: StateActions.UpdateRegister,
          payload: {
            datasetID,
            source: 'local',
            data: localRegister,
          },
        })
    }

    loadLocalDatasets()
  }, [datasetID, dispatch])

  useEffect(() => {
    const requestRegister = async () => {
      // skip loading if:
      if (
        status === NodeStatus.Loading ||
        status === NodeStatus.Loaded ||
        status === NodeStatus.Offline
      )
        return

      console.log('[API]     Request:  /load-register')
      const response = await fetch(
        `${process.env.GATSBY_API_URL}/load-register`,
        {
          method: 'POST',
          body: JSON.stringify({ researcherID, datasetID }),
        }
      ).catch(() =>
        dispatch({
          type: StateActions.SetMetadataObjStatus,
          payload: {
            key: 'register',
            status: NodeStatus.Offline,
          },
        })
      )

      console.log(`[API]     Response: /load-register: ${response?.status}`)
      if (!response || !response.ok) {
        dispatch({
          type: StateActions.SetMetadataObjStatus,
          payload: {
            key: 'register',
            status: NodeStatus.Offline,
          },
        })
        return
      }

      const remoteRegister = (await response.json()) as Register | null

      if (remoteRegister) {
        dispatch({
          type: StateActions.UpdateRegister,
          payload: {
            datasetID,
            source: 'remote',
            data: remoteRegister,
          },
        })

        dispatch({
          type: StateActions.SetMetadataObjStatus,
          payload: {
            key: 'register',
            status: NodeStatus.Loaded,
          },
        })
      }
    }

    requestRegister()
  }, [researcherID, datasetID, status, dispatch])
}

export default useLoadRegister
