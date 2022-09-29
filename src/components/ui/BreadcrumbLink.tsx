import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const BreadcrumbContainer = styled.div`
  padding: 2px;
`

const BreadcrumbLink = styled(Link)<{ active?: boolean }>`
  ${({ theme }) => theme.extraSmallParagraph};
  color: ${({ theme, active }) =>
    active ? theme.medDarkGray : theme.veryDarkGray};

  border: thin solid rgba(0, 0, 0, 0);

  &:not(:first-of-type)::before {
    content: '/';
    padding: 0 0.75em;
  }
`

export default BreadcrumbLink
