import React from 'react'
import styled from 'styled-components'
import { lighten } from 'polished'

import { Link } from 'react-router-dom'

const cardsBreakpoint = 650
const mediumBreakpoint = 1000

const Container = styled.div`
  max-width: 100%;
  overflow-x: scroll;
`
const TableGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (min-width: ${cardsBreakpoint - 1}px) {
    border: 1px solid ${({ theme }) => theme.medGray};
    gap: 0px;
  }
`
export const RowLink = styled(Link)<{
  $wideColumnTemplate?: string
  $mediumColumnTemplate?: string
}>`
  transition: 150ms ease;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.veryLightMint};
  color: ${({ theme }) => theme.black};
  text-decoration: none;
  padding: 15px;

  ${({ theme }) => theme.smallParagraph};

  @media (min-width: ${cardsBreakpoint - 1}px) {
    padding: 0;
    align-items: center;
    display: grid;
    grid-template-columns: ${({ $mediumColumnTemplate }) =>
      $mediumColumnTemplate};

    &:nth-child(2n) {
      background: ${({ theme }) => theme.veryLightGray};
    }

    &:nth-of-type(1) {
      box-shadow: inset 0px 4px 4px #e0eae8;
    }
  }

  @media (min-width: ${mediumBreakpoint - 1}px) {
    grid-template-columns: ${({ $wideColumnTemplate }) => $wideColumnTemplate};
  }

  &:hover {
    background-color: ${({ theme }) => lighten(0.05, theme.hoverMint)};
  }
`

export const HeaderRow = styled.div<{
  $wideColumnTemplate?: string
  $mediumColumnTemplate?: string
}>`
  display: grid;

  grid-template-columns: ${({ $mediumColumnTemplate }) =>
    $mediumColumnTemplate};

  @media (min-width: ${mediumBreakpoint - 1}px) {
    grid-template-columns: ${({ $wideColumnTemplate }) => $wideColumnTemplate};
  }

  ${({ theme }) => theme.smallParagraphSemibold};
  align-items: center;

  > div {
    padding: 15px;
  }

  @media (max-width: ${cardsBreakpoint}px) {
    display: none;
    hidden: true;
  }
`

export const TableCell = styled.div<{
  hideMobile?: boolean
  hideMedium?: boolean
  mobileOrder?: number
}>`
  padding: 15px;

  @media (max-width: ${mediumBreakpoint}px) {
    display: ${({ hideMedium }) => (hideMedium ? 'none' : 'unset')};
  }

  @media (max-width: ${cardsBreakpoint}px) {
    padding: 10px;
    order: ${({ mobileOrder }) => mobileOrder ?? 'initial'};
    display: ${({ hideMobile, hideMedium }) =>
      hideMobile || hideMedium ? 'none' : 'unset'};
  }
`

interface ListTableProps {
  children: React.ReactNode
  wideColumnTemplate: string
  mediumColumnTemplate?: string
  style?: React.CSSProperties
}

const ListTable = ({
  children,
  wideColumnTemplate,
  mediumColumnTemplate,
  style,
}: ListTableProps) => {
  const childrenWithColumns = React.Children.map(children, child => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child)) {
      return React.cloneElement(
        // coercing child here to be a component that accepts the
        // columnTemplate prop since typescript 4 yells about it
        child as React.ReactElement<{
          $wideColumnTemplate: string
          $mediumColumnTemplate: string
        }>,
        {
          $wideColumnTemplate: wideColumnTemplate,
          $mediumColumnTemplate: mediumColumnTemplate ?? wideColumnTemplate,
        }
      )
    }
    return child
  })

  return (
    <Container style={style}>
      <TableGrid>{childrenWithColumns}</TableGrid>
    </Container>
  )
}

export default ListTable
