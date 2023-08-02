export interface PublishedRecord {
  [key: string]: string | number
}

export interface PublishedRecordsResponse {
  isLastPage: boolean
  publishedRecords: PublishedRecord[]
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
  if (!('publishedRecords' in data)) return false
  if (!Array.isArray(data.publishedRecords)) return false
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
}

export type LoadMore = () => void

export const publishedRecordsInitialData = {
  isLastPage: false,
  publishedRecords: [],
}

const fetchPublishedRecords = async ({
  ignore,
  append,
  filters,
  page,
  pageSize,
  setPublishedRecordsData,
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
      error: new Error(`Status: ${response.status}; ${message.message}`),
    })
    return
  }

  const data = (await response.json()) as PublishedRecord[]

  if (dataIsPublishedRecordsResponse(data)) {
    console.log('ignore', ignore)
    console.log('append', append)

    setPublishedRecordsData(prev =>
      prev.status === PublishedRecordsLoadingState.ERROR || page === 1
        ? {
            status: PublishedRecordsLoadingState.LOADED,
            data,
          }
        : {
            status: PublishedRecordsLoadingState.LOADED,
            data: {
              isLastPage: data.isLastPage,
              publishedRecords: [
                ...prev.data.publishedRecords,
                ...data.publishedRecords,
              ],
            },
          }
    )
    return
  } else {
    setPublishedRecordsData({
      status: PublishedRecordsLoadingState.ERROR,
      error: new Error('Invalid Response Structure'),
    })
    return
  }
}

export default fetchPublishedRecords
