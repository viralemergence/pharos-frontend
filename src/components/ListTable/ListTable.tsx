import React from 'react'
import styled from 'styled-components'
import { lighten } from 'polished'

import { Link } from 'react-router-dom'

const Container = styled.div`
  max-width: 100%;
  overflow-x: scroll;
  margin-top: 15px;
`
const TableGrid = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 800px;
  border: 1px solid ${({ theme }) => theme.medGray};
`
export const RowLink = styled(Link)<{ $columnTemplate?: string }>`
  display: grid;
  grid-template-columns: ${({ $columnTemplate }) => $columnTemplate};
  // grid-template-columns: 1.5fr 2.5fr repeat(4, 1.5fr);
  align-items: center;
  transition: 150ms ease;

  color: ${({ theme }) => theme.black};
  text-decoration: none;

  ${({ theme }) => theme.smallParagraph};

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

export const HeaderRow = styled.div<{ $columnTemplate?: string }>`
  display: grid;
  grid-template-columns: ${({ $columnTemplate }) => $columnTemplate};
  // grid-template-columns: 1.5fr 2.5fr repeat(4, 1.5fr);
  ${({ theme }) => theme.smallParagraphSemibold};
  align-items: center;
  > div {
    padding: 15px;
  }
`

interface ListTableProps {
  children: React.ReactNode
  columnTemplate: string
}

const ListTable = ({ children, columnTemplate }: ListTableProps) => {
  const childrenWithColumns = React.Children.map(children, child => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child)) {
      return React.cloneElement(
        // coercing child here to be a component that accepts the
        // columnTemplate prop since typescript 4 yells about it
        child as React.ReactElement<{ $columnTemplate: string }>,
        {
          $columnTemplate: columnTemplate,
        }
      )
    }
    return child
  })

  return (
    <Container>
      <TableGrid>{childrenWithColumns}</TableGrid>
    </Container>
  )
}

export default ListTable
