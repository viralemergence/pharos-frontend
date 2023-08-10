import styled from 'styled-components'
import { Link } from 'gatsby'

export const CellContainer = styled.div`
  margin-left: -8px;
  margin-right: -8px;
  padding: 0 8px;
`

export const DataGridLink = styled(Link)`
  color: ${({ theme }) => theme.white};

  &:hover {
    color: ${({ theme }) => theme.mint};
  }
`
