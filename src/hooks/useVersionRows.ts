import { Record } from 'reducers/projectReducer/types'

// placeholder for function to provide memoized access to the
// rows of an arbitrary version for displaying in the table
const useVersionRows = (version: number) => {
  const rows: Record[] = [
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

  return rows
}

export default useVersionRows
