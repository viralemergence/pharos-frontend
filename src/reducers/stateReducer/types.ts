import { StorageMessage } from 'storage/synchronizeMessageQueue'
import units from 'config/units'
import { CognitoUser } from 'amazon-cognito-identity-js'

export type ProjectID = string
export type RecordID = string
export type DatasetID = string

export enum NodeStatus {
  Initial = 'initial',
  Loading = 'Loading',
  Loaded = 'Loaded',
  Offline = 'Offline',
}

export enum UserStatus {
  Initial = 'initial',
  LoggedOut = 'loggedOut',
  LoggedIn = 'loggedIn',
  SessionExpired = 'sessionExpired',
  InvalidUser = 'invalidUser',
  AuthError = 'authError',
  AwaitingConfirmation = 'awaitingConfirmation',
}

export interface AppState {
  user: UserObj
  projects: MetadataObj<{ [key: ProjectID]: Project }>
  datasets: MetadataObj<{ [key: DatasetID]: Dataset }>
  register: MetadataObj<Register>
  messageStack: { [key: string]: StorageMessage }
}

export interface MetadataObj<T> {
  status: NodeStatus
  data: T
}

// special case of MetadataObj
// which allows for special user states
export interface UserObj {
  status: UserStatus
  data?: User
  cognitoUser?: CognitoUser
  statusMessage?: string
  cognitoResponseType?: string
}

export interface User {
  researcherID: string
  organization: string
  email: string
  name: string
  firstName: string
  lastName: string
  projectIDs?: string[]
  downloadIDs?: string[]
}

// the overall Project object
// representing everything the frontend
// currently knows about each project
export interface Project {
  projectID: string
  name: string
  datasetIDs: string[]
  deletedDatasetIDs?: string[]
  lastUpdated: string
  // metadata the user enters when they
  // fill out the new project form
  description?: string
  projectType?: string
  surveillanceStatus?: string
  citation?: string
  relatedMaterials?: string[]
  projectPublications?: string[]
  othersCiting?: string[]
  publishStatus: ProjectPublishStatus
  authors?: {
    researcherID: string
    role: string
  }[]
  // adding this as a note
  // animals should be implemented
  // as a special case of a dataset
  // animals: {
  //   [key: string]: Dataset
  // }
}

// a 'page' of a register
// which corresponds to a 
// chunk of records
export interface RegisterPage {
  lastUpdated: string
  merged?: boolean
}

// a single dataset
/** The Dataset object contains all
 * the metadata about the dataset. */
export interface Dataset {
  /** frontend sets the id now */
  datasetID: DatasetID
  // the projectID to which
  // the dataset belongs.
  projectID: ProjectID
  name: string
  // the user-facing "status" of the
  // dataset which reflects released
  // and published status
  releaseStatus?: DatasetReleaseStatus
  releaseReport?: ReleaseReport
  // lastUpdated timestamp
  lastUpdated: string
  // earliest and latest date in the dataset
  earliestDate?: string
  latestDate?: string
  registerPages?: {
    [key: string]: RegisterPage
  }

  // optional user-specified display units
  age?: keyof typeof units.age
  mass?: keyof typeof units.mass
  length?: keyof typeof units.length
}

export interface ReleaseReport {
  releaseStatus: DatasetReleaseStatus
  successCount: number
  warningCount: number
  failCount: number
  missingCount: number
  warningFields: { [key: RecordID]: string[] }
  failFields: { [key: RecordID]: string[] }
  missingFields: { [key: RecordID]: string[] }
}

// this is the container for information
// that globally applies to an entire version,
// the index in the array is the corresponding
// version number, and the length of the array
// is the number of versions which should be
// in the register.
export interface Version {
  // the creation date of the version
  date: string
  // name of version; adding this as an
  // example of future metadata we might need
  name: string
}

// each Record in the register
// is a collection of datapoints
// which the user will see as a
// row, or as an input form
export interface Register {
  [key: RecordID]: Record
}

export interface ServerRecordMeta {
  order?: number
}

// a single record of data, a collection
// of datapoints which the user sees
// as a row in a table
export interface Record {
  _meta?: ServerRecordMeta
  [key: string]: Datapoint | ServerRecordMeta | undefined
}

export interface RecordMeta {
  recordID: string
  rowNumber?: number
  order?: number

  // report?: {
  //   pass: ReportScore
  //   message: string
  //   data: { [key: string]: string }
  // }

  // ingested: boolean
}

export interface RecordWithMeta {
  _meta: RecordMeta
  [key: string]: Datapoint | RecordMeta
}

// a single component of a record; the user
// sees this as a cell in the dataset table
// or in a form-like interface
export interface Datapoint {
  // value that the datapoint represents
  dataValue: string
  // validation report response
  report?: {
    status: ReportScore
    message: string
    data: { [key: string]: string }
  }
  // userID
  modifiedBy: string
  // version number where this
  // datapoint was last modified.
  // it is valid for any version
  // higher than this number
  //
  // Changing this to a string,
  // since it will come back from
  // the API as a string
  version: string

  // // TODO: replace version with timestamp
  // timestamp: string

  // to access versions before
  // the version number, traverse
  // the linked list.
  previous?: Datapoint
}

// the status states of the overall
// datasets object
export enum PortfolioStatus {
  Initial,
  Loading,
  Loaded,
  NetworkError,
}

export enum ProjectPublishStatus {
  Unpublished = 'Unpublished',
  Published = 'Published',
  Publishing = 'Publishing',
}

// all possible statuses for a
// dataset in the frontend
export enum DatasetStatus {
  Loading = 'Loading',
  Unsaved = 'Unsaved',
  Saving = 'Saving',
  Saved = 'Saved',
  Error = 'Error',
}

export enum DatasetReleaseStatus {
  Unreleased = 'Unreleased',
  Releasing = 'Releasing',
  Released = 'Released',
  Published = 'Published',
  Publishing = 'Publishing',
}

// all possible statuses for a register
// relative to the server
export enum RegisterStatus {
  Unsaved = 'Unsaved',
  Saving = 'Saving',
  Saved = 'Saved',
  Error = 'Error',
  Loading = 'Loading',
  Loaded = 'Loaded',
}

export enum ReportScore {
  fail = 'FAIL',
  pass = 'SUCCESS',
  warning = 'WARNING',
}
