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
import TableView, { Row } from 'components/DataPage/TableView/TableView'
import DataToolbar, { View } from 'components/DataPage/Toolbar/Toolbar'

import FilterPanel from 'components/DataPage/FilterPanel/FilterPanel'
import {
	loadDebounceDelay,
	Field,
	Filter,
	FilterValues,
} from 'components/DataPage/FilterPanel/constants'

const ViewContainer = styled.main`
	flex: 1;
	position: relative;
	width: 100%;
	display: flex;
	flex-flow: column nowrap;
	gap: 20px;
	main {
		display: flex;
		flex-flow: row nowrap;
		width: 100%;
		height: calc(100vh - 197px);
		@media (max-width: 768px) {
			height: calc(100vh - 73px);
		}
	}
	background-color: rgb(5, 10, 55); //#3d434e;
	padding-bottom: 1rem;
`

const ViewMain = styled.main`
	position: relative;
`

const DataPage = styled.div`
	display: flex;
	flex-flow: column nowrap;
	height: 100vh;
	width: 100vw;
`

interface PublishedRecordsResponse {
	publishedRecords: Row[]
	isLastPage: boolean
}

const isTruthyObject = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && !!value

const isValidRecordsResponse = (
	data: unknown
): data is PublishedRecordsResponse => {
	if (!isTruthyObject(data)) return false
	const { publishedRecords, isLastPage } =
		data as Partial<PublishedRecordsResponse>
	if (!isTruthyObject(publishedRecords)) return false
	if (typeof isLastPage !== 'boolean') return false
	return publishedRecords.every(row => typeof row === 'object')
}

const isValidFieldInMetadataResponse = (data: unknown): data is Field => {
	if (!isTruthyObject(data)) return false
	const {
		label,
		dataGridKey = '',
		type = '',
		options = [],
	} = data as Partial<Field>
	if (typeof label !== 'string') return false
	if (typeof dataGridKey !== 'string') return false
	if (typeof type !== 'string') return false
	if (!options.every(option => typeof option === 'string')) return false
	return true
}

const isValidMetadataResponse = (data: unknown): data is MetadataResponse => {
	if (!isTruthyObject(data)) return false
	const { fields } = data as Partial<MetadataResponse>
	if (!isTruthyObject(fields)) return false
	return Object.values(fields as Record<string, unknown>).every?.(field =>
		isValidFieldInMetadataResponse(field)
	)
}

interface MetadataResponse {
	fields: Record<string, Field>
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
	// Switch debouncing on for 3 seconds
	const debounceTimeout = 3000
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
	if (!isValidRecordsResponse(data)) {
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

const getViewAndFiltersFromHash = () => {
	type keyValuePair = [string, string] // key, value
	const keyValuePairs: keyValuePair[] = Array.from(
		new URLSearchParams(window.location.hash.slice(1)).entries()
	)
	let view: string | null = null
	const filtersObj: Record<string, string[]> = {}
	for (const [key, value] of keyValuePairs) {
		if (key === 'view') view = value
		else {
			// Combine hash fields with the same key into an array
			filtersObj[key] ||= []
			filtersObj[key].push(value)
		}
	}
	// Convert filters to array of Filter objects
	const filters: Filter[] = Object.entries(filtersObj).map(
		([fieldId, values]) => ({
			fieldId,
			values,
		})
	)
	return { view, filters }
}

const isValidView = (maybeView: unknown): maybeView is View => {
	if (typeof maybeView !== 'string') return false
	return Object.values(View).includes(maybeView)
}

/** Check that the filter data extracted from window.location.hash is an array
 * of objects with a fieldId and an array of values. Note that this function
 * doesn't use the metadata to check that the fieldIds correspond to supported
 * fields. A blank array is valid filter data. */
const isValidFilterData = (
	maybeFilterData: unknown
): maybeFilterData is Filter[] => {
	if (!Array.isArray(maybeFilterData)) return false
	return maybeFilterData.every(maybeFilter => {
		const { fieldId, values } = maybeFilter as Partial<Filter>
		if (typeof fieldId !== 'string') return false
		if (!Array.isArray(values)) return false
		return values.every?.(value => typeof value === 'string')
	})
}

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

	const [fields, setFields] = useState<Record<string, Field>>({})
	// TODO: Open on mobile by default only if filters are set through hash
	const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true)

