export enum PublishedResearchersStatus {
  Loading,
  Loaded,
  Error,
}

interface PublishedResearchersLoading {
  status: PublishedResearchersStatus.Loading
}

interface PublishedResearchersLoaded {
  status: PublishedResearchersStatus.Loaded
  data: PublishedResearcher[]
}

interface PublishedResearchersError {
  status: PublishedResearchersStatus.Error
  error: Error
}

export type PublishedResearchersData =
  | PublishedResearchersLoading
  | PublishedResearchersLoaded
  | PublishedResearchersError

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
      error,
    })
  })

  if (ignore) return

  if (!response) {
    setPublishedResearchers({
      status: PublishedResearchersStatus.Error,
      error: new Error('No Response'),
    })
    return
  }

  const data = await response.json()

  if (!dataIsPublishedResearchersResponse(data)) {
    setPublishedResearchers({
      status: PublishedResearchersStatus.Error,
      error: new Error('Invalid Response'),
    })
    return
  }

  setPublishedResearchers({
    status: PublishedResearchersStatus.Loaded,
    data: data.data,
  })
}

export default fetchPublishedResearchers
