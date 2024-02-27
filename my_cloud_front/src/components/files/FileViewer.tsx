import { useEffect } from 'react'
import { FileViewerType } from '../../models'
import { fetchFiles } from './fetchFiles'
import { dataConverter } from './dateConverter'
import { FileDeleteButton } from './DeleteButton'
import { FileDownloadButton } from './DownloadButton'
import { FileShareButton } from './ShareButton'

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
      <ul className="fileList">
        {currentData.map((file) => (
          <li key={file.id} className="fileItem">
            <div className="fileDetails">
              <p>
                <strong>Автор:</strong> {file.author}
              </p>
              <p>
                <strong>Имя файла:</strong> {file.original_name}
              </p>
              <p>
                <strong>Размер:</strong>{' '}
                {(file.size / (1024 * 1024)).toFixed(2)} Mb
              </p>
              <p>
                <strong>Загружено:</strong> {dataConverter(file.upload_date)}
              </p>
              <p>
                <strong>Последнее скачивание:</strong>{' '}
                {dataConverter(file.download_date)}
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
