import React, {
  KeyboardEventHandler,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Fuse from 'fuse.js'
import styled from 'styled-components'
import Expander from 'components/library/ui/expander'

import {
  Container,
  SearchBar,
  Results,
  ItemButton,
  SearchIcon,
  Values,
  Items,
} from './DisplayComponents'

import TypeaheadResult from './TypeaheadResult'

export interface Item {
  key: string
  label: string
  [key: string]: unknown
}

export interface RenderItemProps {
  item: Item
  selected?: boolean
}

// These type definitions should be in their own file
// But bit won't properly parse the props tabel if
// the definition isn't literally in the same file
// as the component itself.
export interface TypeaheadProps {
  /** The array of items that the user should
   * be able to select from
   */
  items: Item[]
  /**
   * The currently selected items
   */
  values?: Item[]
  /**
   * Function called when and item is
   * selected; the first argument will
   * be passed the selected item
   */
  onAdd: (item: Item) => void
  /**
   * Function called when and item is removed
   * from the multiselect, the first argument
   * will be the removed item.
   */
  onRemove?: (item: Item) => void
  /** Toggle multi-select or single-select mode */
  multiselect?: boolean
  /**
   * Placeholder string for the search bar
   */
  placeholder?: string
  /**
   * React functional component which should be used
   * to render each item. The props passed to this
   * component will contain 'item' which is the
   * item being rendered.
   */
  RenderItem?: (props: RenderItemProps) => JSX.Element
  /**
   * The properties of the Item object which should be
   * considered in the fuzzy search. Properties for search
   * must have string values.
   */
  searchKeys?: Fuse.FuseOptionKey<Item>[]
  /**
   * className; for supporting scss modules and
   * styled-components.
   */
  className?: string
  /**
   * Toggle disabled state
   */
  disabled?: boolean
  /**
   * object of styles which will be passed
   * to the container component
   */
  style?: React.CSSProperties
  /**
   * takes an encoded SVG string to replace the icon
   * in the typeahead box. SVG can be encoded with
   * a tool like this one: https://yoksel.github.io/url-encoder/
   */
  iconSVG?: string
  /**
   * Moves the icon to the left side of the input box
   */
  iconLeft?: boolean
  /** background color for the control */
  backgroundColor?: string
  /** font color for the control */
  fontColor?: string
  /** font color for the input placeholder */
  placeholderColor?: string
  /** border color for the control */
  borderColor?: string
  /**
   * background color for the items
   * in the results when hovered or active
   */
  hoverColor?: string
  /**
   * background color for the selected values
   * in the results when hovered or active
   */
  selectedHoverColor?: string
  /** max height for the results container */
  resultsMaxHeight?: string
  /** Aria-label attribute for the text input */
  ariaLabel?: string
  /** id attribute for the text input */
  inputId?: string
}

const Typeahead = ({
  multiselect = false,
  items,
  values = [],
  onAdd,
  onRemove,
  placeholder = '',
  placeholderColor,
  RenderItem = props => <TypeaheadResult {...props} />,
  searchKeys = ['key', 'label'],
  iconSVG,
  iconLeft = false,
  backgroundColor = 'white',
  borderColor = '#aaa',
  fontColor = 'rgba(51, 51, 51, 1)',
  hoverColor = 'rgba(0, 50, 100, 0.08)',
  selectedHoverColor = 'rgba(100, 0, 50, 0.08)',
  className,
  disabled = false,
  style = {},
  resultsMaxHeight = '30em',
  ariaLabel,
  inputId,
}: TypeaheadProps) => {
  const [searchString, setSearchString] = useState('')
  const [showResults, setShowResults] = useState(false)

  // The index of the focused item in the typeahead. This is either the input
  // (whose index is -1) or a button.
  const [focusedElementIndex, setFocusedElementIndex] = useState<number>(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const usingKeyboardRef = useRef(false)

  // compute fuzzy search
  const fuse = useMemo(
    () => new Fuse(items, { keys: searchKeys }),
    [items, searchKeys]
  )
  const results = fuse
    .search(searchString)
    .map(({ item }: { item: Item }) => item)

  const reset = () => {
    setShowResults(false)
    if (!values.length) setSearchString('')
  }

  useEffect(() => {
    if (values.length && !multiselect) setSearchString(values[0]?.label)
  }, [values, multiselect])

  useEffect(() => {
    if (disabled && !values.length) setSearchString('')
  }, [disabled, values])

  // handle focus changes
  useLayoutEffect(() => {
    if (!showResults || !resultsRef.current) return

    if (focusedElementIndex === -1) {
      inputRef.current?.focus()
      return
    }

    const [valuesDiv, itemsDiv] = Array.from(resultsRef.current?.children) || []
    const allButtons = [
      ...Array.from(valuesDiv?.children || []),
      ...Array.from(itemsDiv?.children || []),
    ]

    const target = allButtons[focusedElementIndex]

    if (!(target instanceof HTMLElement)) return

    if (usingKeyboardRef.current === true) {
      scrollFocusedButtonIntoView(target)
      usingKeyboardRef.current = false
    }

    // If focusing the element caused it to scroll into view, the user would be
    // able to scroll the results div by continually hovering over partially
    // visible buttons
    target.focus({ preventScroll: true })
  }, [focusedElementIndex, values, showResults])

  const scrollFocusedButtonIntoView = (focusedButton: HTMLElement) => {
    if (!resultsRef.current) return
    // scroll the list smoothly so that the focused element is
    // exactly at the bottom, overriding default scrolling
    const { top: buttonTop, bottom: buttonBottom } =
      focusedButton.getBoundingClientRect()

    const { top: listTop, bottom: listBottom } =
      resultsRef.current.getBoundingClientRect()

    let delta = 0
    if (buttonBottom > listBottom) delta = buttonBottom - listBottom
    else if (buttonTop < listTop) delta = buttonTop - listTop

    // apply scroll offset
    resultsRef.current.scrollTop += delta
  }

  const handleKeyDownFromContainer: KeyboardEventHandler<
    HTMLFormElement
  > = e => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        usingKeyboardRef.current = true
        setFocusedElementIndex(prev => {
          // if we are in the input, stay there
          if (prev === -1) return -1
          // if we are in the results, go up one
          return prev - 1
        })
        return
      case 'ArrowDown':
        e.preventDefault()
        usingKeyboardRef.current = true
        setFocusedElementIndex(prev => {
          // if we are at the end of the list, stay there
          if (prev === countOfDisplayedItems - 1) return prev
          // if we are in the results, go down one
          return prev + 1
        })
        return
      case 'Escape':
        inputRef.current?.blur()
        reset()
        return
    }
  }

  const handleKeyDownFromSearchBar: KeyboardEventHandler<
    HTMLInputElement
  > = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const firstUnselectedItem = [...results, ...items][0]
      if (firstUnselectedItem) addItemAndUpdateSummary(firstUnselectedItem)
    }
  }

  const unselectedItems =
    results.length && searchString !== values[0]?.label ? results : items

  const containerRef = useRef<HTMLFormElement>(null)

  const lastItemAddedRef: React.MutableRefObject<Item | null> = useRef(null)
  const lastItemRemovedRef: React.MutableRefObject<Item | null> = useRef(null)

  const addItemAndUpdateSummary = (item: Item) => {
    onAdd(item)
    lastItemAddedRef.current = item
    lastItemRemovedRef.current = null
  }
  const removeItemAndUpdateSummary = (item: Item) => {
    if (onRemove) onRemove(item)
    lastItemRemovedRef.current = item
    lastItemAddedRef.current = null
  }

  const resultsDivId = useMemo(
    () =>
      inputId
        ? `${inputId}-results`
        : `pharos-typeahead-results-${Math.random().toString(36).slice(2)}`,
    [inputId]
  )

  const getFocusIncrement = () => {
    const resultsDiv = resultsRef.current
    const selectedItems = Array.from(resultsDiv?.children?.[0]?.children ?? [])
    const isResultsDivScrolledToBottom =
      resultsDiv &&
      resultsDiv.scrollHeight === resultsDiv.scrollTop + resultsDiv.clientHeight
    const lastSelectedItem = selectedItems.at(-1)
    const isLastSelectedItemVisible =
      lastSelectedItem &&
      resultsDiv &&
      lastSelectedItem.getBoundingClientRect().bottom >
        resultsDiv.getBoundingClientRect().top
    if (isLastSelectedItemVisible || isResultsDivScrolledToBottom) return 0
    else return 1
  }

  const countOfDisplayedItems =
    (multiselect ? values.length : 0) + unselectedItems.length

  return (
    <Container
      ref={containerRef}
      onFocus={() => {
        setShowResults(true)
      }}
      onBlur={e => {
        // Ignore blur events where focus moves to another element inside the container
        if (containerRef?.current?.contains(e.relatedTarget)) return
        // Delay closing the results div slightly to avoid a race condition
        // that causes the div to close immediately without animation
        setTimeout(reset, 50)
      }}
      className={className}
      onSubmit={e => e.preventDefault()}
      style={{ ...style, backgroundColor }}
      borderColor={borderColor}
      onKeyDown={handleKeyDownFromContainer}
    >
      <SearchBar
        id={inputId}
        disabled={disabled}
        type="search"
        autoComplete="off"
        name="special-auto-fill"
        ref={inputRef}
        onKeyDown={handleKeyDownFromSearchBar}
        onFocus={() => setFocusedElementIndex(-1)}
        value={searchString}
        onChange={e => setSearchString(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        iconLeft={iconLeft}
        style={{ backgroundColor, borderColor }}
        fontColor={fontColor}
        placeholderColor={placeholderColor}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showResults}
        aria-controls={resultsDivId}
      />
      <SearchIcon searchString={searchString} {...{ iconSVG, iconLeft }} />
      <Expander
        floating
        open={showResults}
        style={{
          width: '100%',
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
          background: 'none',
        }}
        animDuration={200}
      >
        <Results
          style={{ backgroundColor, borderColor }}
          className="pharos-typeahead-results"
          id={resultsDivId}
          resultsMaxHeight={resultsMaxHeight}
          ref={resultsRef}
          tabIndex={0}
        >
          {multiselect && values.length > 0 && (
            <Values
              borderColor={borderColor}
              role="listbox"
              aria-multiselectable={multiselect ? 'true' : 'false'}
            >
              {values.map((item: Item, loopIndex: number) => (
                <ItemButton
                  key={item.key}
                  tabIndex={-1}
                  onClick={() => {
                    setFocusedElementIndex(loopIndex)
                    removeItemAndUpdateSummary(item)
                  }}
                  style={{ color: fontColor }}
                  focusHoverColor={selectedHoverColor}
                  role="option"
                  aria-selected="true"
                  aria-setsize={values.length}
                  aria-posinset={loopIndex}
                  onMouseMove={() => setFocusedElementIndex(loopIndex)}
                >
                  <RenderItem selected item={item} />
                </ItemButton>
              ))}
            </Values>
          )}
          <Items
            role="listbox"
            aria-multiselectable={multiselect ? 'true' : 'false'}
          >
            {unselectedItems.map((item: Item, loopIndex: number) => {
              const countOfSelectedItems = multiselect ? values.length : 0
              const itemIndex = countOfSelectedItems + loopIndex
              return (
                <ItemButton
                  key={item.key}
                  tabIndex={-1}
                  onMouseMove={() => setFocusedElementIndex(itemIndex)}
                  onClick={() => {
                    // NOTE: `addItemAndUpdateSummary` is not guaranteed to run before
                    // `setFocusedElementIndex`, which could produce a race condition.
                    addItemAndUpdateSummary(item)
                    if (multiselect) {
                      let newFocusedElementIndex =
                        itemIndex + getFocusIncrement()
                      // Don't go beyond the end of the list
                      newFocusedElementIndex = Math.min(
                        newFocusedElementIndex,
                        countOfDisplayedItems - 1
                      )
                      setFocusedElementIndex(newFocusedElementIndex)
                    } else {
                      // Remove focus from the focused button so that the input
                      // immediately loses its bottom border
                      setTimeout(() => {
                        if (document.activeElement instanceof HTMLButtonElement)
                          document.activeElement.blur()
                      }, 10)
                      setSearchString(item.label)
                      setShowResults(false)
                    }
                  }}
                  style={{ color: fontColor }}
                  focusHoverColor={hoverColor}
                  role="option"
                  aria-setsize={unselectedItems.length}
                  aria-posinset={loopIndex}
                  aria-selected="false"
                >
                  <RenderItem item={item} />
                </ItemButton>
              )
            })}
          </Items>
        </Results>
      </Expander>
      <TypeaheadSelectionSummaryForScreenReader
        lastItemAdded={lastItemAddedRef.current}
        lastItemRemoved={lastItemRemovedRef.current}
        values={values}
      />
    </Container>
  )
}

/** Serves as a replacement for the input placeholder for screen readers */
const TypeaheadSelectionSummaryForScreenReader = ({
  lastItemAdded,
  lastItemRemoved,
  values,
}: {
  lastItemAdded: Item | null
  lastItemRemoved: Item | null
  values: Item[]
}) => {
  return (
    <ScreenReaderOnly
      // This `key` prop makes this div re-render when the message
      // changes. This makes the screen reader read the whole message, not just
      // the new part
      key={values.length}
      aria-live="polite"
    >
      {lastItemAdded && <>{lastItemAdded.label} added to selection.</>}
      {lastItemRemoved && <>{lastItemRemoved.label} removed from selection.</>}
      {values.length}
      {values.length === 1 ? 'item' : 'items'}
      selected
    </ScreenReaderOnly>
  )
}

// Following a pattern used by
// https://designsystem.digital.gov/components/combo-box/ among others
const ScreenReaderOnly = styled.div`
  position: absolute;
  left: -999em;
  right: auto;
`

export default Typeahead
