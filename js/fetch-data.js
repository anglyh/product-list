export const fetchData = async () => {
  const response = await fetch('../data.json')
  return response.json()
}
