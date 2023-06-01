import React, {
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

const focusSmoothly = (
  element: HTMLElement | undefined,
  container: HTMLElement | null
) => {
  if (!element) return null
  if (!container) {
    element.focus()
    return null
  }
  console.log('focusing smoothly')

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })

  // Focus element when the parent stops scrolling
  let lastScrollTop: number | undefined
  let iterations = 1000
  const focusInterval = setInterval(() => {
    const currentScrollTop = container.scrollTop
    if (lastScrollTop === currentScrollTop) {
      clearInterval(focusInterval)
      element.focus()
    } else lastScrollTop = currentScrollTop
    if (iterations === 0) clearInterval(focusInterval)
    iterations--
  }, 50)
  return focusInterval
}

// Following a pattern used by, for example, https://designsystem.digital.gov/components/combo-box/
const ScreenReaderOnly = styled.div`
  position: absolute;
  left: -999em;
  right: auto;
`

const Typeahead = ({
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
}: TypeaheadProps) => {
  if (!items) throw new Error('Item array in multiselect cannot be undefined')

  const [searchString, setSearchString] = useState('')
  const [showResults, setShowResults] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultButtonsRef = useRef<(HTMLButtonElement | null)[]>([])

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

  const smoothFocusingInterval = useRef<ReturnType<typeof setInterval> | null>(
    null
  )

  const handleKeyDownFromContainer: KeyboardEventHandler<
    HTMLFormElement
  > = e => {
    if (e.key === 'Escape') {
      setTimeout(() => {
        setShowResults(false)
      })
      inputRef.current?.focus()
      return
    }
    if (
      ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(
        e.key
      )
    ) {
      const focusedItem = e.target as HTMLElement
      const resultsContainer = resultsContainerRef.current

      /** Using the up and down arrow keys moves the focus up and down within
       * this array. It's like tab order, but for the up and down arrow keys.
       * The Page Up, Page Down, Home and End keys can also be used.
       * */
      const arrowOrder = [
        inputRef.current,
        ...resultButtonsRef.current,
      ] as HTMLElement[]

      /** If the currently focused item is not visible, we'll use as the
       * starting point for the upward or downward motion an item that is
       * visible. This way, if you page down repeatedly and press an arrow key,
       * the list won't send you back where you started. So let's keep track of
       * whether the focused item is visible. */
      let isFocusedItemVisible = true // Initial value

      let resultsContainerBottom: number
      if (resultsContainer) {
        const focusedItemTooHighUpToSee =
          focusedItem.offsetTop < resultsContainer.scrollTop
        resultsContainerBottom =
          resultsContainer.scrollTop + resultsContainer.clientHeight
        const focusedItemTooLowDownToSee =
          focusedItem.offsetTop > resultsContainerBottom
        if (focusedItemTooHighUpToSee || focusedItemTooLowDownToSee)
          isFocusedItemVisible = false
      }

      const index = arrowOrder.indexOf(focusedItem)

      const focusResultSmoothly = (elem: HTMLElement | undefined) => {
        smoothFocusingInterval.current = focusSmoothly(
          elem,
          resultsContainerRef.current
        )
      }
      clearInterval(smoothFocusingInterval.current || undefined)

      if (e.key === 'ArrowUp') {
        let previousItem = arrowOrder[index - 1]
        if (!isFocusedItemVisible && resultsContainer)
          previousItem =
            arrowOrder.findLast(
              item => item.offsetTop < resultsContainerBottom - 10
            ) || previousItem
        previousItem?.focus()
        if (previousItem === inputRef.current) setShowResults(false)
        e.preventDefault()
        return false
      }
      if (e.key === 'ArrowDown') {
        let nextItem = arrowOrder[index + 1]
        if (!isFocusedItemVisible && resultsContainer)
          nextItem =
            arrowOrder.find(
              item => item.offsetTop >= resultsContainer?.scrollTop
            ) || nextItem
        nextItem?.focus()
        if (focusedItem === inputRef.current) setShowResults(true)
        nextItem?.focus()
        e.preventDefault()

        return false
      }
      //if (e.key === 'PageUp') {
      //  const indexFurtherUp = Math.max(index - 10, 1)
      //  const itemFurtherUp = arrowOrder[indexFurtherUp]
      //  itemFurtherUp.focus()
      //  //focusResultSmoothly(itemFurtherUp)
      //  e.preventDefault()
      //  return false
      //}
      // if (e.key === 'PageDown') {
      //   console.log('pagedown')
      //   const indexFurtherDown = Math.min(index + 10, arrowOrder.length - 1)
      //   const itemFurtherDown = arrowOrder[indexFurtherDown]
      //   itemFurtherDown.focus()
      //   // focusResultSmoothly(itemFurtherDown)
      //   e.preventDefault()
      //   return false
      // }
      if (e.key === 'Home') {
        console.log('home')
        const firstResultItem = arrowOrder[1]
        focusResultSmoothly(firstResultItem)
        e.preventDefault()
        return false
      }
      if (e.key === 'End') {
        console.log('end')
        const lastResultItem = arrowOrder.at(-1)
        focusResultSmoothly(lastResultItem)
        e.preventDefault()
        return false
      }
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
  const resultsContainerRef = useRef<HTMLDivElement>(null)

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
        <Results
          style={{ backgroundColor, borderColor }}
          ref={resultsContainerRef}
        >
          {multiselect && values.length > 0 && (
            <Selected borderColor={borderColor}>
              {values.map((item: Item) => (
                <ItemButton
                  tabIndex={-1}
                  key={item.key}
                  data-key={item.key}
                  onClick={() => onRemove && onRemove(item)}
                  style={{ color: fontColor }}
                  ref={buttonElement =>
                    updateResultButtonsRef(buttonElement, item)
                  }
                >
                  <RenderItem selected key={item.key} {...{ item }} />
                </ItemButton>
              ))}
            </Selected>
          )}
          {(results.length && searchString !== values[0]?.label
            ? results
            : items
          ).map((item: Item) => (
            <ItemButton
              tabIndex={-1}
              key={item.key}
              onClick={() => onAdd(item)}
              style={{ color: fontColor }}
              ref={buttonElement => updateResultButtonsRef(buttonElement, item)}
              data-key={item.key}
            >
              <RenderItem {...{ item }} />
            </ItemButton>
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

export default Typeahead
