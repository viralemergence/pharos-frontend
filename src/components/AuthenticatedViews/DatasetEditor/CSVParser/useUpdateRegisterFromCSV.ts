import Papa from 'papaparse'

import useUser from 'hooks/useUser'
import useDispatch from 'hooks/useDispatch'
import useDatasetID from 'hooks/dataset/useDatasetID'

import generateID from 'utilities/generateID'
import { StateActions } from 'reducers/stateReducer/stateReducer'
import { Register } from 'reducers/stateReducer/types'
import useProjectID from 'hooks/project/useProjectID'
import getTimestamp from 'utilities/getTimestamp'

type Rows = { [key: string]: string }[]

const useUpdateRegisterFromCSV = () => {
  const { researcherID: modifiedBy } = useUser()
  const datasetID = useDatasetID()
  const projectID = useProjectID()
  const dispatch = useDispatch()

  const updateRegisterFromCSV = (file: File) =>
    Papa.parse(file, {
      header: true,
      complete: async results => {
        const version = String(new Date().getTime())
        const rows = results.data as Rows
        const columns = Object.keys(rows[0]).map(column => column.trim())

        // const registerCopy = { ...register }
        const newRecords: Register = {}

        // // Code for merging CSV with preexisting register
        // // this feature is deprecated
        // // generate mapping of recordIDs to the
        // // user-provided IDs in the merge column
        // const idMap: { [key: string]: string } = Object.entries(
        //   registerCopy
        // ).reduce(
        //   (map, [recordID, record]) => ({
        //     ...map,
        //     ...(record[mergeColumn]?.displayValue && {
        //       [record[mergeColumn]?.displayValue]: recordID,
        //     }),
        //   }),
        //   {}
        // )

        rows.forEach(row => {
          // merge code --- deprecated
          // pull ID from map, if it doesn't exist generate a new one
          // let recordID = idMap[row[mergeColumn]]
          // if (!recordID || recordID.trim().length === 0)

          const recordID = generateID.recordID()

          for (const columnName of columns) {
            if (!row[columnName]) continue

            const record = newRecords[recordID] ?? {}
            // const previous = record[columnName]

            // if (previous?.dataValue !== row[columnName]) {
            newRecords[recordID] = record
            newRecords[recordID][columnName] = {
              dataValue: row[columnName]?.trim(),
              modifiedBy,
              // previous,
              version,
            }
          }
        })

        const lastUpdated = getTimestamp()

        dispatch({
          type: StateActions.ExtendRegister,
          payload: { projectID, datasetID, lastUpdated, newRecords },
        })
      },
    })

  return updateRegisterFromCSV
}

export default useUpdateRegisterFromCSV
