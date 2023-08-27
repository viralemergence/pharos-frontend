import styled from 'styled-components'

export const ViewContainer = styled.main<{
  shouldBlurMap: boolean
  isFilterPanelOpen: boolean
}>`
  flex: 1;
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  gap: 20px;
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    gap: 0px;
  }
  main {
    display: flex;
    flex-flow: row nowrap;
    flex: 1;
  }
  background-color: ${({ theme }) => theme.darkPurple};

  ${({ shouldBlurMap }) =>
    shouldBlurMap &&
    `.mapboxgl-control-container { display: none ! important; }`}
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    ${({ isFilterPanelOpen }) =>
      isFilterPanelOpen &&
      `.mapboxgl-control-container { display: none ! important; }`}
  }
`

export const ViewMain = styled.div<{ isFilterPanelOpen: boolean }>`
  pointer-events: none;
  position: relative;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  padding-bottom: 35px;
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    padding-bottom: 10px;
  }
  ${({ isFilterPanelOpen, theme }) =>
    isFilterPanelOpen &&
    `
    @media (max-width: ${theme.breakpoints.tabletMaxWidth}) {
      padding-bottom: unset;
    }
  `}
`

export const PageContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: 100vh;
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    // On mobile and tablet, accommodate the browser UI.
    height: 100svh;
  }
  width: 100%;
`

export const MapOverlay = styled.div`
  backdrop-filter: blur(30px);
  position: absolute;
  height: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
`

export const DataToolbarButton = styled.button<{
  selected?: boolean
  width?: number
}>`
  ${({ theme }) => theme.bigParagraph};
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
      : `
      &:hover { background-color: ${theme.white10PercentOpacity}; }
      `}
  color: ${({ selected, theme }) => (selected ? theme.black : theme.white)};
  border-radius: 7px;
  cursor: pointer;
  &:last-child {
    margin-right: 0;
  }
  width: ${({ width }) => (width ? width + 'px' : 'auto')};
  height: 100%;
  padding: 5px 10px;
  &:active {
    outline: 2px solid ${({ theme }) => theme.white20PercentOpacity};
  }
  &:focus {
    outline: 1px solid ${({ theme }) => theme.white};
  }
`

export const FilterPanelLauncher = styled(DataToolbarButton)`
  padding-left: 10px;
  padding-right: 10px;
  margin-left: 0;
  border-radius: 9px;
`

const DataToolbarButtonContainer = styled.div`
  background-color: ${({ theme }) => theme.white20PercentOpacity};
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  gap: 10px;
  backdrop-filter: blur(3px);
  border: 1px solid ${({ theme }) => theme.white10PercentOpacity};
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.124);
`

export const ContainerForRadioButtons = styled(DataToolbarButtonContainer)`
  padding: 5px;
`

export const ContainerForFilterPanelLauncher = styled(
  DataToolbarButtonContainer
)`
  height: 42px;
`

export const DataToolbarDiv = styled.div<{ isFilterPanelOpen: boolean }>`
  padding: 20px 0 0 30px;
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
  flex-basis: 60px;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    padding: 10px;
    ${({ isFilterPanelOpen }) => (isFilterPanelOpen ? 'display: none' : '')}
  }
`

export const ScreenReaderOnly = styled.div`
  clip-path: inset(50%);
  clip: rect(0 0 0 0);
  height: 0px;
  overflow: hidden;
  position: absolute;
  width: 0px;
`

export const SummaryOfRecordsStyled = styled.aside`
  color: ${({ theme }) => theme.white};
`
