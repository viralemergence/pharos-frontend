const version = [
  { detectionID: 'lksdfpou1234', sampleID: '32q213ipup' },
  { detectionID: 'cv1xoi2z2213', sampleID: '0987jklsdf' },
]

const register = {
  record: {
    columnName: {
      displayValue: 'string the user sees',
      dataValue: 'value in our system',
      // . . . other fields
      report: {
        // validation report
        // about the datapoint
      },
      previous: {
        // link back to the previous
        // version of this record
        displayValue: 'old value in old version',
        // . . . all the same other fields
      },
    },
  },
}

const registerfull = {
  record: {
    detectionID: {
      displayValue: 'lksdfpou1234',
      dataValue: 'lksdfpou1234',
      unsaved: false,
      modifiedBy: 'ResearcherID',
      version: 0,
      report: {
        pass: 'fail',
        message: '"lksdfpou1234" is not a valid detectionID',
      },
      previous: undefined,
    },
    organism: {
      displayValue: 'Fred',
      dataValue: 'lksdfpou1234',
      unsaved: false,
      modifiedBy: 'ResearcherID',
      version: 0,
      report: {
        pass: 'fail',
        message: 'Organism "Fred" not found, did you mean "Fred the bat?"',
      },
      previous: undefined,
    },
  },
  record2: {
    detectionID: {
      displayValue: 'cv1xoi2z2213',
      dataValue: 'cv1xoi2z2213',
      unsaved: false,
      modifiedBy: 'ResearcherID',
      version: 1,
      report: {
        pass: 'pass',
        message: '',
      },
      previous: {
        displayValue: 'cv1xoi2z2213',
        dataValue: 'cv1xoi2z2213',
        unsaved: false,
        modifiedBy: 'ResearcherID',
        version: 0,
        report: {
          pass: 'fail',
          message: '"cv1xoi2z2213" is not a valid detectionID',
        },
        previous: undefined,
      },
    },
    organism: {
      displayValue: 'Jane the bat',
      dataValue: '32q213ipup',
      unsaved: false,
      modifiedBy: 'ResearcherID',
      version: 0,
      report: {
        pass: 'pass',
        message: '',
      },
      previous: undefined,
    },
  },
}