	const changeView = (view: View) => {
		updateHash({ newView: view })
		setView(view)
	}

	// TODO: Perhaps debounce to prevent flash of different hash
	const updateHash = ({
		newView = view,
		newFilters = filters,
	}: {
		newView?: View
		newFilters?: Filter[]
	}) => {
		const data = [
			['view', newView],
			...newFilters.flatMap(({ fieldId, values }) =>
				values.sort().map(value => [fieldId, value])
			),
		]
		window.location.hash = new URLSearchParams(data).toString()
	}

	/** Update the view and filters based on the hash */
	const updatePageFromHash = () => {
		const hashData = getViewAndFiltersFromHash()
		const viewInHash = hashData.view
		const filtersInHash = hashData.filters

		if (isValidView(viewInHash)) {
			setView(viewInHash)
		} else console.error('Invalid view in hash')

		if (isValidFilterData(filtersInHash)) {
			setFilters(filtersInHash)
			// The load function is debounced because the user might press the browser's back or
			// forward button many times in a row
			loadFilteredRecords(filtersInHash)
		} else console.error('Invalid filter data in hash')
	}

	useEffect(() => {
		const getMetadata = async () => {
			const response = await fetch(
				`${process.env.GATSBY_API_URL}/metadata-for-published-records`
			)
			const data = await response.json()
			if (!isValidMetadataResponse(data)) {
				console.error('GET /metadata-for-published-records: malformed response')
				return
			}
			setFields(data.fields)
		}
		getMetadata()

		updatePageFromHash()
		window.addEventListener('hashchange', updatePageFromHash)
		return () => {
			window.removeEventListener('hashchange', updatePageFromHash)
		}
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
		updateHash({ newFilters })
		loadFilteredRecords(newFilters)
	}

	const clearFilters = () => {
		setFilters([])
		updateHash({ newFilters: [] })
		if (filters.some(({ values }) => values.length > 0)) {
			// Don't debounce when clearing filters
			loadFilteredRecords([], false)
		}
	}

	const showEarth = [View.globe, View.map].includes(view)

	return (
		<Providers>
			<CMS.SEO />
			<DataPage>
				<NavBar />
				<ViewContainer>
					<DataToolbar
						view={view}
						changeView={changeView}
						isFilterPanelOpen={isFilterPanelOpen}
						setIsFilterPanelOpen={setIsFilterPanelOpen}
						filters={filters}
					/>
					<MapView
						projection={view === 'globe' ? 'globe' : 'naturalEarth'}
						style={{
							filter: showEarth ? 'none' : 'blur(30px)',
						}}
						disabled={!showEarth}
					/>
					<ViewMain>
						<FilterPanel
							isFilterPanelOpen={isFilterPanelOpen}
							setIsFilterPanelOpen={setIsFilterPanelOpen}
							fields={fields}
							filters={filters}
							updateFilter={updateFilter}
							setFilters={setFilters}
							clearFilters={clearFilters}
						/>
						<TableView
							fields={fields}
							appliedFilters={appliedFilters}
							loadPublishedRecords={() => {
								// Filtered records are loaded immediately on TableReview
								// render without debouncing
								loadFilteredRecords(filters, false)
								debouncing.current.on = false
							}}
							loading={loading}
							page={page}
							publishedRecords={publishedRecords}
							reachedLastPage={reachedLastPage}
							style={{
								display: view === View.table ? 'grid' : 'none',
							}}
						/>
					</ViewMain>
				</ViewContainer>
			</DataPage>
		</Providers>
	)
}

export default DataView
