/** Stacking order of elements, starting with the topmost */
const order = [
  'modalContainer',
  'modalBackground',
  'dataPanelFieldSelector',
  'dataToolbarButton',
  'dataPanel',
  'dataTable',
  'dataToolbar',
  'dataMap',
]

const zIndexes = order.reduce<Record<string, number>>((acc, key, index) => {
  acc[key] = order.length - index
  return acc
}, {})

export default zIndexes
