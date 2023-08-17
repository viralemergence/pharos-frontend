import wideMargins from 'components/layout/Margins'
import { Link } from 'gatsby'
import styled, { css } from 'styled-components'

export const ResearcherPageLayout = styled.div`
  position: relative;
  display: grid;
  gap: 30px;
  grid-template-columns: minmax(245px, 1fr) 2fr minmax(245px, 1fr);
  grid-template-areas:
    'topbar topbar topbar'
    'alphabet main spacer';

  color: ${({ theme }) => theme.white};

  ${wideMargins}

  @media (max-width: 1300px) {
    grid-template-columns: minmax(245px, 1fr) 3fr;
    grid-template-areas:
      'topbar topbar'
      'alphabet main';
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'topbar'
      'main';
  }
`

export const ResearcherPageMain = styled.div`
  grid-area: main;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 30px;
`

export const ContentBoxStyles = css<{ interactive?: boolean }>`
  padding: 20px 30px;
  position: relative;
  background-color: ${({ theme }) => theme.mutedPurple2};
  border: 1px solid ${({ theme }) => theme.white10PercentOpacity};
  border-top: none;
  color: ${({ theme }) => theme.white};
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  transition: 250ms;
  display: flex;
  flex-direction: column;
  justify-content: flspace-between;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -1px;
    right: -1px;
    height: 5px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background-color: ${({ theme }) => theme.white10PercentOpacity};
  }

  ${({ interactive, theme }) =>
    interactive &&
    `
  &:hover {
    background-color: ${theme.mutedPurple1};
    border: 1px solid ${theme.mint};
    border-top: none;
  }

  &:before {
    background-color: ${theme.mint};
  }
  `}
`

export const ResearcherButton = styled.button`
  background: none;
  border: none;

  ${ContentBoxStyles}
`

export const ResearcherPageContentBoxLink = styled(Link)`
  ${ContentBoxStyles}
`

export const ResearcherPageContentBox = styled.div<{ interactive?: boolean }>`
  ${ContentBoxStyles}
`
