import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  11
)

const projectID = () => 'prj' + nanoid()

const datasetID = () => 'set' + nanoid()

const recordID = (page: number) => `rec${page}|${nanoid()}`

// DatapointID is not used (column name is used)
// const datapointID = () => 'dat' + nanoid()

export default { projectID, datasetID, recordID }
