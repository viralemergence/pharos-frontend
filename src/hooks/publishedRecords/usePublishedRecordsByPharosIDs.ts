import React, { useEffect } from 'react'
import fetchPublishedRecords, {
  LoadMore,
  PublishedRecordsData,
  PublishedRecordsLoadingState,
  publishedRecordsInitialData,
} from './fetchPublishedRecords'

interface UsePublishedRecordsByPharosIDsProps {
  pharosIDs: string[]
  pageSize: number
}

const usePublishedRecordsByPharosIDs = ({
  pharosIDs,
  pageSize,
}: UsePublishedRecordsByPharosIDsProps): [PublishedRecordsData, LoadMore] => {
  const [publishedRecordsData, setPublishedRecordsData] =
    React.useState<PublishedRecordsData>({
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
      filters: [{ id: 'pharos_id', values: pharosIDs.slice(0, pageSize) }],
      page: 1,
      setPublishedRecordsData,
      append: false,
    })

    return () => {
      ignore = true
    }
  }, [pharosIDs, pageSize])

  const loadMore: LoadMore = () => {
    console.log('loadmore called')
    if (
      publishedRecordsData.status === PublishedRecordsLoadingState.ERROR ||
      publishedRecordsData.status === PublishedRecordsLoadingState.LOADING ||
      publishedRecordsData.status === PublishedRecordsLoadingState.LOADING_MORE
    )
      return

    const page = Math.ceil(
      publishedRecordsData.data.publishedRecords.length / pageSize
    )

    const filters = [
      {
        id: 'pharos_id',
        values: pharosIDs.slice(page * pageSize, pageSize * (page + 1)),
      },
    ]

    if (filters[0].values.length > 0) {
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
        page: 1,
        setPublishedRecordsData,
        append: true,
        overwriteRowNumber: true,
      })
    }
  }

  return [publishedRecordsData, loadMore]
}

export default usePublishedRecordsByPharosIDs
