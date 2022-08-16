import { Link } from 'react-router-dom'
import styled from 'styled-components'

const BreadcrumbLink = styled(Link)<{ active?: boolean }>`
  ${({ theme }) => theme.extraSmallParagraph};
  color: ${({ theme, active }) =>
    active ? theme.medDarkGray : theme.veryDarkGray};

  &:not(:first-of-type)::before {
    content: '/';
    padding: 0 0.75em;
  }
`

export default BreadcrumbLink
