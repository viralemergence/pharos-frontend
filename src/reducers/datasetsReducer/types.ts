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
}

// a single row of a version of a dataset;
// the column from the csv becomes the key
// and the cell content becomes the value
export interface Record {
  [key: string]: string
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
  key?: string // comes from the API
  // raw dataset object from the user view
  rows?: Record[] // comes from the user or the api
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
  versions?: Version[]
  activeVersion: number
}

// the overall Datasets object
// representing everything the frontend
// currently knows about every dataset
export interface Project {
  projectID: 0
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
