export const commaSeparatedList = (strings: string[]) => {
  if (!strings) return undefined
  if (strings.length === 1) return strings[0]
  const list = strings.slice(0, -1).join(', ')
  const last = strings[strings.length - 1]
  const oxfordComma = strings.length > 2 ? ',' : ''
  return `${list}${oxfordComma} and ${last}`
}
