const formatDate = (string: string) =>
  new Date(string).toLocaleString('default', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })

export default formatDate
