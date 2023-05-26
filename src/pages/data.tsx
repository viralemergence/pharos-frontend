import React, {
	useEffect,
	useRef,
	useState,
	Dispatch,
	SetStateAction,
	MutableRefObject,
} from 'react'
import styled from 'styled-components'
import debounce from 'lodash/debounce'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from 'components/layout/Providers'

import NavBar from 'components/layout/NavBar/NavBar'
import MapView from 'components/DataPage/MapView/MapView'
import TableView from 'components/DataPage/TableView/TableView'
import type { Row } from 'components/DataPage/TableView/TableView'
import DataToolbar, { View } from 'components/DataPage/Toolbar/Toolbar'

import FilterPanel from 'components/DataPage/FilterPanel/FilterPanel'
import {
	loadDebounceDelay,
	debounceTimeout,
	Filter,
	FilterValues,
} from 'components/DataPage/FilterPanel/constants'

const ViewContainer = styled.main`
	display: flex;
	background-color: ${props => props.theme.black};
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

// TODO: Rely on API
const metadataFields = [
	'hostSpecies',
	'pathogen',
	'detectionTarget',
	'detectionOutcome',
	'researcherName',
	'projectName',
]

const isValidMetadataResponse = (data: unknown): data is MetadataResponse => {
	if (typeof data !== 'object' || data === null) return false
	const options = (data as Partial<MetadataResponse>).optionsForFields
	if (typeof options !== 'object' || options === null) return false
	return (
		metadataFields.every(field =>
			(options as Record<string, unknown[]>)[field].every?.(
				item => typeof item === 'string'
			)
		) && Object.keys(options).length === metadataFields.length
	)
}

interface MetadataResponse {
	optionsForFields: Record<string, string[]>
}

interface Debouncing {
	on: boolean
	timeout: ReturnType<typeof setTimeout> | null
}

const loadPublishedRecords = async ({
	appendResults = true,
	filters,
	page,
	setLoading,
	setPublishedRecords,
	setAppliedFilters,
	setReachedLastPage,
	debouncing,
}: {
	appendResults?: boolean
	filters: Filter[]
	page: MutableRefObject<number>
	setLoading: Dispatch<SetStateAction<boolean>>
	setPublishedRecords: Dispatch<SetStateAction<Row[]>>
	setAppliedFilters: Dispatch<SetStateAction<Filter[]>>
	setReachedLastPage: Dispatch<SetStateAction<boolean>>
	debouncing: MutableRefObject<Debouncing>
}) => {
	// Switch on debouncing for debounceTimeout milliseconds
	debouncing.current.on = true
	if (debouncing.current.timeout) clearTimeout(debouncing.current.timeout)
	debouncing.current.timeout = setTimeout(() => {
		debouncing.current.on = false
	}, debounceTimeout)

	if (!appendResults) page.current = 1
	setLoading(true)
	const params = new URLSearchParams()
	const filtersToApply: Filter[] = []
	for (const filter of filters) {
		const { fieldId, values } = filter
		values.forEach(value => {
			params.append(fieldId, value)
		})
		if (values.length > 0) filtersToApply.push(filter)
	}
	params.append('page', page.current.toString())
	params.append('pageSize', '50')
	const response = await fetch(
		`${process.env.GATSBY_API_URL}/published-records?` + params
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
	setReachedLastPage(data.isLastPage)
	setTimeout(() => {
		setAppliedFilters(filtersToApply)
		setLoading(false)
	}, 0)
}

const loadPublishedRecordsDebounced = debounce(
	loadPublishedRecords,
	loadDebounceDelay
)

const DataView = (): JSX.Element => {
	const [loading, setLoading] = useState(true)
	const [publishedRecords, setPublishedRecords] = useState<Row[]>([])
	const [reachedLastPage, setReachedLastPage] = useState(false)
	const page = useRef(1)
	const debouncing = useRef({ on: false, timeout: null })
	const [view, setView] = useState<View>(View.globe)

	/** Filters that will be applied to the published records */
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
			if (!isValidMetadataResponse(data)) {
				console.error('GET /metadata-for-published-records: malformed response')
				return
			}
			setOptionsForFields(data.optionsForFields)
		}
		getMetadata()
	}, [])

	const loadFilteredRecords = (filters: Filter[], shouldDebounce = true) => {
		const options = {
			appendResults: false,
			page,
			filters,
			setLoading,
			setPublishedRecords,
			setAppliedFilters,
			setReachedLastPage,
			debouncing,
		}
		if (shouldDebounce && debouncing.current.on) {
			loadPublishedRecordsDebounced(options)
		} else {
			loadPublishedRecords(options)
		}
	}

	const updateFilter = (
		indexOfFilterToUpdate: number,
		newValues: FilterValues
	) => {
		const newFilters = [...filters]
		newFilters[indexOfFilterToUpdate].values = newValues
		setFilters(newFilters)
		loadFilteredRecords(newFilters)
	}

	const clearFilters = () => {
		setFilters([])
		if (filters.some(({ values }) => values.length > 0)) {
			// Don't debounce when clearing filters
			loadFilteredRecords([], false)
		}
	}

	const dataViewHeight = 'calc(100vh - 87px)'
	const panelHeight = 'calc(100vh - 190px)'
	const panelWidth = isFilterPanelOpen ? 410 : 0
	const tableViewWidthOffset = 0
	const tableViewWidth = `calc(100vw - ${panelWidth}px + ${tableViewWidthOffset}px)`
	const tableViewHeight = 'calc(100vh - 103px)'

	const showEarth = [View.globe, View.map].includes(view)

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
						updateFilter={updateFilter}
						setFilters={setFilters}
						clearFilters={clearFilters}
						height={panelHeight}
						optionsForFields={optionsForFields}
					/>
				)}
				<MapView
					projection={view === 'globe' ? 'globe' : 'naturalEarth'}
					height={dataViewHeight}
					style={{ display: showEarth ? 'flex' : 'none' }}
				/>
				<TableView
					height={dataViewHeight}
					appliedFilters={appliedFilters}
					loadPublishedRecords={() => {
						loadFilteredRecords(filters, false)
						debouncing.current.on = false
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
