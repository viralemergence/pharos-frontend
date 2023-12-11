import {
  APIRoutes,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'
import { ActionFunction, StateActions } from '../stateReducer'
import {
  Datapoint,
  DatasetID,
  DatasetReleaseStatus,
  ProjectID,
  RecordID,
  Register,
} from '../types'

export interface SetDatapointPayload {
  projectID: ProjectID
  datasetID: DatasetID
  recordID: RecordID
  datapointID: string
  lastUpdated: string
  datapoint: {
    dataValue: Datapoint['dataValue']
    modifiedBy: Datapoint['modifiedBy']
  }
}

export interface SetDatapointAction {
  type: StateActions.SetDatapoint
  payload: SetDatapointPayload
}

const setDatapoint: ActionFunction<SetDatapointPayload> = (
  state,
  { projectID, datasetID, recordID, datapointID, lastUpdated, datapoint: next }
) => {
  // get the previous record, if it's undefined make a new record
  const prevRecord = state.register.data[recordID] ?? {}

  console.log('prevRecord inside setDatapoint')
  console.log(prevRecord)

  // type guard-ish check for _meta object
  if (datapointID === "_meta")
    throw new Error("Cannot call setDatapoint on _meta object")

  // get previous datapoint, coerce type to Datapoint because
  // we now know it's not the _meta object
  const previous = prevRecord[datapointID] as Datapoint

  // short circuit if the data value is unchanged
  if (previous?.dataValue === next.dataValue) return state

  // update lastUpdated
  const nextProject = {
    ...state.projects.data[projectID],
    lastUpdated,
  }

  // update lastUpdated
  const nextDataset = {
    ...state.datasets.data[datasetID],
    lastUpdated,
    releaseStatus: DatasetReleaseStatus.Unreleased,
  }

  // next datapoint is all the previous data, overwritten with
  // the values from the payload, with the next version number
  // and the previous datapoint in the previous property
  const nextDatapoint = {
    ...previous,
    ...next,
    version: String(new Date(lastUpdated).getTime()),
    previous: previous,
  }

  if (nextDatapoint.report) delete nextDatapoint.report

  const nextRecord = {
    ...prevRecord,
    [datapointID]: {
      ...nextDatapoint,
    },
  }

  const nextRegister = {
    ...state.register.data,
    [recordID]: nextRecord,
  }

  // in case there is a prior storage message for the same dataset
  // merge the messages together. When offline, this builds up one
  // single message so that all changes are sent to the server in
  // a single rquest. The server will handle deduplication so it
  // is better for the same datapoint to be sent multiple times
  // (like when the prior message is in progress when it is read
  // here) than it is for an update to be lost, like if the message
  // is pending when a new datapoint is set and then the message
  // later fails. This way, that second message will replace the
  // pending message with a new initial message which sends both.
  const prevStorageMessageRegister = (
    state.messageStack[`${APIRoutes.saveRecords}_${datasetID}_remote`]?.data as
    { records: Register, datasetID: string }
  )?.records

  return {
    ...state,
    projects: {
      ...state.projects,
      data: {
        ...state.projects.data,
        [projectID]: nextProject,
      },
    },
    register: {
      ...state.register,
      data: nextRegister,
    },
    datasets: {
      ...state.datasets,
      data: {
        ...state.datasets.data,
        [datasetID]: nextDataset,
      },
    },
    messageStack: {
      ...state.messageStack,
      [`${APIRoutes.saveProject}_${projectID}_local`]: {
        route: APIRoutes.saveProject,
        target: 'local',
        status: StorageMessageStatus.Initial,
        data: nextProject,
      },
      [`${APIRoutes.saveProject}_${projectID}_remote`]: {
        route: APIRoutes.saveProject,
        target: 'remote',
        status: StorageMessageStatus.Initial,
        data: nextProject,
      },
      [`${APIRoutes.saveDataset}_${datasetID}_local`]: {
        route: APIRoutes.saveDataset,
        target: 'local',
        status: StorageMessageStatus.Initial,
        data: nextDataset,
      },
      [`${APIRoutes.saveDataset}_${datasetID}_remote`]: {
        route: APIRoutes.saveDataset,
        target: 'remote',
        status: StorageMessageStatus.Initial,
        data: nextDataset,
      },
      [`${APIRoutes.saveRegister}_${datasetID}_local`]: {
        route: APIRoutes.saveRegister,
        target: 'local',
        status: StorageMessageStatus.Initial,
        data: { register: nextRegister, datasetID },
      },
      [`${APIRoutes.saveRecords}_${datasetID}_remote`]: {
        route: APIRoutes.saveRecords,
        target: 'remote',
        status: StorageMessageStatus.Initial,
        data: {
          records: {
            ...(prevStorageMessageRegister ?? {}),
            [recordID]: nextRecord,
          }, datasetID, projectID
        },
      },
    },
  }
}

export default setDatapoint
