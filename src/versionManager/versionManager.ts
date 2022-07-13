


















import { Record, VersionStatus } from 'reducers/projectReducer/types'

// export interface PlainRow {
//   [key: string]: string
// }


interface DataObject {
  // Object that will be stored in S3
  versionIndex : {};
  records : VersionObject;
}


// Node 
class RowObject{
  row_key : string = 'somethingrandomthatIdontknowhowtogenerateyet'; // TODO
  row_data : {}; // json with rowdata
  previousVersion ?: any; // pointer to previous row version
  nextRow ?: any = null; // pointer to next row
  status ?: any = null; // Optional at this point
  modified_by : string; // researcherid

  constructor(row_data : {}, modified_by : string){
    this.row_data = row_data;
    this.modified_by = modified_by;
  }
}

class VersionObject{
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
