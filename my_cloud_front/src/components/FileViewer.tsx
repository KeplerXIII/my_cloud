import { useEffect } from 'react'
import { FileViewerType } from '../models'
import { fetchFiles } from '../hooks/fetchFiles'

export const FileViewer = ({
  userID,
  currentData,
  setData,
}: FileViewerType) => {
  useEffect(() => {
    fetchFiles(userID, setData)
  }, [userID])

  return (
    <div>
      <ul>
        {currentData.map((file) => (
          <li key={file.original_name} className="fileItem">
            <strong>Оригинальное имя:</strong> {file.original_name},{' '}
            <strong>Размер:</strong> {file.size},{' '}
            <strong>Дата загрузки:</strong> {file.upload_date}
            <button className="downloadButton">&#8595;</button> {/* Зеленая стрелка вниз - скачать */}
            <button className="deleteButton">&#10060;</button> {/* Красный крестик - удалить */}
            <button className="shareButton">&#128279;</button> {/* Значок поделиться */}
          </li>
        ))}
      </ul>
    </div>
  )
}
