import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import debounce from 'lodash/debounce'
import differenceBy from 'lodash/differenceBy'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from 'components/layout/Providers'

import NavBar from 'components/layout/NavBar/NavBar'
import MapView from 'components/DataPage/MapView/MapView'
import TableView, {
	Row,
	LoadPublishedRecordsOptions,
} from 'components/DataPage/TableView/TableView'
import DataToolbar, { View } from 'components/DataPage/Toolbar/Toolbar'

import FilterPanel from 'components/DataPage/FilterPanel/FilterPanel'
import {
	loadDebounceDelay,
	Field,
	Filter,
	FilterValues,
} from 'components/DataPage/FilterPanel/constants'

type hashKeyValuePair = [fieldId: string, value: string | null]

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
			height: 100%;
		}
	}
	background-color: rgb(5, 10, 55); //#3d434e;
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

const loadPublishedRecords = async ({
	filters,
	page,
	setLoading,
	setPublishedRecords,
	setAppliedFilters,
	setReachedLastPage,
	debouncing,
	clearRecordsFirst,
}: LoadPublishedRecordsOptions) => {
	const debounceTimeout = 3000
	// Switch on debouncing for 3 seconds
	debouncing.current.on = true
	if (debouncing.current.timeout) clearTimeout(debouncing.current.timeout)
	debouncing.current.timeout = setTimeout(() => {
		debouncing.current.on = false
	}, debounceTimeout)

	if (clearRecordsFirst) page.current = 1
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
		...(clearRecordsFirst ? [] : previousRecords),
		...data.publishedRecords,
	])
	setReachedLastPage(data.isLastPage)
	setTimeout(() => {
		setAppliedFilters(filtersToApply)
		setLoading(false)
	})
	if (clearRecordsFirst) {
		const dataGrid = document.querySelector('.rdg[role=grid]')
		if (dataGrid) dataGrid.scrollTop = 0
	}
}

const loadPublishedRecordsDebounced = debounce(
	loadPublishedRecords,
	loadDebounceDelay
)

const getViewAndFiltersFromHash = () => {
	const keyValuePairs: hashKeyValuePair[] = Array.from(
		new URLSearchParams(window.location.hash.slice(1)).entries()
	)
	let view: string | null = null
	// First make a filters record eince this is easier to update
	const filtersRecord: Record<string, string[]> = {}
	for (const [key, value] of keyValuePairs) {
		if (key === 'view') {
			view = value
		} else {
			filtersRecord[key] ||= []
			if (value) {
				// Combine hash fields with the same key into an array
				filtersRecord[key].push(value)
			}
			// NOTE: If value is '', the filter will have an empty array of values
		}
	}
	// Convert filters object to an array of Filter objects
	const filters: Filter[] = Object.entries(filtersRecord).map(
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

/**
 * Convert an array of key-value pairs into a hash string like
 * "key1=value1&key1=value2&key2&key3=value1"
 * NOTE: Unlike `new URLSearchParams(data).toString()`, this function lets a key have no
 * equals sign after it. We use this indicate that a filter is present in the
 * panel but has no values. */
const getHashFromKeyValuePairs = (pairs: hashKeyValuePair[]) =>
	pairs
		.map(([key, value]) =>
			value ? new URLSearchParams({ [key]: value }) : key
		)
		.join('&')

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

const DataView = (): JSX.Element => {
	const [loading, setLoading] = useState(true)
	const [publishedRecords, setPublishedRecords] = useState<Row[]>([])
	const [reachedLastPage, setReachedLastPage] = useState(false)
	const page = useRef(1)
	const debouncing = useRef({ on: false, timeout: null })
	const [view, setView] = useState<View>(View.globe)
	const [fields, setFields] = useState<Record<string, Field>>({})

	/** Filters that will be applied to the published records */
	const [filters, setFilters] = useState<Filter[]>([])

	/** Filters that have been successfully applied to the published
	 * records. That is, these filters have been sent to the server, and it
	 * responded with an appropriate subset of the records. This is used for
	 * color-coding the filtered columns. */
	const [appliedFilters, setAppliedFilters] = useState<Filter[]>([])

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
		const data: hashKeyValuePair[] = [
			['view', newView],
			...newFilters.flatMap(({ fieldId, values }) => {
				if (values.length) {
					return values
						.sort()
						.map(value => [fieldId, value] as hashKeyValuePair)
				} else {
					return [[fieldId, null] as hashKeyValuePair]
				}
			}),
		]
		window.location.hash = getHashFromKeyValuePairs(data)
	}

	/** Update the view and filters based on the hash */
	const updatePageFromHash = useCallback(() => {
		// Don't update page until metadata arrives
		if (!Object.values(fields)) return

		const hashData = getViewAndFiltersFromHash()
		const viewInHash = hashData.view
		const filtersInHash = hashData.filters

		if (isValidView(viewInHash)) {
			setView(viewInHash)
		} else console.error('Invalid view in hash')

		if (isValidFilterData(filtersInHash)) {
			setFilters(filtersInHash)
			const newFiltersInHash = differenceBy(
				filtersInHash,
				filters,
				filter => filter.fieldId
			)
			const onlyBlankFiltersAdded =
				filtersInHash.length > filters.length &&
				newFiltersInHash.every(filter => filter.values.length === 0)
			// If the only new filters are blank, the table does not need to change
			if (onlyBlankFiltersAdded) return
			// The load function is debounced because the user might press the browser's back or
			// forward button many times in a row
			// TODO: The comment says that the load function is debounced, but is it?
			load({ filters: filtersInHash }, false)
		} else console.error('Invalid filter data in hash')
	}, [])

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
	}, [updatePageFromHash])

	const loadRecordsOptions: LoadPublishedRecordsOptions = {
		page,
		filters,
		setLoading,
		setPublishedRecords,
		setAppliedFilters,
		setReachedLastPage,
		debouncing,
		clearRecordsFirst: true,
	}

	const load = (
		extraOptions: Partial<LoadPublishedRecordsOptions>,
		shouldDebounce = true
	) => {
		const options = { ...loadRecordsOptions, ...extraOptions }
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
		load({ filters: newFilters, clearRecordsFirst: true }, true)
	}

	const clearFilters = () => {
		setFilters([])
		updateHash({ newFilters: [] })
		if (filters.some(({ values }) => values.length > 0)) {
			// Don't debounce when clearing filters
			load({ filters: [] }, false)
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
							setFilters={setFilters}
							clearFilters={clearFilters}
							updateFilter={updateFilter}
							updateHash={updateHash}
						/>
						<TableView
							fields={fields}
							appliedFilters={appliedFilters}
							loadRecordsOptions={loadRecordsOptions}
							loadPublishedRecords={loadPublishedRecords}
							shouldLoadRecordsOnFirstRender={
								// Only load records on render if there are no filters in the
								// hash. If there are filters in the hash, updatePageFromHash
								// will load these records once these in-hash filters have been processed
								!getViewAndFiltersFromHash().filters.length
							}
							loading={loading}
							page={page}
							publishedRecords={publishedRecords}
							reachedLastPage={reachedLastPage}
							style={{
								display: view === View.table ? 'grid' : 'none',
							}}
							debouncing={debouncing}
						/>
					</ViewMain>
				</ViewContainer>
			</DataPage>
		</Providers>
	)
}

export default DataView
