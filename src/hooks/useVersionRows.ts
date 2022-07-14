import { Record } from 'reducers/projectReducer/types'

// placeholder for hook to provide memoized access to the
// rows of an arbitrary version for displaying in the table
const useVersionRows = (datasetID: string, version: number | undefined) => {
  const rows = [
    {
      DetectionID: { displayValue: '', dataValue: '', version: 0 },
      SampleID: { displayValue: '', dataValue: '', version: 0 },
      DetectionMethod: { displayValue: '', dataValue: '', version: 0 },
      DetectionOutcome: { displayValue: '', dataValue: '', version: 0 },
      DetectionComments: { displayValue: '', dataValue: '', version: 0 },
      PathogenTaxID: { displayValue: '', dataValue: '', version: 0 },
      GenbankAccession: { displayValue: '', dataValue: '', version: 0 },
      SRAAccession: { displayValue: '', dataValue: '', version: 0 },
      GISAIDAccession: { displayValue: '', dataValue: '', version: 0 },
      GBIFIdentifier: { displayValue: '', dataValue: '', version: 0 },
    },
  ]

  // this will be the return type of the finished hook
  return rows as Record[] | undefined
}

export default useVersionRows
