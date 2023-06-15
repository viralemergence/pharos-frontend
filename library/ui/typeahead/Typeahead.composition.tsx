import React, { useState } from 'react'
import Typeahead from './'

const exampleItems = [
  { label: 'item one', key: '1' },
  { label: 'item two', key: '2' },
]

export const BasicMultiselectTypeahead = () => {
  const [selected, setSelected] = useState<typeof exampleItems>([])
  const selectedKeys = selected.map(i => i.key)
  const unselected = exampleItems.filter(i => !selectedKeys.includes(i.key))

  const placeholder =
    selected.length > 0 ? `${selected.length} items selected` : 'Search'

  return (
    <div style={{ width: 500, height: 150 }}>
      <Typeahead
        multiselect
        placeholder={placeholder}
        items={unselected}
        values={selected}
        onAdd={item => setSelected(prev => [...prev, item])}
        onRemove={item =>
          setSelected(prev => prev.filter(i => i.key !== item.key))
        }
      />
    </div>
  )
}

export const BasicSingleSelectTypeahead = () => {
  const [selected, setSelected] = useState<typeof exampleItems>([])
  const selectedKeys = selected.map(i => i.key)
  const unselected = exampleItems.filter(i => !selectedKeys.includes(i.key))

  return (
    <div style={{ width: 500, height: 150 }}>
      <Typeahead
        placeholder="Search"
        items={unselected}
        values={selected}
        onAdd={item => setSelected([item])}
        onRemove={item =>
          setSelected(prev => prev.filter(i => i.key !== item.key))
        }
      />
    </div>
  )
}
