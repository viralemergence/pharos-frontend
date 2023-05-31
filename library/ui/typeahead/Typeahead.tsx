import React, { useState, useRef, useEffect, useMemo } from 'react'
import Fuse from 'fuse.js'

import {
  Container,
  SearchBar,
  Results,
  ItemButton,
  SearchIcon,
  Selected,
} from './DisplayComponents'

import TypeaheadResult from './TypeaheadResult'
import Expander from '@talus-analytics/library.ui.expander'

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
  searchKeys?: Fuse.FuseOptionKey[]
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
  const [showResults, setShowResults] = useState(true) // TODO: set back to false
  const inputRef = useRef<HTMLInputElement>(null)

  // compute fuzzy search
  const fuse = useMemo(
    () => new Fuse(items, { keys: searchKeys }),
    [items, searchKeys]
  )

  const results = fuse.search(searchString).map(({ item }) => item)

  const keydownHandlers: Record<string, (e: React.KeyboardEvent) => void> = {
    // accept top result if enter is pressed
    Enter: (e: React.KeyboardEvent) => {
      if (results[0] || items[0]) onAdd(results[0] || items[0])
      inputRef.current!.blur()
      setShowResults(false)
      setSearchString('')
    },
    Tab: (e: React.KeyboardEvent) => {
      console.log('typeahead knows about the tab')
    },
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    keydownHandlers[e.key]?.(e)
  }

  // close results onBlur, but
  // not if a button is clicked
  let blurTimeout: ReturnType<typeof global.setTimeout>
  const onBlurHandler = () => {
    // set it to close next tick
    blurTimeout = setTimeout(() => {
      //setShowResults(false)
      if (!values.length) setSearchString('')
    })
  }

  // if focus is inside the container,
  // cancel the timer, don't close it
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

  return (
    <Container
      onFocus={onFocusHandler}
      onBlur={onBlurHandler}
      className={className}
      onSubmit={e => e.preventDefault()}
      style={{ ...style, backgroundColor }}
      borderColor={borderColor}
      onKeyDown={e => {
        console.log('container keydown', e.key)
      }}
    >
      <SearchBar
        disabled={disabled}
        type="search"
        autoComplete="off"
        name="special-auto-fill"
        ref={inputRef}
        onKeyDown={handleKeyDown}
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
        <Results style={{ backgroundColor, borderColor }}>
          {multiselect && values.length > 0 && (
            <Selected borderColor={borderColor}>
              {values.map((item: Item) => (
                <ItemButton
                  key={item.key}
                  onClick={() => onRemove && onRemove(item)}
                  style={{ color: fontColor }}
                  tabIndex={0}
                >
                  <RenderItem selected key={item.key} {...{ item }} />
                </ItemButton>
              ))}
            </Selected>
          )}
          {(results.length && searchString !== values?.[0]?.label
            ? results
            : items
          ).map(item => (
            <ItemButton
              tabIndex={0}
              key={item.key}
              onClick={() => onAdd(item)}
              style={{ color: fontColor }}
            >
              <RenderItem {...{ item }} />
            </ItemButton>
          ))}
        </Results>
      </Expander>
    </Container>
  )
}

export default Typeahead
