import { ActionFunction, StateActions } from '../projectReducer'
import { ProjectStatus } from '../types'

export interface SetProjectStatusActionPayload {
  projectID: string
  status: ProjectStatus
}

export interface SetProjectStatusAction {
  type: StateActions.SetProjectStatus
  payload: SetProjectStatusActionPayload
}

const setProjectStatus: ActionFunction<SetProjectStatusActionPayload> = (
  state,
  payload
) => ({
  ...state,
  projects: {
    ...state.projects,
    [payload.projectID]: {
      ...state.projects[payload.projectID],
      status: payload.status,
    },
  },
})

export default setProjectStatus
