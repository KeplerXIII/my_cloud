export const dataConverter = (serverDate: string) => {
  const utcDate = new Date(serverDate)
  const localDate = utcDate.toLocaleString()
  return localDate
}
