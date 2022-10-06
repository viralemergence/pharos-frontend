import localforage from 'localforage'
import { Project } from 'reducers/projectReducer/types'

const localSaveProject = async (project: Project) => {
  localforage.setItem(project.projectID, project)
}

export default localSaveProject
