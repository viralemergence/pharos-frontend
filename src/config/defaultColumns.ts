const defaultColumns = {
  'Sample ID': {
    type: 'string',
    definition: 'The researcher generated unique ID of the sample collected.',
  },
  'Animal ID': {
    type: 'string',
    definition:
      'The researcher generated unique ID of the individual animal from which the sample was collected.',
  },
  'Host species': {
    type: 'string',
    definition:
      "(Required) The species of the animal from which the sample was collected, written using binomial nomenclature, e.g. 'Vicugna pacos'.",
  },
  'Host species NCBI tax ID': {
    type: 'string',
    definition:
      "The NCBI taxonomic ID of the host species, if known. Must be numeric, 1-7 digits long, e.g. '30538'.",
  },
  Latitude: {
    type: 'string',
    definition: '(Required) The north south position of a collection site.',
  },
  Longitude: {
    type: 'string',
    definition: '(Required) The east west position of a collection site.',
  },
  'Spatial uncertainty': {
    type: 'unit',
    definition:
      'Coordinate uncertainty from GPS recordings or post-hoc digitization, expressed in meters.',
    unitType: 'length',
  },
  'Collection day': {
    type: 'string',
    definition:
      "(Required) The day of the month on which the speciman was collected, e.g. '3' for the third day of the month.",
  },
  'Collection month': {
    type: 'string',
    definition:
      "(Required) The month in which the speciman was collected, in numeric form, e.g. '12' for December.",
  },
  'Collection year': {
    type: 'string',
    definition:
      "(Required) The year in which the speciman was collected, written in four digit form, e.g. '2021'.",
  },
  'Collection method or tissue': {
    type: 'string',
    definition:
      "The technique used to extract the sample, e.g. 'oropharyngeal swab', or the tissue from which the sample was extracted.",
  },
  'Detection method': {
    type: 'string',
    definition:
      "The type of test performed to detect the pathogen, e.g. 'conventional PCR'.",
  },
  'Primer sequence': {
    type: 'string',
    definition:
      "The sequence of both forward and reverse primers used to identify the sample (e.g., forward CDCAYGARTTYTGYTCNCARC 3' ; reverse RHGGRTANGCRTCWATDGC 3').",
  },
  'Primer citation': {
    type: 'string',
    definition:
      'Link to papers or publications that reference primers for use in the species tested here.',
  },
  'Detection target': {
    type: 'string',
    definition:
      "The pathogen or category of pathogens a detection method is designed to identify. This should reflect methodology over study aim (e.g., a visual inspection for ticks might still recover fleas and could be reported as targeting 'Ectoparasites').",
  },
  'Detection target NCBI tax ID': {
    type: 'string',
    definition:
      "NCBI taxonomic ID of the detection target, if relevant. Must be numeric, 1-7 digits long, e.g. '30538'.",
  },
  'Detection outcome': {
    type: 'string',
    definition:
      "The result of the test performed. Must be one of the following: 'positive' or 'negative' or 'inconclusive', or may be left blank if the result is pending.",
  },
  'Detection measurement': {
    type: 'string',
    definition:
      'Any quantitative information on pathogen detection that is more detailed than simple positive or negative results (e.g., viral titer, parasite counts).',
  },
  'Detection measurement units': {
    type: 'string',
    definition:
      'Units for quantitative measurements of pathogen intensity or test results (e.g., Ct, TCID50/mL, or parasite count).',
  },
  Pathogen: {
    type: 'string',
    definition:
      "The pathogen detected by the test, if any, e.g. 'SARS-CoV-2'. Pathogen may be different from detection target. If no pathogen is detected it should either be synonymous with detection target or omitted.",
  },
  'Pathogen NCBI tax ID': {
    type: 'string',
    definition:
      "The NCBI taxonomic ID of the pathogen detected, if known. Must be numeric, 1-7 digits long, e.g. '2697049'.",
  },
  'GenBank accession': {
    type: 'string',
    definition:
      'The GenBank accession numbers for each primer pair, if available.',
  },
  'Detection comments': {
    type: 'string',
    definition: 'Any additional notes about the detection process.',
  },
  'Organism sex': {
    type: 'string',
    definition:
      "The sex of the inidividual animal from which the sample was collected. Must be one of the following: 'female' or 'male' or 'unknown'.",
  },
  'Dead or alive': {
    type: 'string',
    definition:
      "The state of the individual animal from which the sample was collected, at the time of sample collection. Must be one of the following: 'dead' or 'alive' or 'unknown'.",
  },
  'Health notes': {
    type: 'string',
    definition:
      'Any additional notes about the state of the animal at the time of sample collection.',
  },
  'Life stage': {
    type: 'string',
    definition:
      'The life stage of the animal from which the sample was collection.',
  },
  Age: {
    type: 'unit',
    definition:
      'The numeric age of the animal from which the sample was collected, at the time of sample collection. For now, age must be expressed in seconds. Units will eventually be configured in the dataset settings.',
    unitType: 'age',
  },
  Mass: {
    type: 'unit',
    definition:
      'The numeric mass of the animal from which the sample was collected, at the time of sample collection. Mass must be expressed in kilograms. Units will eventually be configured in the dataset settings.',
    unitType: 'mass',
  },
  Length: {
    type: 'unit',
    definition:
      'The numeric length of the animal from which the sample was collected, at the time of sample collection. Length must be expressed in meters. Units will eventually be configured in the dataset settings.',
    unitType: 'length',
  },
} as const

export default defaultColumns
