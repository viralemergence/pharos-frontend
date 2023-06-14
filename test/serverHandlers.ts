import { rest } from 'msw'

const handlers = [
  rest.get(
    `${process.env.GATSBY_API_URL}/published-records`,
    async (_req, res, ctx) => {
      const data = { publishedRecords: [], isLastPage: true }
      return res(ctx.json(data))
    }
  ),
  rest.get(
    `${process.env.GATSBY_API_URL}/metadata-for-published-records`,
    async (_req, res, ctx) => {
      const metadata = {
        fields: {
          project_name: {
            label: 'Project name',
            dataGridKey: 'Project name',
            options: ['Project A', 'Project B', 'Project C'],
          },
          researcher_name: {
            label: 'Author',
            dataGridKey: 'Authors',
            options: ['Author A', 'Author B', 'Author C'],
          },
          host_species: {
            options: ['Species 1', 'Species 2', 'Species 3'],
            label: 'Host species',
            dataGridKey: 'Host species',
          },
          detection_target: {
            options: ['Target 1', 'Target 2', 'Target 3'],
            label: 'Detection target',
            dataGridKey: 'Detection target',
          },
          detection_outcome: {
            options: ['Negative', 'Positive'],
            label: 'Detection outcome',
            dataGridKey: 'Detection outcome',
          },
          pathogen: {
            options: ['Pathogen 1', 'Pathogen 2', 'Pathogen 3'],
            label: 'Pathogen',
            dataGridKey: 'Pathogen',
          },
          collection_start_date: {
            label: 'Collected on or after date',
            dataGridKey: 'Collection date',
            type: 'date',
            filterGroup: 'collection_date',
          },
          collection_end_date: {
            label: 'Collected on or before date',
            dataGridKey: 'Collection date',
            type: 'date',
            filterGroup: 'collection_date',
          },
        },
      }
      return res(ctx.json(metadata))
    }
  ),
]

export { handlers }
