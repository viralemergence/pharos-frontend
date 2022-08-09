import styled from 'styled-components'
import { lighten } from 'polished'

import { Link } from 'react-router-dom'

const Container = styled.div`
  max-width: 100%;
  overflow-x: scroll;
  margin-top: 20px;
`
const TableGrid = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 800px;
  border: 1px solid ${({ theme }) => theme.veryLightGray};
`
export const RowLink = styled(Link)`
  display: grid;
  grid-template-columns: 1.5fr 2.5fr repeat(4, 1.5fr);
  align-items: center;
  transition: 150ms ease;

  color: ${({ theme }) => theme.black};
  text-decoration: none;

  ${({ theme }) => theme.gridText};

  > div {
    padding: 15px;
  }

  &:nth-child(2n) {
    background: ${({ theme }) => theme.veryLightGray};
  }

  &:nth-of-type(1) {
    box-shadow: inset 0px 4px 4px #e0eae8;
  }

  &:hover {
    background-color: ${({ theme }) => lighten(0.05, theme.hoverMint)};
  }
`

export const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 2.5fr repeat(4, 1.5fr);
  align-items: center;
  > div {
    padding: 15px;
  }
`

const ListTable = ({ children }: { children: React.ReactNode }) => (
  <Container>
    <TableGrid>{children}</TableGrid>
  </Container>
)

export default ListTable
