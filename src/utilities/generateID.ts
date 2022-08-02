import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  10
)

const projectID = () => 'prj' + nanoid()

const datasetID = () => 'set' + nanoid()

const recordID = () => 'rec' + nanoid()

const datapointID = () => 'dat' + nanoid()

export default { projectID, datasetID, recordID, datapointID }
