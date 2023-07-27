import { useEffect, useState } from 'react'

interface PublishedRecord {
  [key: string]: string | number
}

interface PublishedRecordsResponse {
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

interface PublishedRecordsInitial {
  status: PublishedRecordsLoadingState.LOADING
  data: PublishedRecordsResponse
}

interface PublishedRecordsLoading {
  status: PublishedRecordsLoadingState.INITIAL
  data: PublishedRecordsResponse
}

interface PublishedRecordsLoaded {
  status: PublishedRecordsLoadingState.LOADED
  data: PublishedRecordsResponse
}

interface PublishedRecordsError {
  status: PublishedRecordsLoadingState.ERROR
  error: Error
}

interface ErrorWithMessage {
  message: string
}

type PublishedRecordsData =
  | PublishedRecordsInitial
  | PublishedRecordsLoading
  | PublishedRecordsLoaded
  | PublishedRecordsError

interface UsePublishedRecordsProps {
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

interface FetchPublishedRecordsProps {
  filters: {
    [key: string]: string[]
  }
  page: number
  pageSize: number
  setPublishedRecordsData: React.Dispatch<
    React.SetStateAction<PublishedRecordsData>
  >
  ignore: boolean
}

const publishedRecordsInitialData = {
  isLastPage: false,
  publishedRecords: [],
}

const fetchPublishedRecords = async ({
  ignore,
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

type loadMore = () => void

const usePublishedRecords = ({
  pageSize,
  filters,
}: UsePublishedRecordsProps): [PublishedRecordsData, loadMore] => {
  const [publishedRecordsData, setPublishedRecordsData] =
    useState<PublishedRecordsData>({
      status: PublishedRecordsLoadingState.INITIAL,
      data: publishedRecordsInitialData,
    })

  useEffect(() => {
    let ignore = false

    setPublishedRecordsData(prev => ({
      status: PublishedRecordsLoadingState.LOADING,
      data:
        prev.status !== PublishedRecordsLoadingState.ERROR
          ? prev.data
          : publishedRecordsInitialData,
    }))

    fetchPublishedRecords({
      ignore,
      filters,
      page: 1,
      pageSize,
      setPublishedRecordsData,
    })

    return () => {
      ignore = true
    }
  }, [filters, pageSize])

  const loadMore = () => {
    if (
      publishedRecordsData.status !== PublishedRecordsLoadingState.ERROR &&
      publishedRecordsData.data.isLastPage === false
    ) {
      setPublishedRecordsData(prev => ({
        status: PublishedRecordsLoadingState.LOADING,
        data:
          prev.status !== PublishedRecordsLoadingState.ERROR
            ? prev.data
            : publishedRecordsInitialData,
      }))

      fetchPublishedRecords({
        ignore: false,
        filters,
        page: publishedRecordsData.data.publishedRecords.length / pageSize + 1,
        pageSize,
        setPublishedRecordsData,
      })
    }
  }

  return [publishedRecordsData, loadMore]
}

export default usePublishedRecords
