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
        payload: { datasetID, status: RegisterStatus.Unsaved },
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

      // iterate over all the rows returned from Papa.parse
      for (const row of rows) {
        // we'll just decide that the samepleID is the
        // ID column for the dataset for now, this will
        // need to be more flexible later but we just
        // need to get it working at the moment
        const recordID = row['SampleID']

        // iterate over every column in the row
        for (const [datapointID, value] of Object.entries(row)) {
          // dispatch SetDatapoint for each cell in the row
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

      // doing this here will cause async issues...
      // For now it might just be fine to requrie the user
      // to hit the save button themselves

      // const register = {}

      // const data = {
      //   register,
      //   versions: [...project.datasets[datasetID].versions, version],
      // }

      // const nextRegisterData = await saveRegister({
      //   data,
      //   datasetID,
      //   researcherID,
      // })

      // if (nextRegisterData) {
      //   const { register, versions } = nextRegisterData

      //   projectDispatch({
      //     type: ProjectActions.ReplaceRegister,
      //     payload: { datasetID, register },
      //   })

      //   projectDispatch({
      //     type: ProjectActions.SetVersions,
      //     payload: { datasetID, versions },
      //   })

      //   projectDispatch({
      //     type: ProjectActions.SetRegisterStatus,
      //     payload: { datasetID, status: RegisterStatus.Loaded },
      //   })
      // } else {
      //   projectDispatch({
      //     type: ProjectActions.SetRegisterStatus,
      //     payload: { datasetID, status: RegisterStatus.Error },
      //   })
      // }
    },
  })
}

export default parseFile
