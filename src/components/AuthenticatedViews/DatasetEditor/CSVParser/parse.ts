import Papa from 'papaparse'

import {
  ProjectAction,
  ProjectActions,
} from 'reducers/projectReducer/projectReducer'

import { User } from 'components/Login/UserContextProvider'
import { RegisterStatus } from 'reducers/projectReducer/types'
import { Rows } from 'reducers/projectReducer/actions/batchSetDatapoint'

interface ParseFile {
  file: File
  user: User
  datasetID: string
  projectDispatch: React.Dispatch<ProjectAction>
}

const parseFile = ({ file, user, datasetID, projectDispatch }: ParseFile) => {
  Papa.parse(file, {
    header: true,
    complete: async results => {
      // set the register status to unsaved
      projectDispatch({
        type: ProjectActions.SetRegisterStatus,
        payload: { datasetID, status: RegisterStatus.Unsaved },
      })

      const rows = results.data as Rows
      const researcherID = user.data?.researcherID
      if (!researcherID) throw new Error('User data not found')

      // create a version
      projectDispatch({
        type: ProjectActions.CreateVersion,
        payload: {
          datasetID,
          version: {
            date: String(new Date().toUTCString()),
            name: String(new Date().toUTCString()),
          },
        },
      })

      // parse all rows
      projectDispatch({
        type: ProjectActions.BatchSetDatapoint,
        payload: { researcherID, datasetID, recordIDColumn: 'Row ID', rows },
      })
    },
  })
}

export default parseFile
