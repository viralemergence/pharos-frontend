export enum PublishedResearchersStatus {
  Loading,
  Loaded,
  Error,
}

export interface PublishedResearchersData {
  status: PublishedResearchersStatus
  data: PublishedResearcher[]
  error: Error | null
}

export interface PublishedResearcher {
  researcherID: string
  name: string
  email: string
  organization: string
  projects: string[]
}

interface PublishedResearchersResponse {
  data: PublishedResearcher[]
}

const dataIsPublishedResearchersResponse = (
  data: unknown
): data is PublishedResearchersResponse => {
  if (typeof data !== 'object' || data === null) return false
  if (!('data' in data)) return false
  if (!Array.isArray(data.data)) return false
  if (
    !data.data.every(
      item =>
        typeof item === 'object' &&
        item !== null &&
        'researcherID' in item &&
        typeof item.researcherID === 'string' &&
        'name' in item &&
        typeof item.name === 'string' &&
        'email' in item &&
        typeof item.email === 'string' &&
        'organization' in item &&
        typeof item.organization === 'string' &&
        'projects' in item &&
        Array.isArray(item.projects)
    )
  )
    return false
  return true
}

export interface PublishedResearchersServerFilters {
  researcherIDs?: string[]
}

interface FetchPublishedResearchersProps {
  ignore: boolean
  filters?: PublishedResearchersServerFilters
  setPublishedResearchers: React.Dispatch<
    React.SetStateAction<PublishedResearchersData>
  >
}

const fetchPublishedResearchers = async ({
  setPublishedResearchers,
  filters = {},
  ignore,
}: FetchPublishedResearchersProps) => {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(
    ([key, value]: [
      string,
      PublishedResearchersServerFilters[keyof typeof filters]
    ]) => {
      value?.forEach(v => {
        params.append(key, v)
      })
    }
  )

  const response = await fetch(
    `${process.env.GATSBY_API_URL}/researchers/?` + params.toString()
  ).catch(error => {
    setPublishedResearchers({
      status: PublishedResearchersStatus.Error,
      data: [],
      error,
    })
  })

  if (ignore || !response) return

  const data = await response.json()

  if (!response.ok) {
    console.log(data)
    setPublishedResearchers({
      status: PublishedResearchersStatus.Error,
      error: new Error(JSON.stringify(data)),
      data: [],
    })
    return
  }

  if (!dataIsPublishedResearchersResponse(data)) {
    setPublishedResearchers({
      status: PublishedResearchersStatus.Error,
      error: new Error('Invalid Response structure'),
      data: [],
    })
    return
  }

  setPublishedResearchers({
    status: PublishedResearchersStatus.Loaded,
    data: data.data,
    error: null,
  })
}

export default fetchPublishedResearchers
