import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import type {
  Row,
  SummaryOfRecords,
} from 'components/PublicViews/PublishedRecordsDataGrid/PublishedRecordsDataGrid'
import isNormalObject from 'utilities/isNormalObject'

const RECORDS_URL = `${process.env.GATSBY_API_URL}/published-records`

/**
 * Fetch published records from the API
 * @returns {boolean} Whether the records were successfully fetched
 */
const fetchRecords = async ({
  queryStringParameters,
  replaceRecords,
  setRecords,
  setSummaryOfRecords,
  latestRecordsRequestIdRef,
}: {
  queryStringParameters: URLSearchParams
  replaceRecords: boolean
  latestRecordsRequestIdRef: MutableRefObject<number>
  setRecords: Dispatch<SetStateAction<Row[]>>
  setSummaryOfRecords: Dispatch<SetStateAction<SummaryOfRecords>>
}): Promise<boolean> => {
  latestRecordsRequestIdRef.current += 1
  const latestRecordsRequestId = latestRecordsRequestIdRef.current
  const currentRecordsRequestId = latestRecordsRequestId

  const url = `${RECORDS_URL}?${queryStringParameters}`

  let response
  try {
    response = await fetch(url)
  } catch (e) {
    console.log(`Error when fetching ${url}`)
  }

  const isLatestRecordsRequest =
    currentRecordsRequestId === latestRecordsRequestId
  if (!isLatestRecordsRequest) return false
  if (!response) return false
  if (!response.ok) {
    console.log(`GET ${url}: error`)
    return false
  }
  const data = await response.json()

  if (!isValidRecordsResponse(data)) {
    console.log(`GET ${url}: malformed response`)
    return false
  }
  setRecords((prev: Row[]) => {
    let records = data.publishedRecords
    if (!replaceRecords) {
      // Ensure that no two records have the same id
      const existingPharosIds = new Set(prev.map(row => row.pharosID))
      const rowsAlreadyInTheTable = records.filter((record: Row) =>
        existingPharosIds.has(record.pharosID)
      )
      if (rowsAlreadyInTheTable.length > 0)
        console.error(
          `The API returned ${rowsAlreadyInTheTable.length} rows that are already in the table`
        )
      records = [...prev, ...records]
    }
    // Sort records by row number, just in case pages come back from the
    // server in the wrong order
    records.sort((a: Row, b: Row) => Number(a.rowNumber) - Number(b.rowNumber))
    return records
  })
  setSummaryOfRecords({
    isLastPage: data.isLastPage,
    recordCount: data.recordCount,
    matchingRecordCount: data.matchingRecordCount,
  })
  return true
}

const isValidPublishedRecordsArray = (arr: unknown): arr is Row[] => {
  return (
    Array.isArray(arr) &&
    arr.every(row => {
      return (
        typeof row === 'object' &&
        row &&
        'rowNumber' in row &&
        typeof row.rowNumber === 'number'
      )
    })
  )
}

const isValidRecordsResponse = (
  data: unknown
): data is PublishedRecordsResponse => {
  if (!isNormalObject(data)) return false
  const { publishedRecords, isLastPage, recordCount, matchingRecordCount } =
    data as Partial<PublishedRecordsResponse>
  return (
    isValidPublishedRecordsArray(publishedRecords) &&
    typeof isLastPage === 'boolean' &&
    ['undefined', 'number'].includes(typeof recordCount) &&
    ['undefined', 'number'].includes(typeof matchingRecordCount)
  )
}

export interface PublishedRecordsResponse {
  publishedRecords: Row[]
  isLastPage: boolean
  recordCount?: number
  matchingRecordCount?: number
}

export default fetchRecords
