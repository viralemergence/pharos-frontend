import React, {
	Dispatch,
	MutableRefObject,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from 'react'
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
	debounceTimeout,
	Field,
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
	if (!options.every?.(option => typeof option === 'string')) return false
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

interface LoadPublishedRecordsOptions {
	appendResults?: boolean
	page: MutableRefObject<number>
	setLoading: Dispatch<SetStateAction<boolean>>
	setPublishedRecords: Dispatch<SetStateAction<Row[]>>
	setReachedLastPage: Dispatch<SetStateAction<boolean>>
	debouncing: MutableRefObject<Debouncing>
}

interface Debouncing {
	on: boolean
	timeout: ReturnType<typeof setTimeout> | null
}

const loadPublishedRecords = async ({
	appendResults = true,
	page,
	setLoading,
	setPublishedRecords,
	setReachedLastPage,
	debouncing,
}: LoadPublishedRecordsOptions) => {
	// Switch on debouncing for debounceTimeout milliseconds
	debouncing.current.on = true
	if (debouncing.current.timeout) clearTimeout(debouncing.current.timeout)
	debouncing.current.timeout = setTimeout(() => {
		debouncing.current.on = false
	}, debounceTimeout)

	if (!appendResults) page.current = 1
	setLoading(true)
	const params = new URLSearchParams()
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
		setLoading(false)
	}, 0)
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

const DataView = (): JSX.Element => {
	const [loading, setLoading] = useState(true)
	const [publishedRecords, setPublishedRecords] = useState<Row[]>([])
	const [reachedLastPage, setReachedLastPage] = useState(false)
	const page = useRef(1)
	const debouncing = useRef({ on: false, timeout: null })
	const [view, setView] = useState<View>(View.globe)

	const [fields, setFields] = useState<Record<string, Field>>({})

	// NOTE: Setting to false to better support mobile
	const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)

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
			setFields(data.fields)
		}
		getMetadata()
	}, [])

	const showEarth = [View.globe, View.map].includes(view)

	return (
		<Providers>
			<CMS.SEO />
			<DataPage>
				<NavBar />
				<ViewContainer isFilterPanelOpen={isFilterPanelOpen}>
					<DataToolbar
						view={view}
						changeView={changeView}
						isFilterPanelOpen={isFilterPanelOpen}
						setIsFilterPanelOpen={setIsFilterPanelOpen}
					/>
					<MapView
						projection={view === 'globe' ? 'globe' : 'naturalEarth'}
						style={{
							filter: showEarth ? 'none' : 'blur(30px)',
						}}
					/>
					<ViewMain>
						<FilterPanel
							isFilterPanelOpen={isFilterPanelOpen}
							setIsFilterPanelOpen={setIsFilterPanelOpen}
							fields={fields}
						/>
						<TableView
							loadPublishedRecords={() =>
								loadPublishedRecords({
									setLoading,
									setPublishedRecords,
									setReachedLastPage,
									page,
									debouncing,
								})
							}
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
