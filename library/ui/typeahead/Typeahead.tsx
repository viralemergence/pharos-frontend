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
import Expander from '@talus-analytics/library.ui.expander'

import {
  Container,
  SearchBar,
  Results,
  ItemButton,
  SearchIcon,
  Values as Values,
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
  /** Whether fixes should be added to counteract the
   * tabindex=-1 issue that Reach Router adds. Note that
   * Gatsby uses Reach Router at time of writing */
  useReachRouterFixes?: boolean
}

// const isVisibleInContainer = (
//   container: HTMLElement | null,
//   percentageVisible = 1,
//   elem: Element | null
// ) =>
//   elem &&
//   container &&
//   elem instanceof HTMLElement &&
//   elem.offsetTop + elem.clientHeight * (1 - percentageVisible) >=
//     container.scrollTop &&
//   elem.offsetTop <=
//     container.scrollTop +
//       container.clientHeight -
//       elem.clientHeight * (1 - percentageVisible)

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
  hoverColor = 'rgba(0, 50, 100, 0.08)',
  selectedHoverColor = 'rgba(100, 0, 50, 0.08)',
  className,
  disabled = false,
  style = {},
  resultsMaxHeight = '30em',
  ariaLabel,
  inputId,
  useReachRouterFixes = false,
}: TypeaheadProps) => {
  if (!items) throw new Error('Item array in multiselect cannot be undefined')

  const [searchString, setSearchString] = useState('')
  const [showResults, setShowResults] = useState(false)

  // The index of the focused item in the typeahead. This is either the input
  // (whose index is -1) or a button.
  const [focusedElementIndex, setFocusedElementIndex] = useState<number>(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

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

    const [values, items] = [...(resultsRef.current?.children || [])]
    const allButtons = [...(values?.children || []), ...(items?.children || [])]

    const target = allButtons[focusedElementIndex]

    // I think something like this will be the way to handle
    // the pageup / pagedown keys jumping focus interaction
    // it's not working right now though

    // if (!isVisibleInContainer(resultsRef.current, 0.5, target)) {
    //   const visibleButton = allButtons.find(elem =>
    //     isVisibleInContainer(resultsRef.current, 0.5, elem)
    //   )
    //   if (!visibleButton) return

    //   setFocusedElementIndex(allButtons.indexOf(visibleButton))
    //   return
    // }

    if (!(target instanceof HTMLElement)) return

    // scroll the list smoothly so that the focused element is
    // exactly at the bottom, overriding default scrolling
    const { top: buttonTop, bottom: buttonBottom } =
      target.getBoundingClientRect()

    const { top: listTop, bottom: listBottom } =
      resultsRef.current.getBoundingClientRect()

    let delta = 0
    if (buttonBottom > listBottom) delta = buttonBottom - listBottom
    else if (buttonTop < listTop) delta = buttonTop - listTop

    // apply scroll offset
    resultsRef.current.scrollTop += delta
    // focus after scroll
    target.focus()
  }, [focusedElementIndex, values, showResults])

  const handleKeyDownFromContainer: KeyboardEventHandler<
    HTMLFormElement
  > = e => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        setFocusedElementIndex(prev => {
          // if we are in the input, stay there
          if (prev === -1) return -1
          // if we are in the results, go down one
          return prev - 1
        })
        return
      case 'ArrowDown':
        e.preventDefault()
        setFocusedElementIndex(prev => {
          // if we are at the end of the list, stay there
          if (prev === items.length + values.length - 1) return prev
          // if we are in the results, go down one
          return prev + 1
        })
        return
      case 'Escape':
        inputRef.current?.blur()
        reset()
        return
      case 'Tab':
        if (e.shiftKey) unprotectFocus()
        return
    }
  }

  const handleKeyDownFromSearchBar: KeyboardEventHandler<
    HTMLInputElement
  > = e => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        if (results[0] || items[0]) onAdd(results[0] || items[0])
        return
    }
  }

  const unselectedItems =
    results.length && searchString !== values[0]?.label ? results : items

  const containerRef = useRef<HTMLFormElement>(null)

  // These two callbacks prevent Reach Router's <div tabindex=-1> from
  // interfering with how focus moves. See https://jsfiddle.net/_rkl_/eu1L6k4p/11/
  const protectFocus = () => {
    if (!useReachRouterFixes) return
    const container = containerRef.current
    if (!container) return
    if (container.getAttribute('tabindex') !== '0')
      container.setAttribute('tabindex', '0')
  }
  const unprotectFocus = () => {
    if (!useReachRouterFixes) return
    containerRef.current?.removeAttribute('tabindex')
  }

  return (
    <Container
      ref={containerRef}
      onFocus={() => {
        setShowResults(true)
      }}
      onBlur={e => {
        // Ignore bubbled blur events
        if (containerRef?.current?.contains(e.relatedTarget as Node)) return
        reset()
        unprotectFocus()
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
        onFocus={() => {
          setFocusedElementIndex(-1)
          protectFocus()
        }}
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
          resultsMaxHeight={resultsMaxHeight}
          ref={resultsRef}
          onFocus={e => {
            // TODO: Is this check needed?
            if (!containerRef?.current?.contains(e.relatedTarget))
              protectFocus()
          }}
          onBlur={e => {
            if (!containerRef?.current?.contains(e.relatedTarget))
              unprotectFocus()
          }}
        >
          {multiselect && values.length > 0 && (
            <Values borderColor={borderColor}>
              {values.map((item: Item) => (
                <ItemButton
                  key={item.key}
                  tabIndex={-1}
                  onClick={() => {
                    if (onRemove) onRemove(item)
                    setFocusedElementIndex(prev => (prev >= 1 ? prev - 1 : 0))
                  }}
                  style={{ color: fontColor }}
                  focusHoverColor={selectedHoverColor}
                >
                  <RenderItem selected item={item} />
                </ItemButton>
              ))}
            </Values>
          )}
          <Items>
            {unselectedItems.map((item: Item) => (
              <ItemButton
                key={item.key}
                tabIndex={-1}
                onClick={() => {
                  onAdd(item)
                  setFocusedElementIndex(prev => (prev === -1 ? 1 : prev + 1))
                }}
                style={{ color: fontColor }}
                focusHoverColor={hoverColor}
              >
                <RenderItem item={item} />
              </ItemButton>
            ))}
          </Items>
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
