import { useEffect, useState } from 'react'
import { FileData, userID } from '../models'

export const FileViewer = ({ userID }: userID) => {
  const [currentData, setData] = useState<FileData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/files/${userID}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (response.ok) {
          const data = await response.json()
          setData(data.files)
          console.log(currentData)
        } else {
          console.error('Не удаётся загрузить список файлов.')
        }
      } catch (error) {
        console.error('Ошибка при отправке данных на бэкенд', error)
      }
      console.log('useEffect done')
    }
    fetchData()
  }, [])

  return (
    <div>
      <ul>
        {currentData.map((file) => (
          <li key={file.original_name}>
            <strong>Оригинальное имя:</strong> {file.original_name},{' '}
            <strong>Размер:</strong> {file.size},{' '}
            <strong>Дата загрузки:</strong> {file.upload_date}
          </li>
        ))}
      </ul>
    </div>
  )
}
