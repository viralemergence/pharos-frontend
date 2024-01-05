import { useEffect } from 'react'
import localforage from 'localforage'

import useDispatch from 'hooks/useDispatch'

import { DatasetID, NodeStatus, ProjectID, Register } from 'reducers/stateReducer/types'
import { StateActions } from 'reducers/stateReducer/stateReducer'

import useAppState from 'hooks/useAppState'
import useDatasetID from 'hooks/dataset/useDatasetID'
import useProjectID from 'hooks/project/useProjectID'
import { Auth } from 'aws-amplify'
import useDataset from 'hooks/dataset/useDataset'

interface LoadRecordsBody {
  datasetID: DatasetID
  projectID: ProjectID
  registerPage: string
  lastUpdated?: string
}

const useLoadRegister = () => {
  const datasetID = useDatasetID()
  const projectID = useProjectID()
  const dispatch = useDispatch()
  const dataset = useDataset()

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
        projectID,
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
  }, [projectID, datasetID, dispatch])

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
            projectID,
            datasetID,
            source: 'local',
            data: localRegister,
          },
        })
    }

    loadLocalDatasets()
  }, [projectID, datasetID, dispatch])

  const registerPages = dataset.registerPages

  useEffect(() => {
    if (!datasetID) return
    if (!dataset) return
    const requestRegister = async () => {
      // skip loading if:
      if (
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

      if (!dataset.datasetID) return

      dispatch({
        type: StateActions.SetMetadataObjStatus,
        payload: {
          key: 'register',
          status: NodeStatus.Loading,
        },
      })

      // if this dataset has a paginated register,
      // load new records from the /load-records route.
      if (registerPages) {
        // check if local register exists
        const localRegister = (await localforage.getItem(
          `${datasetID}-register`
        )) as Register | null

        for (const [registerPage, { lastUpdated }] of Object.entries(registerPages)) {
          console.log(`${'[API]'.padEnd(15)} Request:  /load-records`)


          const requestBody: LoadRecordsBody = {
            datasetID, projectID, registerPage
          }

          if (localRegister !== null) {
            requestBody.lastUpdated = lastUpdated
          }

          const response = await fetch(
            `${process.env.GATSBY_API_URL}/load-records`,
            {
              method: 'POST',
              headers: new Headers({
                Authorization: userSession.getIdToken().getJwtToken(),
                'Content-Type': 'application/json',
              }),
              body: JSON.stringify(requestBody),
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

          // safety guard to cancel synchronizing if the user navigates
          // to a different dataset before the request completes
          const currentDatasetID = window.location.hash.split('/').slice(-1)[0]
          if (currentDatasetID !== requestBody.datasetID) return

          console.log(
            `${'[API]'.padEnd(15)} Response: /load-records page ${registerPage}: ${response?.status}`
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

          if (remoteRegister && typeof remoteRegister === 'object' &&
            'register' in remoteRegister &&
            typeof remoteRegister?.register === 'object'

          ) {
            if (
              remoteRegister.register !== null &&
              Object.entries(remoteRegister.register).length > 0
            )
              dispatch({
                type: StateActions.UpdateRegister,
                payload: {
                  projectID,
                  datasetID,
                  source: 'remote',
                  data: remoteRegister.register as Register,
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
      } else {


        // if the dataset does not have a paginated register,
        // load the register using the legacy /load-register route
        console.log(`${'[API]'.padEnd(15)} Request:  /load-register`)
        const response = await fetch(
          `${process.env.GATSBY_API_URL}/load-register`,
          {
            method: 'POST',
            headers: new Headers({
              Authorization: userSession.getIdToken().getJwtToken(),
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify({ datasetID, projectID }),
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
                projectID,
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
                projectID,
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
    }

    requestRegister()
  }, [projectID, datasetID, status, dispatch, registerPages])
}

export default useLoadRegister
