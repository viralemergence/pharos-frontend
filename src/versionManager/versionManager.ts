


















import { ParentSpanPluginArgs } from 'gatsby';
import { Record, VersionStatus } from 'reducers/projectReducer/types'

// export interface PlainRow {
//   [key: string]: string
// }


interface DataObject {
  // Object that will be stored in S3
  versions : number;
  records : VersionObject;
}



// Node 
class RowObject{
  record: Record; // json with rowdata
  previousVersion?: RowObject; // pointer to previous row version
  children : number; // previous no of versions

  constructor(record : Record, children = 0){
    this.record = record;
    this.children = children;
  }
}

class VersionObject{
  // linked list definition
  linkedlist : {[key : string] : RowObject};

  constructor() {

  }

  set createlinkedList(file : File) : Record[] {
    this.linkedlist = records.reduce
    
  }

  getRecordRows(newRows: Record[], versionObject: VersionObject, versionNumber: number): Record[] {
    
  }

}

const version = new VersionObject()


interface NewVersion {
  date: string
  key: string // server side key 
  status: VersionStatus
  versionObject: VersionObject
}

export const createlinkedList = (file : File) : Record => {
  file.map(file => RowObject(file))
}

// // handle file input
// export const parseVersionFile = (file: File): Record[] => {}

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






{ 
  lksdflkjsdfj: {
    record:  {}
    version: 10
    previous: {}
  }
}


VersionObject.update(id: lksdflksdf, newRecord: {}, version: 12)

