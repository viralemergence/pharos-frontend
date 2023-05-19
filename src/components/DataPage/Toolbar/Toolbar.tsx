import React from 'react'
import styled from 'styled-components'

export enum View {
	map = 'map',
	globe = 'globe',
	table = 'table',
}

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
	padding: 10px;
	box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
`
const DataToolbarRadioButtonContainer = styled(DataToolbarButtonContainer)``
const DataToolbarDiv = styled.div<{ isFilterPanelOpen: boolean }>`
	position: absolute;
	top: 97px;
	left: 10px;
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
}: {
	isFilterPanelOpen: boolean
	setIsFilterPanelOpen: (open: boolean) => void
	view: View
	changeView: (view: View) => void
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
