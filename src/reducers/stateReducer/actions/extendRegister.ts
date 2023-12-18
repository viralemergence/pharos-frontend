import {
  APIRoutes,
  StorageMessage,
  StorageMessageStatus
} from 'storage/synchronizeMessageQueue'
import { ActionFunction, StateActions } from '../stateReducer'
import { DatasetID, DatasetReleaseStatus, ProjectID, Register, RegisterPage } from '../types'
import { SaveRecords } from 'storage/storageFunctions/saveRecords'

export interface ExtendRegisterPayload {
  projectID: ProjectID
  datasetID: DatasetID
  lastUpdated: string
  newRecords: Register
}

export interface ExtendRegisterAction {
  type: StateActions.ExtendRegister
  payload: ExtendRegisterPayload
}

const extendRegister: ActionFunction<ExtendRegisterPayload> = (
  state,
  { projectID, datasetID, lastUpdated, newRecords }
) => {
  // update lastUpdated
  const nextProject = {
    ...state.projects.data[projectID],
    lastUpdated,
  }

  const nextRegister = { ...state.register.data, ...newRecords }

  const nextSaveRecordsStorageMessages: { [key: string]: StorageMessage } = {}

  const registerPages: { [key: string]: RegisterPage } = {}

  for (const [recordID, record] of Object.entries(newRecords)) {
    const idParts = recordID.split('|')
    let page: number | null = null
    if (idParts.length === 2) {
      page = Number(idParts[0].replace('rec', ''))
      registerPages[page] = { lastUpdated }
    }

    const messageKey = `${APIRoutes.saveRecords}_${datasetID}_${page}_remote`

    if (!nextSaveRecordsStorageMessages[messageKey]) {
      nextSaveRecordsStorageMessages[messageKey] = {
        route: APIRoutes.saveRecords,
        target: 'remote',
        status: StorageMessageStatus.Initial,
        data: {
          records: {
            [recordID]: record,
          }, datasetID, projectID
        },
      }
    } else {
      (nextSaveRecordsStorageMessages[messageKey] as SaveRecords).data.records[recordID] = record
    }
  }

  // update lastUpdated
  const nextDataset = {
    ...state.datasets.data[datasetID],
    lastUpdated,
    releaseStatus: DatasetReleaseStatus.Unreleased,
    // mark which page of the register is being updated
    registerPages: {
      ...(state.datasets.data[datasetID].registerPages ?? {}),
      ...registerPages,
    }
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
      ...nextSaveRecordsStorageMessages,
    },
  }
}

export default extendRegister
