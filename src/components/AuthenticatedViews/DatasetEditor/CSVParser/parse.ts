import Papa from 'papaparse'

import { StateAction, StateActions } from 'reducers/stateReducer/stateReducer'

import { User } from 'reducers/stateReducer/types'
import { RegisterStatus } from 'reducers/stateReducer/types'
import { Rows } from 'reducers/stateReducer/actions/batchSetDatapoint'

interface ParseFile {
  file: File
  user: User
  datasetID: string
  projectDispatch: React.Dispatch<StateAction>
}

const parseFile = ({ file, user, datasetID, projectDispatch }: ParseFile) => {
  Papa.parse(file, {
    header: true,
    complete: async results => {
      // set the register status to unsaved
      projectDispatch({
        type: StateActions.SetRegisterStatus,
        payload: { datasetID, status: RegisterStatus.Unsaved },
      })

      const rows = results.data as Rows
      const researcherID = user.data?.researcherID
      if (!researcherID) throw new Error('User data not found')

      // create a version
      projectDispatch({
        type: StateActions.CreateVersion,
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
        type: StateActions.BatchSetDatapoint,
        payload: { researcherID, datasetID, recordIDColumn: 'Row ID', rows },
      })
    },
  })
}

export default parseFile
