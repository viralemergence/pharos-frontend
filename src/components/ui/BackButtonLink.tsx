import styled from 'styled-components'
import { Link } from 'react-router-dom'

const BackButtonLink = styled(Link)`
  ${({ theme }) => theme.extraSmallParagraph};
  color: ${({ theme }) => theme.darkGray};
  border: 1.5px solid ${({ theme }) => theme.darkGray};
  background-image: url("data:image/svg+xml,%3Csvg width='17' height='9' viewBox='0 0 17 9' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.32259 5.54175L16.833 5.54175V3.45841L4.32259 3.45841L4.32259 0.333415L0.16634 4.50008L4.32259 8.66675V5.54175Z' fill='%237B848E'/%3E%3C/svg%3E%0A");
  background-position: 10px 50%;
  padding: 4px 9px 4px 35px;
  background-repeat: no-repeat;
  text-decoration: none;
`

export default BackButtonLink
