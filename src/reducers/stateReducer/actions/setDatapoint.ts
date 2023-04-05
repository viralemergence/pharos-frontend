import {
  APIRoutes,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'
import { ActionFunction, StateActions } from '../stateReducer'
import { Datapoint, DatasetID, ProjectID, RecordID } from '../types'

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

  // get previous datapoint
  const previous = prevRecord[datapointID]

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

  const nextRegister = {
    ...state.register.data,
    [recordID]: {
      ...prevRecord,
      [datapointID]: {
        ...nextDatapoint,
      },
    },
  }

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
      [`${APIRoutes.saveRegister}_${datasetID}_remote`]: {
        route: APIRoutes.saveRegister,
        target: 'remote',
        status: StorageMessageStatus.Initial,
        data: { register: nextRegister, datasetID },
      },
    },
  }
}

export default setDatapoint
