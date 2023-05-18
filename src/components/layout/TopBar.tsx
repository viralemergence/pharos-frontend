import { Link } from 'react-router-dom'
import styled from 'styled-components'

const TopBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  grid-area: topbar;
  gap: 15px;
  margin-top: 20px;
`

export const Title = styled.h1`
  ${({ theme }) => theme.h2};
  margin: 0;
  flex-grow: 1;
  min-width: min-content;
  flex-basis: 60%;
`

export const Breadcrumbs = styled.div`
  flex-grow: 1;
  min-width: min-content;
  padding: 2px;
  flex-basis: 60%;
  display: flex;
  flex-wrap: wrap;
`

export const BreadcrumbLink = styled(Link)<{ $active?: boolean }>`
  ${({ theme }) => theme.extraSmallParagraph};
  display: flex;
  color: ${({ theme, $active: active }) =>
    active ? theme.medDarkGray : theme.veryDarkGray};

  border: thin solid rgba(0, 0, 0, 0);

  &:not(:first-of-type)::before {
    content: '/';
    padding: 0 0.75em;
  }
`

export const Controls = styled.div`
  align-self: flex-end;
`

export default TopBar
