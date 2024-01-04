import {
  APIRoutes,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'
import { ActionFunction, StateActions } from '../stateReducer'
import { Datapoint, DatasetID, NodeStatus, ProjectID, Register, ServerRecordMeta } from '../types'

interface UpdateRegisterActionPayload {
  source: 'local' | 'remote' | 'csv'
  data: Register
  datasetID: DatasetID
  projectID: ProjectID
}

export interface UpdateRegisterAction {
  type: StateActions.UpdateRegister
  payload: UpdateRegisterActionPayload
}

const mergeDatapoint = (
  local: Datapoint | undefined,
  remote: Datapoint | undefined
): Datapoint | undefined => {
  // base case; if one is undefined return the other, if both are undefined
  // return undefined. no further merge is necessary because all previous
  // datapoints are already in order in the linked list.
  if (!local) return remote
  if (!remote) return local

  // parse timestamps as numbers (they get converted to strings in the API)
  const [localTime, remoteTime] = [
    Number(local.version),
    Number(remote.version),
  ]

  // if the timestamps match, prefer remote datapoint
  // to keep latest from remote such as validation report
  if (localTime === remoteTime)
    return {
      ...remote,
      previous: mergeDatapoint(local.previous, remote.previous),
    }

  // if local is newer, return local, and set previous to
  // the merge of local.previous and remote
  if (localTime > remoteTime)
    return { ...local, previous: mergeDatapoint(local.previous, remote) }

  // if remote is newer, return right and set previous
  // to the merge of remote.previous and local
  return { ...remote, previous: mergeDatapoint(local, remote.previous) }
}

const updateRegister: ActionFunction<UpdateRegisterActionPayload> = (
  state,
  payload
) => {
  const { data: register, source, datasetID, projectID } = payload

  // if the register is empty, short-circuit merging
  if (Object.entries(register).length === 0) return state

  // if we're loading from the indexedDB we can just set it directly
  if (source === 'local') {
    return {
      ...state,
      register: {
        ...state.register,
        data: register,
      },
    }
  }

  // if source is CSV, it's already been merged so we can
  // set it directly and then save to both local and remote
  if (source === 'csv') {
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
        [`${APIRoutes.saveRegister}_${datasetID}_remote`]: {
          route: APIRoutes.saveRegister,
          status: StorageMessageStatus.Initial,
          data: { register, datasetID, projectID },
          target: 'remote',
        },
      },
    }
  }

  // if source is remote and current state is empty, just set it and save to local
  if (source === 'remote' && Object.entries(state.register.data).length === 0) {
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

  // if source is remote and we have a register already loaded we need to merge them
  console.time(`${'[MERGE]'.padEnd(15)} Merge Register`)
  const nextRegister: Register = {}
  // take the union of unique keys in the local and remote registers
  const keys = new Set([...Object.keys(register), ...Object.keys(state.register.data)])
  // iterate over the records in the register
  for (const recordID of keys) {
    const remoteRecord = register[recordID]
    // copy local record into next register
    nextRegister[recordID] = { ...state.register.data[recordID] }
    // iterate over the datapoints in the record
    if (remoteRecord)
      for (const [datapointID, remoteDatapoint] of Object.entries(remoteRecord)) {
        if (datapointID === "_meta")
          nextRegister[recordID][datapointID] = nextRegister[recordID][datapointID] ?? remoteDatapoint as ServerRecordMeta
        else
          // merge the two datapoints;
          // The result of the merge is coerced to Datapoint because we can't
          // reach this point if both local and remote datapoints are undefined
          // and the merge of at least one defined datapoint always returns Datapoint
          nextRegister[recordID][datapointID] = mergeDatapoint(
            // local record is the one we just copied into the nextRegister
            nextRegister[recordID][datapointID] as Datapoint,
            remoteDatapoint as Datapoint
          )!
      }
  }
  console.timeEnd(`${'[MERGE]'.padEnd(15)} Merge Register`)

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
        data: { register: nextRegister, datasetID },
        target: 'local',
      },
    },
  }
}

export default updateRegister
