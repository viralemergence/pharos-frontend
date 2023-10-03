import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as GatsbyLink } from 'gatsby'
import styled from 'styled-components'

const TopBar = styled.div<{ darkmode?: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  grid-area: topbar;
  gap: 15px;
  margin-top: 20px;

  > h1 {
    color: ${({ theme, darkmode }) => (darkmode ? theme.white : theme.black)};
  }
`

export const Title = styled.h1`
  ${({ theme }) => theme.h2};
  margin: 0;
  flex-grow: 1;
  min-width: min-content;
`

export const Breadcrumbs = styled.div`
  flex-grow: 1;
  min-width: min-content;
  padding: 2px;
  flex-basis: 100%;
  display: flex;
  flex-wrap: wrap;
`

const breadcrumbLinkStyles = `
  display: flex;
  border: thin solid rgba(0, 0, 0, 0);

  &:not(:first-of-type)::before {
    content: '/';
    padding: 0 0.75em;
  }
`

export const BreadcrumbLink = styled(ReactRouterLink)<{
  $active?: boolean
}>`
  ${({ theme }) => theme.extraSmallParagraph};

  color: ${({ theme, $active: active }) =>
    active ? theme.medDarkGray : theme.veryDarkGray};

  ${breadcrumbLinkStyles}
`

export const PublicViewBreadcrumbLink = styled(GatsbyLink)<{
  $active?: boolean
}>`
  ${({ theme }) => theme.extraSmallParagraph};

  color: ${({ theme, $active: active }) =>
    active ? theme.medDarkGray : theme.white};

  ${breadcrumbLinkStyles}
`

export const Controls = styled.div`
  align-self: flex-end;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

export default TopBar
