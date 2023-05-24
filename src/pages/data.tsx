import React, { useCallback, useEffect, useRef, useState } from 'react'
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

const dataIsPublishedRecordsResponse = (
	data: unknown
): data is PublishedRecordsResponse => {
	if (!data || typeof data !== 'object') return false
	if (!('publishedRecords' in data)) return false
	if (!('isLastPage' in data)) return false
	if (!Array.isArray(data.publishedRecords)) return false
	if (!data.publishedRecords.every(row => typeof row === 'object')) return false
	return true
}

const metadataFields = [
	'hostSpecies',
	'pathogen',
	'detectionOutcome',
	'detectionTarget',
]

const dataIsMetadataResponse = (data: unknown): data is MetadataResponse => {
	if (!data || typeof data !== 'object') return false
	for (const field of metadataFields) {
		if (!('optionsForFields' in data)) return false
		if (!(field in data.optionsForFields)) return false
		if (!Array.isArray(data.optionsForFields[field])) return false
		if (!data.optionsForFields[field].every(item => typeof item === 'string'))
			return false
	}
	return true
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
	}) => {
		console.log('loading published records')
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
		if (!dataIsPublishedRecordsResponse(data)) {
			console.log('GET /published-records: malformed response')
			setLoading(false)
			return
		}
		setPublishedRecords(previousRecords => [
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
	}, [])

	useEffect(() => {
		const getMetadata = async () => {
			const response = await fetch(
				`${process.env.GATSBY_API_URL}/metadata-for-published-records`
			)
			const data = await response.json()
			if (!dataIsMetadataResponse(data)) {
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
					filters={filters}
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
						transition: isFilterPanelOpen ? 'width 0.1s ease-in-out' : '',
					}}
				/>
			</ViewContainer>
		</Providers>
	)
}

export default DataView
