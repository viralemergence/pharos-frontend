import React, {
  FocusEvent,
  ForwardedRef,
  KeyboardEventHandler,
  MouseEventHandler,
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Fuse from 'fuse.js'
import styled from 'styled-components'
import Expander from '@talus-analytics/library.ui.expander'

// TODO: Make the results list open when the user does a search

import {
  Container,
  SearchBar,
  Results,
  ItemButton,
  SearchIcon,
  Selected,
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
  /** border color for the control */
  borderColor?: string
  /** Aria-label attribute for the text input */
  ariaLabel?: string
  /** id attribute for the text input */
  inputId?: string
}

type NullableMutableRef<T> = MutableRefObject<T | null>
type NullableMutableRefCallback<T> = (value: T | null) => void
type ButtonRef = NullableMutableRef<HTMLButtonElement>
type DivRef = NullableMutableRef<HTMLDivElement>
type InputRef = NullableMutableRef<HTMLInputElement>

type Focusable = HTMLInputElement | HTMLButtonElement | null
const isFocusable = (elem: unknown): elem is Focusable =>
  elem instanceof HTMLInputElement || elem instanceof HTMLButtonElement

function setRef<T>(
  ref:
    | NullableMutableRef<T>
    | NullableMutableRefCallback<T>
    | ForwardedRef<T>
    | undefined,
  value: T | null
) {
  if (!ref) return
  if (typeof ref === 'function') ref(value)
  else if (ref) ref.current = value
}

const isVisibleInContainer = (
  container: HTMLElement | null,
  percentageVisible = 1,
  elem: HTMLElement | null
) =>
  elem &&
  container &&
  elem.offsetTop + elem.clientHeight * (1 - percentageVisible) >=
    container.scrollTop &&
  elem.offsetTop <=
    container.scrollTop +
      container.clientHeight -
      elem.clientHeight * (1 - percentageVisible)

/** Reduce list scrolling when button is focused */
const resultButtonFocusHandler = (
  e: FocusEvent<HTMLButtonElement>,
  resultsDivRef?: DivRef
) => {
  if (!resultsDivRef) return
  const list = resultsDivRef.current
  if (!list) return
  const button = e.target
  const { top: buttonTop, bottom: buttonBottom } =
    button.getBoundingClientRect()
  const { top: listTop, bottom: listBottom } = list.getBoundingClientRect()
  let delta = 0
  if (buttonBottom > listBottom) delta = buttonBottom - listBottom
  else if (buttonTop < listTop) delta = buttonTop - listTop
  list.scrollTop += delta
}

interface ResultButtonProps {
  item: Item
  RenderItem: (props: RenderItemProps) => JSX.Element
  buttonRefs: ButtonRef[]
  selected?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  fontColor?: string
  isFocused?: boolean
  resultsDivRef?: DivRef
}

const ResultButton = ({
  selected = false,
  item,
  onClick,
  fontColor,
  buttonRefs,
  resultsDivRef,
  RenderItem,
  isFocused = false,
}: ResultButtonProps) => {
  const buttonRef: ButtonRef = useRef(null)
  useEffect(() => {
    if (isFocused) buttonRef.current?.focus({ preventScroll: true })
  })
  buttonRefs.push(buttonRef)

  return (
    <ItemButton
      tabIndex={-1}
      onClick={onClick}
      style={{ color: fontColor }}
      ref={buttonRef}
      onFocus={e => resultButtonFocusHandler(e, resultsDivRef)}
      selected={selected}
    >
      <RenderItem selected={selected} item={item} />
    </ItemButton>
  )
}

const getElementToFocus = (
  /** The element that presently has the focus */
  focusedElement: Focusable,
  isInputFocused: boolean,
  /** True if the up arrow was pressed, false if the down arrow was pressed */
  up: boolean,
  buttons: (HTMLButtonElement | null)[],
  order: Focusable[],
  resultsDiv: HTMLElement | null
): Focusable | null | undefined => {
  if (
    isInputFocused ||
    isVisibleInContainer(resultsDiv, 1, focusedElement) ||
    !resultsDiv
  ) {
    const focusedIndex = order.indexOf(focusedElement)
    return order[focusedIndex + (up ? -1 : 1)]
  } else {
    // If the focusedElement is not visible, to avoid unexpected scrolling of
    // the results div, move focus to a button that is already visible
    return up
      ? // If moving up, focus the last visible button
        buttons.findLast(elem => isVisibleInContainer(resultsDiv, 0.5, elem))
      : // If moving down, focus the first visible button
        buttons.find(elem => isVisibleInContainer(resultsDiv, 0.5, elem))
  }
}

const Typeahead = ({
  multiselect = false,
  items,
  values = [],
  onAdd,
  onRemove,
  placeholder = '',
  RenderItem = props => <TypeaheadResult {...props} />,
  searchKeys = ['key', 'label'],
  iconSVG,
  iconLeft = false,
  backgroundColor = 'white',
  borderColor = '#aaa',
  fontColor = 'rgba(51, 51, 51, 1)',
  className,
  disabled = false,
  style = {},
  ariaLabel,
  inputId,
}: TypeaheadProps) => {
  if (!items) throw new Error('Item array in multiselect cannot be undefined')

  const [searchString, setSearchString] = useState('')

  const [showResults, setShowResults] = useState(false)

  // The index of the focused item in the typeahead. This is either the input
  // (whose index is 0) or a button. If the index is null, no item is focused
  const [focusedElementIndex, setFocusedElementIndex] = useState<number | null>(
    0
  )

  /** Move focus to the correct place after an item is selected or deselected */
  // TODO: rename this function
  const focusNextItem = (
    indexOfLastFocusedItem: number,
    increment: number,
    itemsCount: number
  ) => {
    const nextIndex = Math.min(indexOfLastFocusedItem + increment, itemsCount)
    setFocusedElementIndex(nextIndex)
  }

  const inputRef: InputRef = useRef(null)
  const buttonRefs: ButtonRef[] = []

  // compute fuzzy search
  const fuse = useMemo(
    () => new Fuse(items, { keys: searchKeys }),
    [items, searchKeys]
  )

  const results = fuse
    .search(searchString)
    .map(({ item }: { item: Item }) => item)

  const keydownFromSearchBarHandlers: Record<string, KeyboardEventHandler> = {
    // accept top result if enter is pressed
    Enter: _e => {
      if (results[0] || items[0]) onAdd(results[0] || items[0])
      inputRef?.current!.blur()
      setSearchString('')
    },
    Esc: _e => {
      setShowResults(false)
    },
  }

  const handleKeyDownFromSearchBar: KeyboardEventHandler = e => {
    keydownFromSearchBarHandlers[e.key]?.(e)
  }

  // When a blur event fires, set results to hide next at the end
  // of the event loop using a zero-duration timeout, which will
  // be cancelled if focus bubbles up from a child element.
  let blurTimeout: ReturnType<typeof global.setTimeout> | undefined
  const onBlurHandler = () => {
    blurTimeout = setTimeout(() => {
      setFocusedElementIndex(null)
      setShowResults(false)
      if (!values.length) setSearchString('')
    })
  }

  // if focus is inside the container,
  // cancel the timer, don't hide the results
  const onFocusHandler = () => {
    clearTimeout(blurTimeout)
    setShowResults(true)
  }

  useEffect(() => {
    if (values.length && !multiselect) setSearchString(values[0]?.label)
  }, [values, multiselect])

  useEffect(() => {
    if (disabled && !values.length) setSearchString('')
  }, [disabled, values])

  // TODO: Find out how to avoid focusing this input on first render, causing
  // the results div to open. The results div should not be open on first
  // render.

  useEffect(() => {
    if (focusedElementIndex === 0) inputRef.current?.focus()
  })

  const handleKeyDownFromContainer: KeyboardEventHandler<
    HTMLFormElement
  > = e => {
    if (!inputRef) return
    if (!isFocusable(e.target)) return

    const buttons = buttonRefs.map(b => b.current)
    const up = e.key === 'ArrowUp'
    const down = e.key === 'ArrowDown'

    if (e.key === 'Escape') {
      setTimeout(() => setShowResults(false))
      setFocusedElementIndex(0)
    } else if (up || down) {
      e.preventDefault()
      const focusedElement = e.target
      const div = resultsDivRef.current

      /** Arrow keys move the focus up and down through this array, like a tab order. */
      const order = [inputRef.current, ...buttons]
      const isInputFocused = focusedElement === inputRef.current
      const elementToFocus = getElementToFocus(
        focusedElement,
        isInputFocused,
        up,
        buttons,
        order,
        div
      )
      const indexOfElementToFocus = order.indexOf(elementToFocus || null) || 0
      setFocusedElementIndex(indexOfElementToFocus)

      if (down && isInputFocused) setShowResults(true)
      // TODO: When closing the results, focus is going into the input and then
      // the results are opening. Perhaps remove this next line
      if (up && indexOfElementToFocus === 0) setShowResults(false)
    }
  }

  const resultsDivRef: DivRef = useRef(null)
  const resultButtonProps: Partial<ResultButtonProps> & {
    buttonRefs: ResultButtonProps['buttonRefs']
    RenderItem: ResultButtonProps['RenderItem']
  } = {
    buttonRefs,
    RenderItem,
    resultsDivRef,
    fontColor,
  }

  // Counter used across both the values and the results loop
  let index = 0

  const unselectedItems =
    results.length && searchString !== values[0]?.label ? results : items

  const itemsCount = values.length + unselectedItems.length

  return (
    <Container
      onFocus={onFocusHandler}
      onBlur={onBlurHandler}
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
        ref={(input: HTMLInputElement) => {
          setRef(inputRef, input)
        }}
        onKeyDown={handleKeyDownFromSearchBar}
        onFocus={() => focusedElementIndex !== 0 && setFocusedElementIndex(0)}
        value={searchString}
        onChange={e => setSearchString(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        iconLeft={iconLeft}
        style={{ backgroundColor, borderColor }}
        fontColor={fontColor}
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
          ref={resultsDivRef}
        >
          {multiselect && values.length > 0 && (
            <Selected borderColor={borderColor}>
              {values.map((item: Item) => {
                index++
                const myIndex = index // Create a locally scoped variable
                return (
                  <ResultButton
                    selected={true}
                    item={item}
                    key={item.key}
                    isFocused={index === focusedElementIndex}
                    onClick={() => {
                      onRemove?.(item)
                      focusNextItem(myIndex, 0, itemsCount)
                    }}
                    {...resultButtonProps}
                  />
                )
              })}
            </Selected>
          )}
          {unselectedItems.map((item: Item) => {
            index++
            const myIndex = index // Create a locally scoped variable
            return (
              <ResultButton
                item={item}
                key={item.key}
                isFocused={index === focusedElementIndex}
                onClick={() => {
                  onAdd(item)
                  focusNextItem(myIndex, 1, itemsCount)
                }}
                {...resultButtonProps}
              />
            )
          })}
        </Results>
      </Expander>
      <ScreenReaderOnly>
        When options are available, use the Up and Down arrows on your keyboard
        to review them, and the Enter key to select one.
      </ScreenReaderOnly>
    </Container>
  )
}

// Following a pattern used by, for example, https://designsystem.digital.gov/components/combo-box/
const ScreenReaderOnly = styled.div`
  position: absolute;
  left: -999em;
  right: auto;
`

export default Typeahead
