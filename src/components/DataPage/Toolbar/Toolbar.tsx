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
	z-index: ${({ theme }) => theme.zIndexes.dataToolbarButton};
	position: relative;
	font-size: 16px;
	line-height: 25px;
	background: none;
	border: 0;
	background-color: ${({ selected, theme }) =>
		selected ? theme.mint : 'transparent'};
	${({ selected, theme }) =>
		selected
			? ''
			: ` &:hover { background-color: ${theme.white10PercentOpacity}; } `}
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
	&:active {
		outline: 2px solid rgba(255, 255, 255, 0.2);
	}
	${props => props.extraStyle}
`

const DataToolbarRadioButton = styled(DataToolbarButton)``
const DataToolbarButtonContainer = styled.div`
	background-color: ${({ theme }) => theme.white20PercentOpacity};
	border-radius: 10px;
	position: relative;
`
const DataToolbarRadioButtonContainer = styled(DataToolbarButtonContainer)`
	box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
	padding: 5px;
`
const DataToolbarDiv = styled.div`
	padding: 20px 0px 0 30px;
	z-index: ${({ theme }) => theme.zIndexes.dataToolbar};
	display: flex;
	flex-flow: row wrap;
	gap: 1rem;
	flex-basis: 60px;
`

const DataToolbar = ({
	view,
	changeView,
}: {
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
		<DataToolbarDiv>
			<DataToolbarRadioButtonContainer>
				<ViewRadioButton forView={View.map} label="Map" />
				<ViewRadioButton forView={View.globe} label="Globe" />
				<ViewRadioButton forView={View.table} label="Table" />
			</DataToolbarRadioButtonContainer>
		</DataToolbarDiv>
	)
}

export default DataToolbar
