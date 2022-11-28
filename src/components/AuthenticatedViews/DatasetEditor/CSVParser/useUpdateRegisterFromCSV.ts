import Papa from 'papaparse'

import useUser from 'hooks/useUser'
import useDispatch from 'hooks/useDispatch'
import useRegister from 'hooks/register/useRegister'
import useDatasetID from 'hooks/dataset/useDatasetID'

import { mergeColumn } from '../../../../../config/defaultColumns.json'
import generateID from 'utilities/generateID'
import { StateActions } from 'reducers/stateReducer/stateReducer'

type Rows = { [key: string]: string }[]

const useUpdateRegisterFromCSV = () => {
  const { researcherID: modifiedBy } = useUser()
  const datasetID = useDatasetID()
  const register = useRegister()
  const dispatch = useDispatch()

  const updateRegisterFromCSV = (file: File) =>
    Papa.parse(file, {
      header: true,
      complete: async results => {
        const version = String(new Date().getTime())
        const rows = results.data as Rows
        const columns = Object.keys(rows[0])

        const registerCopy = { ...register }

        // generate mapping of recordIDs to the
        // user-provided IDs in the merge column
        const idMap: { [key: string]: string } = Object.entries(
          registerCopy
        ).reduce(
          (map, [recordID, record]) => ({
            ...map,
            ...(record[mergeColumn]?.displayValue && {
              [record[mergeColumn]?.displayValue]: recordID,
            }),
          }),
          {}
        )

        rows.forEach(row => {
          // pull ID from map, if it doesn't exist generate a new one
          let recordID = idMap[row[mergeColumn]]

          if (!recordID || recordID.trim().length === 0)
            recordID = generateID.recordID()

          columns.forEach(columnName => {
            const record = registerCopy[recordID] ?? {}
            const previous = record[columnName]

            if (previous?.dataValue !== row[columnName]) {
              registerCopy[recordID] = record
              registerCopy[recordID][columnName] = {
                displayValue: row[columnName],
                dataValue: row[columnName],
                modifiedBy,
                previous,
                version,
              }
            }
          })
        })

        dispatch({
          type: StateActions.UpdateRegister,
          payload: {
            data: registerCopy,
            source: 'local',
            datasetID,
          },
        })
      },
    })

  return updateRegisterFromCSV
}

export default useUpdateRegisterFromCSV
