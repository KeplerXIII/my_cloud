import { Dispatch, SetStateAction } from "react"
import { FileData } from '../models'

export const fetchFiles = async (userID:string, setData: Dispatch<SetStateAction<FileData[]>>) => {
  try {
    const response = await fetch(`/api/files/${userID}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      setData(() => data.files)
      console.log(data.files)
    } else {
      console.error('Не удаётся загрузить список файлов.')
    }
  } catch (error) {
    console.error('Ошибка при отправке данных на бэкенд', error)
  }

  console.log('fetchData done')
}
