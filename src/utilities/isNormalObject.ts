const isNormalObject = (value: unknown): value is Record<string, unknown> =>
  value !== undefined &&
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value)

export default isNormalObject
