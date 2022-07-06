const createDataset = async (
  researcherID: string,
  dataset_name: string,
  date_collected: string,
  samples_taken: number,
  detection_run: number
) => {
  const response = await fetch(`${process.env.GATSBY_API_URL}/create-dataset`, {
    method: 'POST',
    body: JSON.stringify({
      researcherID,
      dataset_name,
      date_collected,
      samples_taken,
      detection_run,
    }),
  }).catch(error => console.log(error))

  if (!response || !response.ok) return false
  return true
}

export default createDataset
