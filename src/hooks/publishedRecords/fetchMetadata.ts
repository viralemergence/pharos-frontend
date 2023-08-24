export interface PublishedRecord {
  [key: string]: string | number
}

export interface PublishedRecordsResponse {
  isLastPage: boolean
  publishedRecordsMetadata: PublishedRecord[]
}

export enum PublishedRecordsLoadingState {
  INITIAL,
  LOADING,
  LOADING_MORE,
  LOADED,
  ERROR,
}

export interface PublishedRecordsLoading {
  status: PublishedRecordsLoadingState.INITIAL
  data: PublishedRecordsResponse
}

export interface PublishedRecordsInitial {
  status: PublishedRecordsLoadingState.LOADING
  data: PublishedRecordsResponse
}

export interface PublishedRecordsLoadingMore {
  status: PublishedRecordsLoadingState.LOADING_MORE
  data: PublishedRecordsResponse
}

export interface PublishedRecordsLoaded {
  status: PublishedRecordsLoadingState.LOADED
  data: PublishedRecordsResponse
}

export interface PublishedRecordsError {
  status: PublishedRecordsLoadingState.ERROR
  error: Error
}

interface ErrorWithMessage {
  message: string
}

export type PublishedRecordsData =
  | PublishedRecordsInitial
  | PublishedRecordsLoading
  | PublishedRecordsLoadingMore
  | PublishedRecordsLoaded
  | PublishedRecordsError

export interface UsePublishedRecordsProps {
  pageSize: number
  filters: {
    [key: string]: string[]
  }
}

const dataIsPublishedRecordsResponse = (
  data: unknown
): data is PublishedRecordsResponse => {
  if (!(typeof data === 'object') || data === null) return false
  if (!('isLastPage' in data)) return false
  if (!('publishedRecordsMetadata' in data)) return false
  if (!Array.isArray(data.publishedRecordsMetadata)) return false
  if (!(data.isLastPage === true || data.isLastPage === false)) return false
  return true
}

export interface FetchPublishedRecordsProps {
  filters: {
    [key: string]: string[]
  }
  page: number
  pageSize: number
  setPublishedRecordsData: React.Dispatch<
    React.SetStateAction<PublishedRecordsData>
  >
  ignore: boolean
  append: boolean
  overwriteRowNumber?: boolean
}

export type LoadMore = () => void

export const publishedRecordsMetadataInitialData = {
  isLastPage: false,
  publishedRecordsMetadata: [],
}

const fetchPublishedRecords = async ({
  ignore,
  append,
  filters,
  page,
  pageSize,
  setPublishedRecordsData,
  overwriteRowNumber = false,
}: FetchPublishedRecordsProps) => {
  const params = new URLSearchParams()
  params.append('page', page.toString())
  params.append('pageSize', pageSize.toString())

  Object.entries(filters).forEach(([key, value]) => {
    value.forEach(v => {
      params.append(key, v)
    })
  })

  const response = await fetch(
    `${process.env.GATSBY_API_URL}/published-records/?` + params.toString()
  ).catch(error => {
    setPublishedRecordsData({
      status: PublishedRecordsLoadingState.ERROR,
      error,
    })
  })

  if (ignore) return

  if (!response) {
    setPublishedRecordsData({
      status: PublishedRecordsLoadingState.ERROR,
      error: new Error('No Response'),
    })
    return
  }

  if (!response.ok) {
    const message = (await response.json()) as ErrorWithMessage
    setPublishedRecordsData({
      status: PublishedRecordsLoadingState.ERROR,
      error: new Error(
        `Status: ${response.status}; ${JSON.stringify(message)}`
      ),
    })
    return
  }

  const data = (await response.json()) as PublishedRecord[]

  if (isValidMetadataResponse(data)) {
      setPublishedRecordsData(prev => {
        if (prev.status === PublishedRecordsLoadingState.ERROR)
          return {
            status: PublishedRecordsLoadingState.LOADED,
            data,
          }
        else {
          const nextRecords = [
            ...prev.data.publishedRecordsMetadata,
            ...data.publishedRecordsMetadata,
          ]
          return {
            status: PublishedRecordsLoadingState.LOADED,
            data: {
              isLastPage: data.isLastPage,
              publishedRecordsMetadata: [
                ...prev.data.publishedRecordsMetadata,
                ...data.publishedRecordsMetadata,
              ],
            },
          }
        }
      })
    else
      setPublishedRecordsData({
        status: PublishedRecordsLoadingState.LOADED,
        data,
      })

    return
  } else {
    setPublishedRecordsData({
      status: PublishedRecordsLoadingState.ERROR,
      error: new Error('Invalid Response Structure'),
    })
    return
  }
}

const isValidMetadataResponse = (data: unknown): data is MetadataResponse => {
  if (!isNormalObject(data)) return false
  const { possibleFilters, sortableFields = [] } = data
  if (!isNormalObject(possibleFilters)) return false
  if (!Array.isArray(sortableFields)) return false
  if (!sortableFields.every(field => typeof field === 'string')) return false
  if (
    !Object.values(possibleFilters).every?.(filter =>
      isValidFilterInMetadataResponse(filter)
    )
  )
    return false
  return true
}

interface MetadataResponse {
  possibleFilters: Record<string, FilterInMetadata>
  sortableFields?: string[]
}

interface FilterInMetadata {
  label: string
  type?: 'text' | 'date'
  dataGridKey: string
  options: string[]
}

const isValidFilterInMetadataResponse = (data: unknown): data is Filter => {
  if (!isNormalObject(data)) return false
  const { label, dataGridKey = '', type = 'text', options = [] } = data
  return (
    typeof label === 'string' &&
    typeof dataGridKey === 'string' &&
    typeof type === 'string' &&
    ['text', 'date'].includes(type) &&
    Array.isArray(options) &&
    options.every?.(option => typeof option === 'string')
  )
}


export default fetchPublishedRecords
