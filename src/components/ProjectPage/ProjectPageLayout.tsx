import styled, { css } from 'styled-components'
import wideMargins from 'components/layout/Margins'

export const singleColumnBreakpoint = 1300

export const ProjectPageLayout = styled.div`
  position: relative;
  color: ${({ theme }) => theme.black};
  display: grid;
  gap: 30px;
  grid-template-columns: minmax(10px, 3fr) minmax(350px, 1fr);
  grid-template-areas:
    'topbar topbar'
    'main sidebar';

  @media (max-width: ${singleColumnBreakpoint}px) {
    grid-template-columns: minmax(10px, 1fr);
    grid-template-areas:
      'topbar'
      'main'
      'sidebar';
  }

  ${wideMargins}
`

export const ProjectPageMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: inherit;
  align-items: stretch;
  grid-area: main;
`

export const ProjectPageSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: inherit;
  grid-area: sidebar;
`

export const ProjectPageContentBox = styled.div`
  padding: 20px 30px;

  > h2 {
    ${({ theme }) => theme.smallParagraph};
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

export const hideInWideView = css`
  @media (min-width: ${singleColumnBreakpoint + 1}px) {
    display: none;
    hidden: true;
  }
`

export const hideInNarrowView = css`
  @media (max-width: ${singleColumnBreakpoint}px) {
    display: none;
    hidden: true;
  }
`
