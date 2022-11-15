import {
  APIRoutes,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'
import { ActionFunction, StateActions } from '../stateReducer'
import { DatasetID, NodeStatus, Register } from '../types'

interface SetRegisterActionPayload {
  source: 'local' | 'remote'
  data: Register
  datasetID: DatasetID
}

export interface SetRegisterAction {
  type: StateActions.SetRegister
  payload: SetRegisterActionPayload
}

const setRegister: ActionFunction<SetRegisterActionPayload> = (
  state,
  payload
) => {
  const { data: register, source, datasetID } = payload

  // if we're loading from the indexedDB we can just set it directly
  if (source === 'local') {
    console.log('setRegister: local, set directly')
    return {
      ...state,
      register: {
        ...state.register,
        data: register,
      },
    }
  }

  // if source is remote and current state is empty, just set it and save to local
  if (source === 'remote' && Object.entries(state.register.data).length === 0) {
    console.log('setRegister: remote, but local is empty, set directly')
    return {
      ...state,
      register: {
        ...state.register,
        data: register,
      },
      messageStack: {
        ...state.messageStack,
        [`${APIRoutes.saveRegister}_${datasetID}_local`]: {
          route: APIRoutes.saveRegister,
          status: StorageMessageStatus.Initial,
          data: { register, datasetID },
          target: 'local',
        },
      },
    }
  }

  console.log('setRegister: remote, and need to merge')
  // if source is remote and we have a register already loaded we need to merge them
  const nextRegister: Register = {}

  // iterate over the records in the register
  for (const [recordID, remoteRecord] of Object.entries(register)) {
    const localRecord = state.register.data[recordID]
    nextRegister[recordID] = localRecord

    // iterate over the datapoints in the record
    for (const [datapointID, remoteDatapoint] of Object.entries(remoteRecord)) {
      const localDatapoint = localRecord[datapointID]

      // overwrite the local datapoint with the remote datapoint
      nextRegister[recordID][datapointID] = remoteDatapoint

      // if the version strings match, continue (keep local)
      // if (localDatapoint.version === remoteDatapoint.version) continue

      // parse the version strings into numbers
      const localDate = Number(localRecord.version || 0)
      const remoteDate = Number(remoteRecord.version || 0)

      // if the local one is newer keep that
      if (localDate > remoteDate) {
        nextRegister[recordID][datapointID] = localDatapoint
        continue
      }
    }
  }

  return {
    ...state,
    register: {
      status: NodeStatus.Loaded,
      data: nextRegister,
    },
    messageStack: {
      ...state.messageStack,
      [`${APIRoutes.saveRegister}_${datasetID}_local`]: {
        route: APIRoutes.saveRegister,
        status: StorageMessageStatus.Initial,
        data: { register, datasetID },
        target: 'local',
      },
    },
  }
}

export default setRegister
