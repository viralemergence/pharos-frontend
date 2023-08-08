import wideMargins from 'components/layout/Margins'
import styled from 'styled-components'

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

  @media (max-width: 1200px) {
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
`

export const ResearcherPageContentBox = styled.div<{ interactive?: boolean }>`
  padding: 20px 30px;
  position: relative;
  background-color: ${({ theme }) => theme.mutedPurple1};
  border: 1px solid ${({ theme }) => theme.white10PercentOpacity};
  border-top: none;
  color: ${({ theme }) => theme.white};
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;

  &:before {
    background-color: ${({ theme, interactive }) =>
      interactive ? theme.mint : theme.white10PercentOpacity};
    content: '';
    position: absolute;
    top: 0;
    left: -1px;
    right: -1px;
    height: 5px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  > h2 {
    ${({ theme }) => theme.smallParagraph};
    color: ${({ theme }) => theme.medDarkGray};
    margin-top: 30px;
    margin-bottom: 0;

    &:first-child {
      margin-top: 0;
    }
  }

  > p {
    ${({ theme }) => theme.smallParagraph};
    margin: 5px 0;
    padding: 0;
  }

  a {
    ${({ theme }) => theme.smallParagraph};
    text-decoration: underline;
  }
`
