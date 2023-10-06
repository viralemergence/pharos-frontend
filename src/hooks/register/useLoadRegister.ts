import { useEffect } from 'react'
import localforage from 'localforage'

import useUser from 'hooks/useUser'
import useDispatch from 'hooks/useDispatch'

import { NodeStatus, Register } from 'reducers/stateReducer/types'
import { StateActions } from 'reducers/stateReducer/stateReducer'

import useAppState from 'hooks/useAppState'
import useDatasetID from 'hooks/dataset/useDatasetID'
import useProjectID from 'hooks/project/useProjectID'
// import { getCognitoSession } from 'components/Authentication/useUserSession'

const useLoadRegister = () => {
  const { researcherID } = useUser()
  const datasetID = useDatasetID()
  const projectID = useProjectID()
  const dispatch = useDispatch()

  const {
    register: { status },
  } = useAppState()

  // set the register empty when the projectID changes
  useEffect(() => {
    if (!datasetID) return
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
    if (!datasetID) return
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
    if (!datasetID) return
    const requestRegister = async () => {
      // skip loading if:
      if (
        status === NodeStatus.Loading ||
        status === NodeStatus.Loaded ||
        status === NodeStatus.Offline
      )
        return

      // let userSession
      // try {
      //   userSession = await getCognitoSession()
      // } catch (e) {
      //   console.error(e)
      //   return
      // }

      dispatch({
        type: StateActions.SetMetadataObjStatus,
        payload: {
          key: 'register',
          status: NodeStatus.Loading,
        },
      })

      console.log(`${'[API]'.padEnd(15)} Request:  /load-register`)
      const response = await fetch(
        `${process.env.GATSBY_API_URL}/load-register`,
        {
          method: 'POST',
          // headers: new Headers({
          //   Authorization: userSession.getIdToken().getJwtToken(),
          //   'Content-Type': 'application/json',
          // }),
          body: JSON.stringify({ researcherID, datasetID, projectID }),
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

      console.log(
        `${'[API]'.padEnd(15)} Response: /load-register: ${response?.status}`
      )
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

      const remoteRegister = await response.json()

      if (remoteRegister && typeof remoteRegister === 'object') {
        // current regster format has {register: Register} as the top level object
        if (
          'register' in remoteRegister &&
          typeof remoteRegister?.register === 'object'
        ) {
          dispatch({
            type: StateActions.UpdateRegister,
            payload: {
              datasetID,
              source: 'remote',
              data: remoteRegister.register as Register,
            },
          })
        } else {
          // fallback for old format; top level object keys are records
          dispatch({
            type: StateActions.UpdateRegister,
            payload: {
              datasetID,
              source: 'remote',
              data: remoteRegister as Register,
            },
          })
        }
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
  }, [researcherID, projectID, datasetID, status, dispatch])
}

export default useLoadRegister
