import fetchPublishedRecords, {
  LoadMore,
  PublishedRecordsData,
  PublishedRecordsLoadingState,
  UsePublishedRecordsProps,
  publishedRecordsInitialData,
} from './fetchPublishedRecords'

import { useEffect, useState } from 'react'

const usePublishedRecords = ({
  pageSize,
  filters,
}: UsePublishedRecordsProps): [PublishedRecordsData, LoadMore] => {
  const [publishedRecordsData, setPublishedRecordsData] =
    useState<PublishedRecordsData>({
      status: PublishedRecordsLoadingState.INITIAL,
      data: publishedRecordsInitialData,
    })

  useEffect(() => {
    let ignore = false
    console.log('usePublishedRecords: useEffect')

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
      append: false,
    })

    return () => {
      ignore = true
    }
  }, [filters, pageSize])

  const loadMore: LoadMore = () => {
    if (
      publishedRecordsData.status !== PublishedRecordsLoadingState.ERROR &&
      publishedRecordsData.status !== PublishedRecordsLoadingState.LOADING &&
      publishedRecordsData.status !==
        PublishedRecordsLoadingState.LOADING_MORE &&
      publishedRecordsData.data.isLastPage === false
    ) {
      setPublishedRecordsData(prev => ({
        status: PublishedRecordsLoadingState.LOADING_MORE,
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
        append: true,
      })
    }
  }

  return [publishedRecordsData, loadMore]
}

export default usePublishedRecords
