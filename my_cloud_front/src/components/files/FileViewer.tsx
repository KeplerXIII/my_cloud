import { useEffect } from 'react'
import { FileViewerType } from '../../models'
import { fetchFiles } from './fetchFiles'
import { dataConverter } from './dateConverter'
import { FileDeleteButton } from './DeleteButton'
import { FileDownloadButton } from './DownloadButton'

export const FileViewer = ({
  userID,
  currentData,
  setData,
}: FileViewerType) => {
  useEffect(() => {
    fetchFiles(userID, setData)
  }, [userID])

  console.log(currentData)
  return (
    <div>
      <ul>
        {currentData.map((file) => (
          <li key={file.id} className="fileItem">
            <p>
              Автор: {file.author} Имя файла: {file.original_name} Размер:{' '}
              {(file.size / (1024 * 1024)).toFixed(2)} Mb Загружено:{' '}
              {dataConverter(file.upload_date)} Последнее скачивание: {dataConverter(file.download_date)}
            </p>
            <FileDownloadButton
              fileID={file.id}
              userID={userID}
              setData={setData}
            />{' '}
            <FileDeleteButton
              fileID={file.id}
              userID={userID}
              setData={setData}
            />{' '}
            <button className="shareButton">&#128279;</button>{' '}
          </li>
        ))}
      </ul>
    </div>
  )
}
