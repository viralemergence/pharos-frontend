import { StorageMessage } from 'storage/synchronizeMessageQueue'

export interface User {
  status: UserStatus
  statusMessage: string
  data?: {
    researcherID: string
    organization: string
    email: string
    name: string
    projectIDs?: string[]
  }
}

export enum UserStatus {
  'initial',
  'loggedOut',
  'loggedIn',
  'sessionExpired',
  'invalidUser',
  'authError',
}

export type ProjectID = string
export type RecordID = string
export type DatasetID = string

export enum NodeStatus {
  Initial = 'initial',
  Loading = 'Loading',
  Loaded = 'Loaded',
  Offline = 'Offline',
}

export interface AppState {
  user: User
  projects: MetadataObj<{ [key: ProjectID]: Project }>
  datasets: MetadataObj<{ [key: DatasetID]: Dataset }>
  register: MetadataObj<Register>
  messageStack: { [key: string]: StorageMessage }
}

export interface MetadataObj<T> {
  status: NodeStatus
  data: T
}

// the overall Project object
// representing everything the frontend
// currently knows about each project

// project is implemented in the frontend
// but not in the API yet.
export interface Project {
  projectID: string
  name: string
  status: ProjectStatus
  datasetIDs: string[]
  // datasets: {
  //   // dataset keys are the datasetID
  //   // to allow O(1) access to update
  //   // individual datasets in reducer
  //   // functions.
  //   [key: string]: Dataset
  // }
  lastUpdated?: string
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

// a single dataset
export interface Dataset {
  // frontend sets the id now
  datasetID: string
  // This might need to be re-thought
  // for a collaborative context, but
  // that's fine now that we're storing
  // researcherID in the datapoint
  researcherID: string
  // frontend status of the dataset, this
  // will be overwritten on page load
  status?: DatasetStatus
  // the user-facing "status" of the
  // dataset which reflects released
  // and published status
  releaseStatus?: DatasetReleaseStatus
  // the array of version metadata
  versions: Version[]
  // the version number which the user
  // is looking at in the table interface
  activeVersion: string
  // whether or not the most recent state
  // of the register is a published version
  highestVersion: string
  // name of the dataset
  name: string
  // lastUpdated timestamp
  lastUpdated?: string
  // earliest and latest date in the dataset
  earliestDate?: string
  latestDate?: string
  // general metadata, these are
  // placeholder example values
  // and subject to change
  samples_taken?: string
  detection_run?: string
  date_collected?: string
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

// a single record of data, a collection
// of datapoints which the user sees
// as a row in a table

export interface Record {
  [key: string]: Datapoint
}

export interface RecordMeta {
  recordID: string

  // report?: {
  //   pass: ReportScore
  //   message: string
  //   data: { [key: string]: string }
  // }

  // ingested: boolean
}

export interface RecordWithID {
  _meta: RecordMeta
  [key: string]: Datapoint | RecordMeta
}

// a single component of a record; the user
// sees this as a cell in the dataset table
// or in a form-like interface
export interface Datapoint {
  // human readable label
  displayValue: string // this needs localization
  // value of the datapoint inside our system,
  // where that needs to be different; for
  // example to implement links to other data
  // such as organisms or locations
  dataValue: string | { [key: string]: string }
  // validation report response
  report?: {
    pass: ReportScore
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

// the status states of the overall
// datasets object
export enum ProjectStatus {
  Initial = 'Initial',
  Unsaved = 'Unsaved',
  Saving = 'Saving',
  Saved = 'Saved',
  Loading = 'Loading',
  Loaded = 'Loaded',
  Error = 'Error',
}

export enum ProjectPublishStatus {
  Unpublished = 'Unpublished',
  Published = 'Published',
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
  Released = 'Released',
  Published = 'Published',
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
