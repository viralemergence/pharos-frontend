import saveRegister from 'api/saveRegister'
import { User } from 'components/Login/UserContextProvider'
import Papa from 'papaparse'
import {
  ProjectAction,
  ProjectActions,
} from 'reducers/projectReducer/projectReducer'
import { Project, RegisterStatus } from 'reducers/projectReducer/types'

export type Rows = { [key: string]: string }[]

interface ParseFile {
  file: File
  user: User
  project: Project
  datasetID: string
  projectDispatch: React.Dispatch<ProjectAction>
}

const parseFile = ({
  file,
  user,
  project,
  datasetID,
  projectDispatch,
}: ParseFile) => {
  Papa.parse(file, {
    header: true,
    complete: async results => {
      // set the register status to saving
      projectDispatch({
        type: ProjectActions.SetRegisterStatus,
        payload: { datasetID, status: RegisterStatus.Saving },
      })

      const version = {
        date: String(new Date().toUTCString()),
        name: String(new Date().toUTCString()),
      }

      // create a version
      projectDispatch({
        type: ProjectActions.CreateVersion,
        payload: {
          datasetID,
          version,
        },
      })

      // need to parse the rows into the reigster
      const rows = results.data as Rows

      // used for saving the register
      const researcherID = user.data?.researcherID
      if (!researcherID) throw new Error('User data not found')

      const register = {}

      const data = {
        register,
        versions: [...project.datasets[datasetID].versions, version],
      }
      const saved = await saveRegister({ data, datasetID, researcherID })

      console.log('save register to the server here')

      if (saved) {
        projectDispatch({
          type: ProjectActions.SetRegisterStatus,
          payload: { datasetID, status: RegisterStatus.Saved },
        })
      } else {
        projectDispatch({
          type: ProjectActions.SetRegisterStatus,
          payload: { datasetID, status: RegisterStatus.Error },
        })
      }
    },
  })
}

export default parseFile
