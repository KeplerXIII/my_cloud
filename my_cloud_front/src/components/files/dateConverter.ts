export const dataConverter = (serverDate: string) => {
  if (!serverDate) return '-'
  const utcDate = new Date(serverDate)
  const localDate = utcDate.toLocaleString()
  return localDate
}
