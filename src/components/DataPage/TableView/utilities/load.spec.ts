import { getQueryStringParameters } from './load'
import { SortStatus } from 'components/PublicViews/PublishedRecordsDataGrid/PublishedRecordsDataGrid'
import type { Filter } from 'pages/data'

describe('getQueryStringParameters', () => {
  it('adds sorts to the query string', () => {
    const actual = getQueryStringParameters(
      [],
      [
        { dataGridKey: 'Host species', status: SortStatus.Selected },
        { dataGridKey: 'Collection date', status: SortStatus.Reverse },
      ],
      [],
      true
    )
    const expected =
      'sort=Host+species&sort=-Collection+date&page=1&pageSize=50'
    expect(actual.toString()).toEqual(expected)
  })

  it('adds filters to the query string', () => {
    const filters: Filter[] = [
      {
        id: 'host_species',
        label: 'Host species',
        type: 'text',
        dataGridKey: 'Host species',
        options: ['Species A', 'Species B'],
        addedToPanel: true,
        values: ['Species A', 'Species B'],
        applied: false,
        panelIndex: 0,
        valid: true,
      },
      {
        id: 'researcher',
        label: 'Researcher',
        type: 'text',
        dataGridKey: 'Researcher',
        options: ['Researcher One', 'Researcher Two'],
        addedToPanel: true,
        values: ['Researcher One'],
        applied: false,
        panelIndex: 1,
        valid: true,
      },
    ]
    const actual = getQueryStringParameters(filters, [], [], true)
    const expected =
      'host_species=Species+A&host_species=Species+B&researcher=Researcher+One&page=1&pageSize=50'
    expect(actual.toString()).toEqual(expected)
  })
})
