import React, {
	useEffect,
	useRef,
	useState,
	Dispatch,
	SetStateAction,
	MutableRefObject,
} from 'react'
import styled from 'styled-components'
import { debounce } from 'lodash'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from 'components/layout/Providers'

import NavBar from 'components/layout/NavBar/NavBar'
import MapView from 'components/DataPage/MapView/MapView'
import TableView from 'components/DataPage/TableView/TableView'
import type { Row } from 'components/DataPage/TableView/TableView'
import DataToolbar, { View } from 'components/DataPage/Toolbar/Toolbar'

import FilterPanel from 'components/DataPage/FilterPanel/FilterPanel'
import {
	FILTER_DELAY,
	VALUE_SEPARATOR,
} from 'components/DataPage/FilterPanel/constants'
import type { Filter } from 'components/DataPage/FilterPanel/constants'

const ViewContainer = styled.main`
	display: flex;
`

interface PublishedRecordsResponse {
	publishedRecords: Row[]
	isLastPage: boolean
}

const isPublishedRecordsResponse = (
	data: unknown
): data is PublishedRecordsResponse => {
	if (typeof data !== 'object' || data === null) return false
	const { publishedRecords, isLastPage } =
		data as Partial<PublishedRecordsResponse>
	if (typeof publishedRecords !== 'object' || publishedRecords === null)
		return false
	if (typeof isLastPage !== 'boolean') return false
	return publishedRecords.every(row => typeof row === 'object')
}

const metadataFields = [
	'hostSpecies',
	'pathogen',
	'detectionOutcome',
	'detectionTarget',
]

const isMetadataResponse = (data: unknown): data is MetadataResponse => {
	if (typeof data !== 'object' || data === null) return false
	const options = (data as Partial<MetadataResponse>).optionsForFields
	if (typeof options !== 'object' || options === null) return false
	return metadataFields.every(field =>
		(options as Record<string, unknown[]>)[field].every?.(
			item => typeof item === 'string'
		)
	)
}

interface MetadataResponse {
	optionsForFields: Record<string, string[]>
}

const loadPublishedRecords = debounce(
	async ({
		appendResults = true,
		filters,
		page,
		setLoading,
		setPublishedRecords,
		setAppliedFilters,
		setReachedLastPage,
	}: {
		appendResults?: boolean
		filters: Filter[]
		page: MutableRefObject<number>
		setLoading: Dispatch<SetStateAction<boolean>>
		setPublishedRecords: Dispatch<SetStateAction<Row[]>>
		setAppliedFilters: Dispatch<SetStateAction<Filter[]>>
		setReachedLastPage: Dispatch<SetStateAction<boolean>>
	}) => {
		if (!appendResults) page.current = 1
		setLoading(true)
		const params: Record<string, string> = {
			page: page.current.toString(),
			pageSize: '50',
		}
		const pendingFilters = []
		for (const filter of filters) {
			const { fieldId, value } = filter
			const formattedValue = Array.isArray(value)
				? value.join(VALUE_SEPARATOR)
				: value
			if (!formattedValue) continue
			params[fieldId] = formattedValue
			pendingFilters.push(filter)
		}
		const response = await fetch(
			`${process.env.GATSBY_API_URL}/published-records?` +
				new URLSearchParams(params)
		)

		if (!response.ok) {
			console.log('GET /published-records: error')
			setLoading(false)
			return
		}
		const data = await response.json()
		if (!isPublishedRecordsResponse(data)) {
			console.log('GET /published-records: malformed response')
			setLoading(false)
			return
		}
		setPublishedRecords((previousRecords: Row[]) => [
			...(appendResults ? previousRecords : []),
			...data.publishedRecords,
		])
		setAppliedFilters(pendingFilters)
		setLoading(false)
		setReachedLastPage(data.isLastPage)
	},
	FILTER_DELAY
)

const DataView = (): JSX.Element => {
	const [loading, setLoading] = useState(true)
	const [publishedRecords, setPublishedRecords] = useState<Row[]>([])
	const [reachedLastPage, setReachedLastPage] = useState(false)
	const page = useRef(1)
	const [view, setView] = useState<View>(View.globe)

	/** The filters to be applied */
	const [filters, setFilters] = useState<Filter[]>([])

	/** Filters that have been successfully applied to the published
	 * records. That is, these filters have been sent to the server, and it
	 * responded with an appropriate subset of the records. This is used for
	 * color-coding the filtered columns. */
	const [appliedFilters, setAppliedFilters] = useState<Filter[]>([])

	const [optionsForFields, setOptionsForFields] = useState<
		Record<string, string[]>
	>({})

	const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true)

	const changeView = (view: View) => {
		window.location.hash = view
		setView(view)
	}

	useEffect(() => {
		const hash = window.location.hash.replace('#', '')

		function hashIsView(hash: string): hash is View {
			return Object.values(View).includes(hash)
		}

		if (hashIsView(hash)) {
			setView(hash)
		}

		const getMetadata = async () => {
			const response = await fetch(
				`${process.env.GATSBY_API_URL}/metadata-for-published-records`
			)
			const data = await response.json()
			if (!isMetadataResponse(data)) {
				console.error('GET /metadata-for-published-records: malformed response')
				return
			}
			setOptionsForFields(data.optionsForFields)
		}
		getMetadata()
	}, [])

	const applyFilter = (filterIndex: number, newFilterValue: string) => {
		setFilters(filters => {
			filters[filterIndex].value = newFilterValue
			return filters
		})

		loadPublishedRecords({
			appendResults: false,
			page,
			filters,
			setLoading,
			setPublishedRecords,
			setAppliedFilters,
			setReachedLastPage,
		})
	}

	const dataViewHeight = 'calc(100vh - 87px)'
	const panelHeight = 'calc(100vh - 190px)'
	const panelWidth = isFilterPanelOpen ? 410 : 0
	const tableViewWidthOffset = 0 // isFilterPanelOpen ? -60 : 10
	const tableViewWidth = `calc(100vw - ${panelWidth}px + ${tableViewWidthOffset}px)`
	const tableViewHeight = 'calc(100vh - 103px)'

	return (
		<Providers>
			<CMS.SEO />
			<NavBar />
			<DataToolbar
				view={view}
				changeView={changeView}
				isFilterPanelOpen={isFilterPanelOpen}
				setIsFilterPanelOpen={setIsFilterPanelOpen}
				appliedFilters={appliedFilters}
			/>
			<ViewContainer>
				{isFilterPanelOpen && (
					<FilterPanel
						isFilterPanelOpen={isFilterPanelOpen}
						setIsFilterPanelOpen={setIsFilterPanelOpen}
						filters={filters}
						applyFilter={applyFilter}
						setFilters={setFilters}
						height={panelHeight}
						optionsForFields={optionsForFields}
					/>
				)}
				<MapView
					projection={view === 'globe' ? 'globe' : 'naturalEarth'}
					height={dataViewHeight}
				/>
				<TableView
					height={dataViewHeight}
					appliedFilters={appliedFilters}
					loadPublishedRecords={() => {
						loadPublishedRecords({
							page,
							filters,
							setLoading,
							setPublishedRecords,
							setAppliedFilters,
							setReachedLastPage,
						})
					}}
					loading={loading}
					page={page}
					publishedRecords={publishedRecords}
					reachedLastPage={reachedLastPage}
					style={{
						display: view === View.table ? 'grid' : 'none',
						width: tableViewWidth,
						height: tableViewHeight,
					}}
				/>
			</ViewContainer>
		</Providers>
	)
}

export default DataView
