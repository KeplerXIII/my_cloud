import { useEffect } from 'react'
import { FileViewerType } from '../../models'
import { fetchFiles } from './fetchFiles'
import { dataConverter } from './dateConverter'
import { FileDeleteButton } from './buttons/DeleteButton'
import { FileDownloadButton } from './buttons/DownloadButton'
import { FileShareButton } from './buttons/ShareButton'
import { FileNameEditor } from './FileNameEditor'

export const FileViewer = ({
  userID,
  currentData,
  setData,
}: FileViewerType) => {
  useEffect(() => {
    fetchFiles(userID, setData)
  }, [userID])

  useEffect(() => {
    const socket = new WebSocket(`ws://${import.meta.env.VITE_WEBSOCKET_HOST}:${import.meta.env.VITE_WEBSOCKET_PORT}/ws/notification/`)
    socket.onopen = () => {}

    socket.onmessage = () => {
      fetchFiles(userID, setData)
    }

    socket.onclose = () => {}

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error)
    }
    return () => {
      socket.close()
    }
  }, [])

  return (
    <div>
      <ul className="fileList">
        {currentData.map((file) => (
          <li key={file.id} className="fileItem">
            <div className="fileDetails">
              <p>
                <strong>Автор:</strong>
                <span>{file.author}</span>
              </p>
              <p>
                <strong>Имя файла:</strong>
                <FileNameEditor
                  fileID={file.id}
                  fileName={file.original_name}
                  userID={userID}
                  setData={setData}
                />
              </p>
              <p>
                <strong>Размер:</strong>{' '}
                <span className="cardInfo">
                  {(file.size / (1024 * 1024)).toFixed(2)} Mb
                </span>
              </p>
              <p>
                <strong>Загружено:</strong>
                <span className="cardInfo">
                  {dataConverter(file.upload_date)}
                </span>
              </p>
              <p>
                <strong>Последнее скачивание:</strong>{' '}
                <span className="cardInfo">
                  {dataConverter(file.download_date)}
                </span>
              </p>
              <p>
                {file.special_link ? (
                  <p>
                    <strong>Одноразовая ссылка:</strong>
                    <span className="cardInfo">{file.special_link}</span>
                  </p>
                ) : (
                  <p>
                    <strong>Одноразовая ссылка:</strong>
                    <span className="cardInfo">отсутствует</span>
                  </p>
                )}
              </p>
            </div>
            <div className="fileActions">
              <FileDownloadButton
                fileID={file.id}
                userID={userID}
                setData={setData}
              />
              <FileDeleteButton
                fileID={file.id}
                userID={userID}
                setData={setData}
              />
              <FileShareButton
                fileID={file.id}
                userID={userID}
                setData={setData}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
