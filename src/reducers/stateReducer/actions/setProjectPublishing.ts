import { ActionFunction, StateActions } from '../stateReducer'
import { ProjectID, ProjectPublishStatus } from '../types'

export interface SetProjectPublishingStatusActionPayload {
  projectID: ProjectID
  publishStatus: ProjectPublishStatus
}

export interface SetProjectPublishingStatusAction {
  type: StateActions.SetProjectPublishingStatus
  payload: SetProjectPublishingStatusActionPayload
}

// Set project to "publishing" status locally only
const setProjectPublishingStatus: ActionFunction<
  SetProjectPublishingStatusActionPayload
> = (state, payload) => ({
  ...state,
  projects: {
    ...state.projects,
    data: {
      ...state.projects.data,
      [payload.projectID]: {
        ...state.projects.data[payload.projectID],
        publishStatus: payload.publishStatus,
      },
    },
  },
})

export default setProjectPublishingStatus
