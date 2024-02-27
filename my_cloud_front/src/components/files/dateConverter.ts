export const dataConverter = (serverDate: string) => {
  console.log(serverDate)
  if (!serverDate) return '-'
  const utcDate = new Date(serverDate)
  const localDate = utcDate.toLocaleString()
  console.log(localDate)
  return localDate
}
