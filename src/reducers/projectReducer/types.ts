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
// or in a form-like interface
export interface Datapoint {
  // human readable label
  displayValue: string | number
  // value of the datapoint inside our system,
  // where that needs to be different; for
  // example to implement links to other data
  // such as organisms or locations
  dataValue: string
  // validation report response
  report?: {
    pass: ReportScore
    message: string
  }
  // if this datapoint was modified
  // in the active version
  modified?: boolean
  // userID
  modifiedBy?: string
  // version number where this
  // datapoint was last modified.
  // it is valid for any version
  // higher than this number
  version: number
  // to access versions before
  // the version number, traverse
  // the linked list.
  previous?: Datapoint
}

// a single record of data, a collection
// of datapoints which the user sees
// as a row in a table
export interface Record {
  [key: string]: Datapoint
}

// each Record in the register
// is a collection of datapoints
// which the user will see as a
// row, or as an input form
export interface Register {
  [key: string]: Record
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
  // register key describes the
  // location of the saved
  // register on the server
  registerKey?: string
  // name of the dataset
  name: string
  // general metadata, these are
  // placeholder example values
  // and subject to change
  samples_taken?: string
  detection_run?: string
  date_collected?: string
}

// the overall Project object
// representing everything the frontend
// currently knows about every dataset
export interface Project {
  projectID: string
  status: ProjectStatus // don't save in api
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

// portfolio coming soon
// export interface Portfolio {
//   status: PortfolioStatus // don't save in api
//   projects: {
//     [key: string]: Project
//   }
// }
