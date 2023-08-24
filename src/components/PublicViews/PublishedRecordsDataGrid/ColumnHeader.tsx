import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import styled from 'styled-components'
import colorPalette from 'figma/colorPalette'
import SortIcon, { SortStatus } from './SortIcon'
import type { Sort } from 'components/DataPage/TableView/TableView'

const ColumnLabel = styled.div`
  text-overflow: ellipsis;
  overflow: clip;
`

const SortButtonStyled = styled.button<{ sortPriority: number }>`
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
    if (sortPriority === 0) return 'rgba(0,0,0,0.3)'
    if (sortPriority > 0) return 'rgba(0,0,0,0.15)'
    return 'transparent'
  }};

  svg {
    width: 19px;
    height: 19px;
    align-self: center;
    flex-shrink: 0;
  }

  &:hover,
  &:focus {
    outline: 1px solid rgba(255, 255, 255, 0.4);
  }
`

type ColumnHeaderProps = {
  dataGridKey: string
  sorts: Sort[]
  setSorts: Dispatch<SetStateAction<Sort[]>>
  sortable: boolean
  index: number
  headersRef: React.MutableRefObject<ColumnHeaderHandle[]>
}

export type ColumnHeaderHandle = {
  focusLastFocusableElement: () => void
}

const ColumnHeader = ({
  dataGridKey,
  sorts,
  setSorts,
  sortable,
}: ColumnHeaderProps) => {
  const firstFocusableElementRef: React.MutableRefObject<HTMLButtonElement | null> =
    useRef(null)

  const cellKeyDownHandler = useCallback(
    (e: KeyboardEvent) => {
      const cell = e.target
      if (!(cell instanceof HTMLDivElement)) return
      const tab = e.key === 'Tab'
      const right = e.key === 'ArrowRight'
      if ((!e.shiftKey && tab) || right) {
        firstFocusableElementRef.current?.focus()
        e.preventDefault()
        e.stopPropagation()
      }
    },
    [firstFocusableElementRef]
  )

  const columnLabelRef = useRef<HTMLDivElement>(null)

  // Accessing the header cell via DOM since react-data-grid doesn't give us
  // a ref pointing to it
  const getHeaderCell = useCallback(
    () => columnLabelRef.current?.parentNode,
    [columnLabelRef]
  )

  const cycle = [SortStatus.unselected, SortStatus.selected, SortStatus.reverse]
  const [sort, sortPriority] = useMemo(() => {
    const index = sorts.findIndex(sort => sort[0] == dataGridKey)
    if (index === -1) {
      const sort: Sort = [dataGridKey, SortStatus.unselected]
      return [sort, undefined]
    } else {
      const sort = sorts[index]
      return [sort, index]
    }
  }, [sorts, dataGridKey])

  const sortButtonClickHandler = () => {
    setSorts(prev => {
      const currentCycleIndex = cycle.findIndex(
        sortStatus => sortStatus == sort[1]
      )
      const newSortStatus = cycle[(currentCycleIndex + 1) % cycle.length]
      const newSort: Sort = [dataGridKey, newSortStatus]
      const previousSortsWithThisSortRemoved = prev.filter(
        sort => sort[0] !== dataGridKey
      )
      if (newSortStatus === SortStatus.unselected) {
        return previousSortsWithThisSortRemoved
      } else {
        return [newSort, ...previousSortsWithThisSortRemoved]
      }
    })
  }

  useEffect(() => {
    const headerCell = getHeaderCell()
    if (!sortable) return
    if (!(headerCell instanceof HTMLDivElement)) return
    headerCell.addEventListener('keydown', cellKeyDownHandler)
    if (sort[1] === SortStatus.selected) {
      headerCell.setAttribute('aria-sort', 'descending')
    } else if (sort[1] === SortStatus.reverse) {
      headerCell.setAttribute('aria-sort', 'ascending')
    } else {
      headerCell.removeAttribute('aria-sort')
    }
    return () => {
      const headerCell = getHeaderCell()
      if (!(headerCell instanceof HTMLDivElement)) return
      headerCell.removeEventListener('keydown', cellKeyDownHandler)
    }
  }, [sort, sortable, getHeaderCell, cellKeyDownHandler])

  const columnIsPrimarySort = sortPriority === 0

  const sortIconColorProps = columnIsPrimarySort
    ? {
        upArrowSelectedColor: colorPalette.mint,
        downArrowSelectedColor: colorPalette.mint,
        upArrowUnselectedColor: colorPalette.gridLines,
        downArrowUnselectedColor: colorPalette.gridLines,
      }
    : {
        upArrowSelectedColor: colorPalette.mint,
        downArrowSelectedColor: colorPalette.mint,
        upArrowUnselectedColor: colorPalette.gridLines,
        downArrowUnselectedColor: colorPalette.gridLines,
      }

  // TODO: Change sort to an object with "key" and "status" properties
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
            status={sort[1] ?? SortStatus.unselected}
            {...sortIconColorProps}
          />
        </SortButtonStyled>
      )}
    </>
  )
}

export default ColumnHeader
