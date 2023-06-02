import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  KeyboardEventHandler,
} from 'react'
import Fuse from 'fuse.js'
import styled from 'styled-components'
import Expander from '@talus-analytics/library.ui.expander'

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
  [key: string]: any
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
}

// Following a pattern used by, for example, https://designsystem.digital.gov/components/combo-box/
const ScreenReaderOnly = styled.div`
  position: absolute;
  left: -999em;
  right: auto;
`

/** Reduce list scrolling when button is focused */
const resultButtonFocusHandler = (
  e: React.FocusEvent<HTMLButtonElement>,
  resultListRef: React.RefObject<HTMLDivElement>
) => {
  const button = e.target
  const list = resultListRef.current
  if (!list) return
  const { top: buttonTop, bottom: buttonBottom } =
    button.getBoundingClientRect()
  const { top: listTop, bottom: listBottom } = list.getBoundingClientRect()
  let delta = 0
  if (buttonBottom > listBottom) delta = buttonBottom - listBottom
  else if (buttonTop < listTop) delta = buttonTop - listTop
  list.scrollTop += delta
}

const ResultButton = ({
  selected = false,
  item,
  onClick,
  fontColor,
  updateResultButtonsRef,
  resultListRef,
  RenderItem,
}: {
  selected?: boolean
  item: Item
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  fontColor?: string
  updateResultButtonsRef: (button: HTMLButtonElement | null, item: Item) => void
  resultListRef: React.RefObject<HTMLDivElement>
  RenderItem: (props: RenderItemProps) => JSX.Element
}) => (
  <ItemButton
    tabIndex={-1}
    data-key={item.key}
    onClick={onClick}
    style={{ color: fontColor }}
    ref={buttonElement => updateResultButtonsRef(buttonElement, item)}
    onFocus={e => resultButtonFocusHandler(e, resultListRef)}
  >
    {/* Is key= needed here? */}
    <RenderItem selected={selected} key={item.key} {...{ item }} />
  </ItemButton>
)

const Typeahead = forwardRef(
  (
    {
      multiselect = false,
      items,
      values = [],
      onAdd,
      onRemove,
      placeholder = '',
      RenderItem = ({ item, selected }) => (
        <TypeaheadResult {...{ item, selected }} />
      ),
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
    }: TypeaheadProps,
    inputRef: React.ForwardedRef<HTMLInputElement>
  ) => {
    if (!items) throw new Error('Item array in multiselect cannot be undefined')

    const [searchString, setSearchString] = useState('')
    const [showResults, setShowResults] = useState(false)
    const defaultInputRef = useRef<HTMLInputElement>(null)
    inputRef ||= defaultInputRef
    const resultButtonsRef = useRef<HTMLButtonElement[]>([])

    // compute fuzzy search
    const fuse = useMemo(
      () => new Fuse(items, { keys: searchKeys }),
      [items, searchKeys]
    )

    const results = fuse
      .search(searchString)
      .map(({ item }: { item: Item }) => item)

    const keydownFromSearchBarHandlers: Record<string, KeyboardEventHandler> = {
      // TODO: Is accepting the top result on enter desired?
      // accept top result if enter is pressed
      Enter: _e => {
        if (results[0] || items[0]) onAdd(results[0] || items[0])
        inputRef.current!.blur()
        setSearchString('')
      },
      Esc: _e => {
        setShowResults(false)
      },
    }

    const handleKeyDownFromSearchBar: KeyboardEventHandler = e => {
      keydownFromSearchBarHandlers[e.key]?.(e)
    }

    // close results onBlur, but
    // not if a button is clicked
    // TODO: Perhaps remove this comment, since it doesn't describe what this bit
    // of code does
    let blurTimeout: ReturnType<typeof global.setTimeout>
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
      const goingUp = e.key === 'ArrowUp'
      const goingDown = e.key === 'ArrowDown'

      if (e.key === 'Escape') {
        setTimeout(() => setShowResults(false))
        inputRef.current?.focus()
      } else if (goingUp || goingDown) {
        const focusedItem = e.target as HTMLElement
        const list = resultListRef.current
        const buttons = resultButtonsRef.current

        /** Arrow keys move the focus up and down through this array, like a tab order. */
        const order = [inputRef.current, ...buttons] as HTMLElement[]

        let itemToFocus: HTMLElement | undefined

        const inputIsFocused = focusedItem === inputRef.current

        // Avoid unexpected scrolling of the results list after Page Up/Down, Home, or End key use
        const isButtonVisible = (button: HTMLElement) =>
          button &&
          list &&
          button.offsetTop >= list.scrollTop &&
          button.offsetTop <= list.scrollTop + list.clientHeight
        if (inputIsFocused || isButtonVisible(focusedItem)) {
          const focusedIndex = order.indexOf(focusedItem)
          itemToFocus = order[focusedIndex + (goingDown ? 1 : -1)]
        } else {
          itemToFocus = goingUp
            ? // If moving up, focus the last visible button
              buttons.findLast(isButtonVisible)
            : // If moving down, focus the first visible button
              buttons.find(isButtonVisible)
        }

        itemToFocus?.focus({
          // Scrolling of list is handled in the button's onFocus handler
          preventScroll: true,
        })

        if (goingDown && inputIsFocused) {
          setShowResults(true)
        }
        if (goingUp && itemToFocus === inputRef.current) {
          setShowResults(false)
        }
        e.preventDefault()
      }
    }

    const updateResultButtonsRef = useCallback(
      (buttonElement: HTMLButtonElement | null, item: Item) => {
        const resultButtons = resultButtonsRef.current
        const index = resultButtons.findIndex(
          ref => ref && ref.dataset.key === item.key
        )
        if (buttonElement) {
          if (index > -1) resultButtons[index] = buttonElement
          else resultButtons.push(buttonElement)
        } else if (index > -1) resultButtons.splice(index, 1)
      },
      []
    )
    const resultListRef = useRef<HTMLDivElement>(null)

    const resultButtonProps = {
      updateResultButtonsRef,
      resultListRef,
      RenderItem,
      fontColor,
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
          disabled={disabled}
          type="search"
          autoComplete="off"
          name="special-auto-fill"
          ref={inputRef}
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
          <Results style={{ backgroundColor, borderColor }} ref={resultListRef}>
            {multiselect && values.length > 0 && (
              <Selected borderColor={borderColor}>
                {values.map((item: Item) => (
                  <ResultButton
                    selected={true}
                    key={item.key}
                    onClick={() => onRemove?.(item)}
                    item={item}
                    {...resultButtonProps}
                  />
                ))}
              </Selected>
            )}
            {(results.length && searchString !== values[0]?.label
              ? results
              : items
            ).map((item: Item) => (
              <ResultButton
                item={item}
                key={item.key}
                onClick={() => onAdd(item)}
                {...resultButtonProps}
              />
            ))}
          </Results>
        </Expander>
        <ScreenReaderOnly>
          When options are available, use the Up and Down arrows on your
          keyboard to review them, and the Enter key to select one.
        </ScreenReaderOnly>
      </Container>
    )
  }
)

export default Typeahead
