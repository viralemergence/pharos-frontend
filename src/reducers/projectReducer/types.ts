// the status states of the overall
// datasets object
export enum ProjectStatus {
  Initial,
  Loading,
  Loaded,
  NetworkError,
}

// all possible statuses for a
// dataset in the frontend
export enum DatasetStatus {
  Unsaved,
  Saving,
  Saved,
  Error,
}

// all possible statuses for a version
// of a dataset in the frontend
export enum VersionStatus {
  Unsaved,
  Saving,
  Saved,
  Error,
  Loading,
}

export enum ReportScore {
  fail,
  pass,
  warning,
}

// a single component of a record; the user
// sees this as a cell in the dataset table
export interface Datapoint {
  displayValue: string | number // human readable label
  dataValue: string | number // data label (eg. ID of link to another table)
  report?: {
    pass: ReportScore
    message: string
  }
  unsaved?: boolean
  modifiedBy?: string // userID
  version: number
  previous: Datapoint
  // next: Datapoint
}

// a single record of data, a collection
// of datapoints which the user sees
// as a row in a table
export interface Record {
  [key: string]: Datapoint
}

export interface Register {
  [key: string]: Record
}

// a version; this corresponds to the
// actual table the user sees
// and tracks the object storing it in s3
export interface Version {
  // the creation date of the version
  date: string
  // status of the version
  status: VersionStatus // don't save in api
  // version key for the API to fetch raw object
  // key?: string // comes from the API
  // list of record rows
  // rows?: Record[] // comes from the user or the api
  // rows?: Rows
}

// a single dataset
export interface Dataset {
  // frontend sets the id now
  datasetID: string
  status?: DatasetStatus // don't save in api
  researcherID: string
  name: string
  samples_taken?: string
  detection_run?: string
  date_collected?: string
  versions: Version[]
  activeVersion: number
  registerKey: string // comes from API
  register: Register
}

// the overall Project object
// representing everything the frontend
// currently knows about every dataset
export interface Project {
  projectID: string
  status: ProjectStatus // don't save in api
  datasets: {
    [key: string]: Dataset
  }
}

// portfolio coming soon
// export interface Portfolio {
//   status: PortfolioStatus // don't save in api
//   projects: {
//     [key: string]: Project
//   }
// }
