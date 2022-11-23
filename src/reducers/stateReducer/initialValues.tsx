import {
  AppState,
  Dataset,
  Project,
  ProjectPublishStatus,
  ProjectStatus,
  NodeStatus,
  User,
  UserStatus,
} from './types'

export const userInitialValue: User = {
  status: UserStatus.initial,
  statusMessage: 'Unknown user state',
}

export const projectInitialValue: Project = {
  name: '',
  projectID: '0',
  datasetIDs: [],
  status: ProjectStatus.Initial,
  publishStatus: ProjectPublishStatus.Unpublished,
}

export const datasetInitialValue: Dataset = {
  name: 'Loading dataset',
  datasetID: '',
  researcherID: '',
  activeVersion: '0',
  highestVersion: '0',
  versions: [],
}

const metadataObjInitialValue = {
  status: NodeStatus.Initial,
  data: {},
}

export const stateInitialValue: AppState = {
  user: userInitialValue,
  projects: metadataObjInitialValue,
  datasets: metadataObjInitialValue,
  register: metadataObjInitialValue,
  messageStack: {},
}
