import React from 'react'
import styled from 'styled-components'
import type { Filter } from '../FilterPanel/constants'

export enum View {
	map = 'map',
	globe = 'globe',
	table = 'table',
}

// TODO: Hover cover for buttons, and change the size of the Filters button.

const DataToolbarButton = styled.button<{
	selected?: boolean
	width?: number
	extraStyle?: string
}>`
	${({ theme }) => theme.bigParagraph};
	z-index: 14;
	text-shadow: ${({ selected, theme }) => (selected ? 'none' : '0 0 2px #000')};
	position: relative;
	font-size: 16px;
	line-height: 25px;
	background: none;
	border: 0;
	background-color: ${({ selected, theme }) =>
		selected ? theme.mint : 'transparent'};
	${({ selected, theme }) =>
		selected ? '' : ' &:hover { background-color: rgba(50, 48, 48); } '}
	color: ${({ selected, theme }) => (selected ? theme.black : theme.white)};
	border-radius: 7px;
	margin-right: 10px;
	cursor: pointer;
	&:last-child {
		margin-right: 0;
	}
	width: ${({ width }) => (width ? width + 'px' : 'auto')};
	height: 100%;
	padding: 5px 10px;
	${props => props.extraStyle}
`

const DataToolbarRadioButton = styled(DataToolbarButton)``
const DataToolbarButtonContainer = styled.div`
	background-color: #202020;
	border-radius: 10px;
	position: relative;
	box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
`
const DataToolbarRadioButtonContainer = styled(DataToolbarButtonContainer)`
	padding: 5px;
`
const DataToolbarDiv = styled.div<{ isFilterPanelOpen: boolean }>`
	position: absolute;
	top: 97px;
	left: 30px;
	z-index: 10;
	display: flex;
	flex-flow: row wrap;
	gap: 1rem;
`

const DataToolbar = ({
	isFilterPanelOpen,
	setIsFilterPanelOpen,
	view,
	changeView,
	appliedFilters = [],
}: {
	isFilterPanelOpen: boolean
	setIsFilterPanelOpen: (open: boolean) => void
	view: View
	changeView: (view: View) => void
	appliedFilters: Filter[]
}) => {
	const ViewRadioButton = ({
		forView,
		label,
	}: {
		forView: View
		label: string
	}) => (
		<DataToolbarRadioButton
			selected={view === forView}
			onClick={() => changeView(forView)}
		>
			{label}
		</DataToolbarRadioButton>
	)

	return (
		<DataToolbarDiv isFilterPanelOpen={isFilterPanelOpen}>
			<DataToolbarButtonContainer>
				<DataToolbarButton
					selected={isFilterPanelOpen}
					onClick={() => {
						setIsFilterPanelOpen(!isFilterPanelOpen)
					}}
					width={100}
				>
					Filters
					{appliedFilters.length > 0 && (
						<span style={{ marginLeft: '5px' }}>({appliedFilters.length})</span>
					)}
				</DataToolbarButton>
			</DataToolbarButtonContainer>
			<DataToolbarRadioButtonContainer>
				<ViewRadioButton forView={View.map} label="Map" />
				<ViewRadioButton forView={View.globe} label="Globe" />
				<ViewRadioButton forView={View.table} label="Table" />
			</DataToolbarRadioButtonContainer>
		</DataToolbarDiv>
	)
}
export default DataToolbar
