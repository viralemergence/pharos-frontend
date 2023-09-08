import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { transparentize } from 'polished'
import colorPalette from 'figma/colorPalette'
import SortIcon, { SortStatus } from './SortIcon'
import {
  Sort,
  getNextSortStatus,
} from 'components/PublicViews/PublishedRecordsDataGrid/PublishedRecordsDataGrid'

const ColumnLabel = styled.div`
  text-overflow: ellipsis;
  overflow: clip;
`

const SortButtonStyled = styled.button<{ sortPriority?: number }>`
  border: 0;
  cursor: pointer;
  padding: 0 3px;
  padding-top: 3px;
  margin-right: 10px;
  margin-top: 8px;
  margin-bottom: 7px;
  border-radius: 7px;
  margin-left: 3px;
  transition: background-color 0.15s;
  background-color: ${({ sortPriority, theme }) => {
    if (sortPriority === 0) return theme.mutedPurple1
    if (sortPriority && sortPriority > 0)
      return transparentize(0.5, theme.mutedPurple1)
    return 'transparent'
  }};

  &:hover,
  &:focus {
    outline: 1px solid ${({ theme }) => theme.white};
  }
`

type HeaderCellContentProps = {
  dataGridKey: string
  sorts: Sort[]
  setSorts: Dispatch<SetStateAction<Sort[]>>
  sortable: boolean
}

export type HeaderCellContentHandle = {
  focusLastFocusableElement: () => void
}

const HeaderCellContent = ({
  dataGridKey,
  sorts,
  setSorts,
  sortable,
}: HeaderCellContentProps) => {
  const firstFocusableElementRef: React.MutableRefObject<HTMLButtonElement | null> =
    useRef(null)

  const columnLabelRef = useRef<HTMLDivElement>(null)

  let sort: Sort, sortPriority: number | undefined
  const index = sorts.findIndex(sort => sort.dataGridKey == dataGridKey)
  // Table is not sorted on this header's column
  if (index === -1) sort = { dataGridKey, status: SortStatus.Unselected }
  // Table is sorted on this header's column
  else [sort, sortPriority] = [sorts[index], index]

  const sortButtonClickHandler = () => {
    setSorts(prev => {
      const nextSortStatus = getNextSortStatus(sort.status)
      const newSort: Sort = { dataGridKey, status: nextSortStatus }
      const previousSortsWithThisSortRemoved = prev.filter(
        sort => sort.dataGridKey !== dataGridKey
      )
      if (nextSortStatus === SortStatus.Unselected) {
        return previousSortsWithThisSortRemoved
      } else {
        return [newSort, ...previousSortsWithThisSortRemoved]
      }
    })
  }

  useEffect(() => {
    /** Ensures that when user presses tab or the right arrow, the sort button
     * receives the focus */
    const cellKeyDownHandler = (e: KeyboardEvent) => {
      const cell = e.target
      if (!(cell instanceof HTMLDivElement)) return
      const tab = e.key === 'Tab'
      const right = e.key === 'ArrowRight'
      if ((!e.shiftKey && tab) || right) {
        firstFocusableElementRef.current?.focus()
        e.preventDefault()
        e.stopPropagation()
      }
    }

    const headerCell = columnLabelRef.current?.parentNode
    if (!sortable) return
    if (!(headerCell instanceof HTMLDivElement)) return
    headerCell.addEventListener('keydown', cellKeyDownHandler)
    if (sort.status === SortStatus.Selected) {
      headerCell.setAttribute('aria-sort', 'descending')
    } else if (sort.status === SortStatus.Reverse) {
      headerCell.setAttribute('aria-sort', 'ascending')
    } else {
      headerCell.removeAttribute('aria-sort')
    }
    return () => {
      if (!(headerCell instanceof HTMLDivElement)) return
      headerCell.removeEventListener('keydown', cellKeyDownHandler)
    }
  }, [sort, sortable])

  return (
    <>
      <ColumnLabel ref={columnLabelRef}>{dataGridKey}</ColumnLabel>
      {sortable && (
        <SortButtonStyled
          ref={firstFocusableElementRef}
          onClick={sortButtonClickHandler}
          sortPriority={sortPriority}
        >
          <SortIcon
            status={sort.status ?? SortStatus.Unselected}
            upArrowSelectedColor={colorPalette.mint}
            downArrowSelectedColor={colorPalette.mint}
            upArrowUnselectedColor={colorPalette.gridLines}
            downArrowUnselectedColor={colorPalette.gridLines}
          />
        </SortButtonStyled>
      )}
    </>
  )
}

export default HeaderCellContent
