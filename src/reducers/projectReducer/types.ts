// this is the set of projects
// the user has access to and
// their state in the frontend

// portfolio is not yet implemented
export interface Portfolio {
  status: PortfolioStatus
  projects: {
    [key: string]: Project
  }
}

// the overall Project object
// representing everything the frontend
// currently knows about each project

// project is implemented in the frontend
// but not in the API yet.
export interface Project {
  projectID: string
  status: ProjectStatus // don't save in api
  projectName: string
  description: string
  projectType: string
  surveillanceType: string
  relatedMaterials: string[]
  publicationsCiting: string[]
  authors: {
    researcherID: string
    role: string
  }[]
  datasets: {
    // dataset keys are the datasetID
    // to allow O(1) access to update
    // individual datasets in reducer
    // functions.
    [key: string]: Dataset
  }
  // adding this as a note
  // organisms should be implemented
  // as a special case of a dataset
  // organisms: {
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
  // the array of version metadata
  versions: Version[]
  // the version number which the user
  // is looking at in the table interface
  activeVersion: number
  // the register as represented
  // in global state on the frontend
  register?: Register
  // the status of the register
  // relative to the server
  registerStatus?: RegisterStatus
  // whether or not the most recent state
  // of the register is a published version
  highestVersion: number
  // name of the dataset
  name: string
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
  [key: string]: Record
}

// a single record of data, a collection
// of datapoints which the user sees
// as a row in a table

export interface Record {
  [key: string]: Datapoint
}

export interface RecordMeta {
  recordID: string
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
  displayValue: string
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
  Initial,
  Saving,
  Saved,
  Loading,
  Loaded,
  NetworkError,
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
  fail,
  pass,
  warning,
}
