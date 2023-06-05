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

// TODO: I don't remember what the purpose of indexOfLastItemAdded is.
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
type NumberRef = NullableMutableRef<number>

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
  elem: HTMLElement | null
) =>
  elem &&
  container &&
  elem.offsetTop >= container.scrollTop &&
  elem.offsetTop <= container.scrollTop + container.clientHeight

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
  buttonRefs: (ButtonRef | null)[]
  selected?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  fontColor?: string
  isFocused?: boolean
  resultsDivRef?: DivRef
  indexOfLastItemAdded?: NumberRef
  index?: number
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
  indexOfLastItemAdded,
}: ResultButtonProps) => {
  const buttonRef: ButtonRef = useRef(null)
  useEffect(() => {
    if (isFocused) buttonRef.current?.focus({ preventScroll: true })
    setRef(indexOfLastItemAdded, null)
  })
  buttonRefs.push(buttonRef)

  return (
    <ItemButton
      tabIndex={-1}
      onClick={onClick}
      style={{ color: fontColor }}
      ref={buttonRef}
      onFocus={e => resultButtonFocusHandler(e, resultsDivRef)}
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
  const isVisibleInDiv = isVisibleInContainer.bind(null, resultsDiv)

  if (isInputFocused || isVisibleInDiv(focusedElement) || !resultsDiv) {
    const focusedIndex: number = order.indexOf(focusedElement)
    return order[focusedIndex + (up ? -1 : 1)]
  } else {
    // If the focusedElement is not visible, to avoid unexpected scrolling of
    // the results div, move focus to a button that is already visible
    return up
      ? // If moving up, focus the last visible button
        buttons.findLast(isVisibleInDiv)
      : // If moving down, focus the first visible button
        buttons.find(isVisibleInDiv)
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

  const inputRef: InputRef = useRef(null)
  const buttonRefs: (ButtonRef | null)[] = []

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

  const handleKeyDownFromContainer: KeyboardEventHandler<
    HTMLFormElement
  > = e => {
    if (!inputRef) return
    if (!isFocusable(e.target)) return

    const buttons = buttonRefs.reduce<HTMLButtonElement[]>(
      (buttons, ref) =>
        ref && ref.current ? [...buttons, ref.current] : buttons,
      []
    )
    const up = e.key === 'ArrowUp'
    const down = e.key === 'ArrowDown'

    if (e.key === 'Escape') {
      setTimeout(() => setShowResults(false))
      inputRef.current?.focus()
    } else if (up || down) {
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

      elementToFocus?.focus({
        // Scrolling of the list is handled in the button's onFocus handler
        preventScroll: true,
      })
      if (down && isInputFocused) setShowResults(true)
      if (up && elementToFocus === inputRef.current) setShowResults(false)
      e.preventDefault()
    }
  }
  const resultsDivRef: DivRef = useRef(null)
  const indexOfLastItemAdded: NumberRef = useRef<number>(null)
  const resultButtonProps: Partial<ResultButtonProps> = {
    buttonRefs,
    resultsDivRef,
    fontColor,
    indexOfLastItemAdded,
  }

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
        ref={input => {
          setRef(inputRef, input)
        }}
        onKeyDown={handleKeyDownFromSearchBar}
        value={searchString}
        onChange={e => setSearchString(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        iconLeft={iconLeft}
        style={{ backgroundColor, borderColor }}
        fontColor={fontColor}
        areResultsShown={showResults}
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
        <Results style={{ backgroundColor, borderColor }} ref={resultsDivRef}>
          {multiselect && values.length > 0 && (
            <Selected borderColor={borderColor}>
              {values.map((item: Item, index: number) => (
                <ResultButton
                  selected={true}
                  key={item.key}
                  onClick={() => {
                    onRemove?.(item)
                    indexOfLastItemAdded.current = index
                  }}
                  isFocused={index === indexOfLastItemAdded.current}
                  item={item}
                  RenderItem={RenderItem}
                  index={index}
                  {...resultButtonProps}
                />
              ))}
            </Selected>
          )}
          {(results.length && searchString !== values[0]?.label
            ? results
            : items
          ).map((item: Item, index: number) => (
            <ResultButton
              item={item}
              key={item.key}
              isFocused={index === indexOfLastItemAdded.current}
              onClick={() => {
                onAdd(item)
                indexOfLastItemAdded.current = index
              }}
              RenderItem={RenderItem}
              index={index + values.length}
              {...resultButtonProps}
            />
          ))}
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
