import { Dataset } from 'hooks/useDatasets'

const createDataset = async (
  researcherID: string,
  name: string,
  date_collected: string,
  samples_taken: number,
  detection_run: number
) => {
  const response = await fetch(`${process.env.GATSBY_API_URL}/create-dataset`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      researcherID,
      date_collected,
      samples_taken,
      detection_run,
    }),
  }).catch(error => console.log(error))

  if (!response || !response.ok) return null
  return (await response.json()) as Dataset
}

export default createDataset
