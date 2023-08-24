import React, {
  Dispatch,
  SetStateAction,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
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

const SortButtonStyled = styled.button`
  background: transparent;
  border: 0;
  cursor: pointer;
  padding: 0 3px;
  padding-top: 3px;
  margin-right: 10px;
  margin-top: 5px;
  margin-bottom: 4px;
  border-radius: 7px;

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

const ColumnHeader = forwardRef<ColumnHeaderHandle, ColumnHeaderProps>(
  ({ dataGridKey, sorts, setSorts, sortable, index, headersRef }, ref) => {
    useImperativeHandle(ref, () => ({
      focusLastFocusableElement: () => {
        console.log('focusing header cell')
        const headerCell = getHeaderCell()
        if (headerCell instanceof HTMLElement) headerCell.click()
        if (sortable) {
          console.log('focusing last focusable element')
          lastFocusableElementRef.current?.focus()
        }
      },
    }))

    const cellKeyDownHandler = useCallback(
      (e: KeyboardEvent) => {
        const cell = e.target
        if (!(cell instanceof HTMLDivElement)) return
        const tab = e.key === 'Tab'
        const right = e.key === 'ArrowRight'
        const left = e.key === 'ArrowLeft'
        if (tab || right || left) {
          if ((e.shiftKey && tab) || left) {
            // Moving backwards through tab order
            console.log('moving back through tab order')
            console.log('headersRef', headersRef)
            if (!headersRef) return
            headersRef.current[index - 1].focusLastFocusableElement()
          } else {
            // Moving forwards through tab order
            firstFocusableElementRef.current?.focus()
          }
          e.preventDefault()
          e.stopPropagation()
        }
      },
      [headersRef]
    )

    const firstFocusableElementRef: React.MutableRefObject<HTMLButtonElement | null> =
      useRef(null)
    const lastFocusableElementRef: React.MutableRefObject<HTMLButtonElement | null> =
      useRef<HTMLButtonElement>(null)

    // Accessing the header cell via DOM since react-data-grid doesn't give us
    // a ref pointing to it
    const getHeaderCell = () => columnLabelRef.current?.parentNode

    const cycle = [
      SortStatus.unselected,
      SortStatus.selected,
      SortStatus.reverse,
    ]
    const sort = sorts.find(sort => sort[0] == dataGridKey) ?? [
      dataGridKey,
      SortStatus.unselected,
    ]

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

    const columnLabelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const headerCell = getHeaderCell()
      if (sortable && headerCell instanceof HTMLDivElement) {
        headerCell.addEventListener('keydown', cellKeyDownHandler)
      }
    }, [sortable, columnLabelRef, cellKeyDownHandler])

    // TODO: Change sort to an object with "key" and "status" properties
    return (
      <>
        <ColumnLabel ref={columnLabelRef}>{dataGridKey}</ColumnLabel>
        {sortable && (
          <SortButtonStyled
            ref={el => {
              firstFocusableElementRef.current = el
              lastFocusableElementRef.current = el
            }}
            onClick={sortButtonClickHandler}
          >
            <SortIcon
              status={sort[1] ?? SortStatus.unselected}
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
)

export default ColumnHeader
