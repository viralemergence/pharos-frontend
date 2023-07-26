import React from 'react'
import styled from 'styled-components'
import { lighten } from 'polished'

import { Link } from 'react-router-dom'

export const cardsBreakpoint = 650
const mediumBreakpoint = 1000

const Container = styled.div`
  max-width: 100%;
`
const TableGrid = styled.div<{ $darkmode: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (min-width: ${cardsBreakpoint - 1}px) {
    ${({ $darkmode, theme }) =>
      $darkmode
        ? `border-top: thin solid ${theme.mint}`
        : `border: 1px solid ${theme.medGray}`};
    gap: 0px;
  }
`
export const RowLink = styled(Link)<{
  $wideColumnTemplate?: string
  $mediumColumnTemplate?: string
  $darkmode?: boolean
}>`
  transition: 150ms ease;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme, $darkmode }) =>
    $darkmode ? theme.medBlack : theme.veryLightMint};
  color: ${({ theme, $darkmode }) => ($darkmode ? theme.white : theme.black)};
  text-decoration: none;
  padding: 15px;

  ${({ theme }) => theme.smallParagraph};

  @media (min-width: ${cardsBreakpoint - 1}px) {
    padding: 0;
    align-items: center;
    display: grid;
    grid-template-columns: ${({ $mediumColumnTemplate }) =>
      $mediumColumnTemplate};

    background-color: ${({ theme, $darkmode }) =>
      $darkmode ? theme.medDarkBlack : theme.white};
    &:nth-child(2n) {
      background: ${({ theme, $darkmode }) =>
        $darkmode ? theme.medBlack : theme.veryLightMint};
    }

    &:nth-of-type(1) {
      box-shadow: ${({ $darkmode }) =>
        $darkmode
          ? '0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset'
          : 'inset 0px 4px 4px #e0eae8'};
    }
  }

  @media (min-width: ${mediumBreakpoint - 1}px) {
    grid-template-columns: ${({ $wideColumnTemplate }) => $wideColumnTemplate};
  }

  &:hover {
    background-color: ${({ theme, $darkmode }) =>
      $darkmode ? theme.black : lighten(0.05, theme.hoverMint)};
  }
`

export const HeaderRow = styled.div<{
  $wideColumnTemplate?: string
  $mediumColumnTemplate?: string
  $darkmode?: boolean
}>`
  display: grid;

  grid-template-columns: ${({ $mediumColumnTemplate }) =>
    $mediumColumnTemplate};

  @media (min-width: ${mediumBreakpoint - 1}px) {
    grid-template-columns: ${({ $wideColumnTemplate }) => $wideColumnTemplate};
  }

  ${({ theme }) => theme.smallParagraphSemibold};
  align-items: center;
  color: ${({ theme, $darkmode }) => ($darkmode ? theme.white : theme.black)};
  background-color: ${({ theme, $darkmode }) =>
    $darkmode ? theme.medDarkBlack : theme.white};

  > div {
    padding: 15px;
  }

  @media (max-width: ${cardsBreakpoint}px) {
    display: none;
    hidden: true;
  }
`

export const CardHeaderRow = styled.h3<{ $darkmode?: boolean }>`
  ${({ theme }) => theme.h3};
  color: ${({ theme, $darkmode }) => ($darkmode ? theme.white : theme.black)};
  margin: 10px 0;

  @media (min-width: ${cardsBreakpoint}px) {
    display: none;
    hidden: true;
  }
`

export const TableCell = styled.div<{
  hideMobile?: boolean
  hideMedium?: boolean
  cardOrder?: number
}>`
  padding: 15px;

  @media (max-width: ${mediumBreakpoint}px) {
    display: ${({ hideMedium }) => (hideMedium ? 'none' : 'unset')};
  }

  @media (max-width: ${cardsBreakpoint}px) {
    padding: 10px;
    order: ${({ cardOrder }) => cardOrder ?? 'initial'};
    display: ${({ hideMobile, hideMedium }) =>
      hideMobile || hideMedium ? 'none' : 'unset'};

    &:nth-child(1) {
      ${({ theme }) => theme.bigParagraphSemibold};
    }
  }
`

interface ListTableProps {
  children: React.ReactNode
  wideColumnTemplate: string
  mediumColumnTemplate?: string
  style?: React.CSSProperties
  darkmode?: boolean
}

const ListTable = ({
  children,
  wideColumnTemplate,
  mediumColumnTemplate,
  style,
  darkmode = false,
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
          $darkmode?: boolean
        }>,
        {
          $wideColumnTemplate: wideColumnTemplate,
          $mediumColumnTemplate: mediumColumnTemplate ?? wideColumnTemplate,
          $darkmode: darkmode,
        }
      )
    }
    return child
  })

  return (
    <Container style={style}>
      <TableGrid $darkmode={darkmode}>{childrenWithColumns}</TableGrid>
    </Container>
  )
}

export default ListTable
