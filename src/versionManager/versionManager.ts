


















import { Record, VersionStatus } from 'reducers/projectReducer/types'

// export interface PlainRow {
//   [key: string]: string
// }


interface VersionObject {
  // linked list definition
}

interface NewVersion {
  date: string
  key: string // server side key 
  status: VersionStatus
  versionObject: VersionObject
}

// handle file input
export const parseVersionFile = (file: File): Record[] => {}

// get the rows in the format for the table interface 
export const getRecordRows = (
  versionObject: VersionObject
  versionNumber?: number
): Record[] => {



}

// save changes into the object
export const updateVersionWithRows = (
  newRows: Record[]
  versionObject: VersionObject
  versionNumber?: number
): VersionObject => {}


// export const saveVersion = async (
//   records: Record[]
// ): Promise<{ key: string }> => {}

// export const loadVersion = async (
//   researcherID: string,
//   datasetID: string,
//   versionNumber?: number
// ): Promise<{ key: string }> => {
//   const response = await serverLoadVersion('123')

//   const something = response.key
// }
