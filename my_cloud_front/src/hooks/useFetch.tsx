import { useEffect, useRef, useState } from 'react'
import { FetchData } from '../models'

export const useFetch = <T,>(url: string): FetchData<T> => {
  const [data, setData] = useState()
  const [isLoading, setLoading] = useState(false)
  const [hasError, setError] = useState<Error | null>(null)
  const timestampRef = useRef<number>()

  useEffect(() => {
    const fetchData = async () => {
      const timestamp = Date.now()
      timestampRef.current = timestamp
      setLoading(true)

      try {
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(response.statusText)
        }

        const result = await response.json()

        if (timestampRef.current === timestamp) {
          setData(result)
        }

        setError(null)
      } catch (e) {
        if (e instanceof Error) setError(e)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, isLoading, hasError }
}
