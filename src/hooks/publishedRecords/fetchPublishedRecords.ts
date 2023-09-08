import type { Sort } from 'components/PublicViews/PublishedRecordsDataGrid/PublishedRecordsDataGrid'
import type { SimpleFilter } from 'pages/data'
import { getQueryStringParameters } from 'components/DataPage/TableView/utilities/load'

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
  pageSize?: number
  filters: SimpleFilter[]
  sorts: Sort[]
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
  filters: SimpleFilter[]
  sorts?: Sort[]
  page: number
  pageSize?: number
  setPublishedRecordsData: React.Dispatch<
    React.SetStateAction<PublishedRecordsData>
  >
  ignore: boolean
  append: boolean
  overwriteRowNumber?: boolean
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
  sorts,
  page,
  pageSize,
  setPublishedRecordsData,
  overwriteRowNumber = false,
}: FetchPublishedRecordsProps) => {
  const params = getQueryStringParameters({
    filters,
    sorts,
    pageToLoad: page,
    pageSize,
    replaceRecords: !append,
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

  if (dataIsPublishedRecordsResponse(data)) {
    if (append)
      setPublishedRecordsData(prev => {
        if (prev.status === PublishedRecordsLoadingState.ERROR)
          return {
            status: PublishedRecordsLoadingState.LOADED,
            data,
          }
        else {
          const nextRecords = [
            ...prev.data.publishedRecords,
            ...data.publishedRecords,
          ]
          if (overwriteRowNumber) {
            nextRecords.forEach((record, index) => {
              record.rowNumber = index + 1
            })
          }
          return {
            status: PublishedRecordsLoadingState.LOADED,
            data: {
              isLastPage: data.isLastPage,
              publishedRecords: [
                ...prev.data.publishedRecords,
                ...data.publishedRecords,
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

export default fetchPublishedRecords
