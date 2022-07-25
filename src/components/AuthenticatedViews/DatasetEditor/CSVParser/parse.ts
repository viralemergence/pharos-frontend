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

      // create a version
      const version = {
        date: String(new Date().toUTCString()),
        name: String(new Date().toUTCString()),
      }

      projectDispatch({
        type: ProjectActions.CreateVersion,
        payload: {
          datasetID,
          version,
        },
      })

      // need to parse the rows into the reigster
      const rows = results.data as Rows

      // used for saving to the register
      const researcherID = user.data?.researcherID
      if (!researcherID) throw new Error('User data not found')

      for (const row of rows) {
        const recordID = row['sampleID']

        for (const [datapointID, value] of Object.entries(row)) {
          projectDispatch({
            type: ProjectActions.SetDatapoint,
            payload: {
              datasetID,
              recordID,
              datapointID,
              datapoint: {
                displayValue: value,
                dataValue: value,
                modifiedBy: researcherID,
              },
            },
          })
        }
      }

      const register = {}

      const data = {
        register,
        versions: [...project.datasets[datasetID].versions, version],
      }

      const nextRegisterData = await saveRegister({
        data,
        datasetID,
        researcherID,
      })

      if (nextRegisterData) {
        const { versions, register } = nextRegisterData
        projectDispatch({
          type: ProjectActions.ReplaceRegister,
          payload: { datasetID, register },
        })
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
