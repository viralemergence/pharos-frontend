import fetchPublishedRecords, {
  LoadMore,
  PublishedRecordsData,
  PublishedRecordsLoadingState,
  UsePublishedRecordsProps,
  publishedRecordsInitialData,
} from './fetchPublishedRecords'

import { useEffect, useState } from 'react'
import { countPages } from 'components/DataPage/TableView/utilities/load'

const usePublishedRecords = ({
  pageSize,
  filters,
  sorts,
}: UsePublishedRecordsProps): [PublishedRecordsData, LoadMore] => {
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
      sorts,
      page: 1,
      pageSize,
      setPublishedRecordsData,
      append: false,
    })

    return () => {
      ignore = true
    }
  }, [filters, sorts, pageSize])

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
        sorts,
        page:
          countPages(publishedRecordsData.data.publishedRecords, pageSize) + 1,
        setPublishedRecordsData,
        append: true,
      })
    }
  }

  return [publishedRecordsData, loadMore]
}

export default usePublishedRecords
