import {
  AppState,
  Dataset,
  Project,
  ProjectPublishStatus,
  NodeStatus,
  UserStatus,
} from './types'

export const projectInitialValue: Project = {
  name: '',
  projectID: '0',
  datasetIDs: [],
  publishStatus: ProjectPublishStatus.Unpublished,
}

export const datasetInitialValue: Dataset = {
  name: 'Loading dataset',
  datasetID: '',
  projectID: '',
  activeVersion: '0',
  highestVersion: '0',
  versions: [],
}

const metadataObjInitialValue = {
  status: NodeStatus.Initial,
  data: {},
}

export const stateInitialValue: AppState = {
  user: { status: UserStatus.initial },
  projects: metadataObjInitialValue,
  datasets: metadataObjInitialValue,
  register: metadataObjInitialValue,
  messageStack: {},
}
