export const isNormalObject = (
  value: unknown
): value is Record<string, unknown> =>
  !!value &&
  typeof value === 'object' &&
  typeof value !== 'function' &&
  !Array.isArray(value)
