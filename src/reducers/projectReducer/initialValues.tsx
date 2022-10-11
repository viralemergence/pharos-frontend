import {
  AppState,
  Dataset,
  DatasetStatus,
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
  status: DatasetStatus.Loading,
  activeVersion: 0,
  highestVersion: 0,
  versions: [],
  register: {},
}

export const stateInitialValue: AppState = {
  user: userInitialValue,
  projects: {
    status: NodeStatus.Initial,
    data: {},
  },
  datasets: {
    status: NodeStatus.Initial,
    data: {},
  },
  messageStack: {},
}
