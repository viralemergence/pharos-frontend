import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

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
	initialFilterData,
} from 'components/DataPage/FilterPanel/constants'
import type {
	FilterData,
	TimeoutsType,
} from 'components/DataPage/FilterPanel/constants'

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

const DataView = (): JSX.Element => {
	const [loading, setLoading] = useState(true)
	const [publishedRecords, setPublishedRecords] = useState<Row[]>([])
	const [reachedLastPage, setReachedLastPage] = useState(false)
	const [filterData, setFilterData] = useState<FilterData>(initialFilterData)
	const page = useRef(1)
	const filterTimeouts = useRef<TimeoutsType>({})
	const [view, setView] = useState<View>(View.globe)

	/** Ids of filters that have been successfully applied to the published
	 * records. That is, these filter ids have been sent to the server, and it
	 * responded with an appropriate subset of the records. This is used for
	 * color-coding the filtered columns. */
	const [appliedFilters, setAppliedFilters] = useState<string[]>([])

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

	const onFilterInput = (
		e: React.ChangeEvent<HTMLInputElement>,
		filterId = ''
	) => {
		const newFilterValue = e.target.value
		setFilterData(filterData => {
			const filter = filterData.get(filterId)
			if (filter) filter.value = newFilterValue
			else console.error(`Filter not found: ${filterId}`)
			return filterData
		})
		clearTimeout(filterTimeouts.current?.[filterId] ?? undefined)
		const timeout = setTimeout(
			() => loadPublishedRecords({ appendResults: false }),
			FILTER_DELAY
		)

		// Store timeout so we can restart it if the user types again
		filterTimeouts.current[filterId] = timeout
	}

	const loadPublishedRecords = useCallback(
		async ({ appendResults = true } = {}) => {
			setLoading(true)
			const params: Record<string, string> = {
				page: page.current.toString(),
				pageSize: '50',
			}
			const pendingFilters = []
			for (const [filterId, { value }] of filterData) {
				if (!value) continue
				params[filterId] = value
				pendingFilters.push(filterId)
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
			setReachedLastPage(data.isLastPage)
			setAppliedFilters(pendingFilters)
			setLoading(false)
		},
		[filterData, setPublishedRecords, setReachedLastPage, setLoading]
	)
	const dataViewHeight = 'calc(100vh - 87px)'
	const panelHeight = 'calc(100vh - 87px)'

	return (
		<Providers>
			<CMS.SEO />
			<NavBar />
			<DataToolbar
				view={view}
				changeView={changeView}
				isFilterPanelOpen={isFilterPanelOpen}
				setIsFilterPanelOpen={setIsFilterPanelOpen}
			/>
			<ViewContainer>
				{isFilterPanelOpen && (
					<FilterPanel
						isFilterPanelOpen={isFilterPanelOpen}
						filterData={filterData}
						onFilterInput={onFilterInput}
						height={panelHeight}
					/>
				)}
				<MapView
					projection={view === 'globe' ? 'globe' : 'naturalEarth'}
					height={dataViewHeight}
				/>
				<TableView
					height={dataViewHeight}
					appliedFilters={appliedFilters}
					filterData={filterData}
					loadPublishedRecords={loadPublishedRecords}
					loading={loading}
					page={page}
					publishedRecords={publishedRecords}
					reachedLastPage={reachedLastPage}
					style={{ display: view === View.table ? 'grid' : 'none' }}
				/>
			</ViewContainer>
		</Providers>
	)
}

export default DataView
