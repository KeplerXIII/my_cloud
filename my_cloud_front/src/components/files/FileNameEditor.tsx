import { useState } from 'react'
import { FileNameEditorType } from '../../models'
import { fetchFiles } from './fetchFiles'

export const FileNameEditor = ({
  fileID,
  fileName,
  userID,
  setData,
}: FileNameEditorType) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isRed, setIsRed] = useState(false)
  const [editedFileName, setEditedFileName] = useState('')

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    setEditedFileName(fileName)
  }

  const handleEditSave = async (fileID: number) => {
    // Отправка fetch-запроса для обновления имени файла на сервере
    try {
      const response = await fetch(`/api/files/update_file_name/${fileID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Добавьте любые другие заголовки, необходимые для аутентификации и т. д.
        },
        body: JSON.stringify({ newFileName: editedFileName }),
      })

      if (response.ok) {
        fetchFiles(userID, setData)
        setIsEditing(false)
      } else {
        setIsRed(true)
        setTimeout(() => {
          setIsRed(false)
        }, 1000)
        console.error('Не удалось обновить имя файла')
      }
    } catch (error) {
      console.error('Ошибка при обновлении имени файла:', error)
    }
  }

  const handleEditCancel = async () => {
    setIsEditing(false)
  }

  return (
    <>
      {isEditing ? (
        <>
          <input
            className="editInput"
            type="text"
            value={editedFileName}
            onChange={(e) => setEditedFileName(e.target.value)}
          />
          <button
            className={`editButton ${isRed ? 'redButton' : ''}`}
            onClick={() => handleEditSave(fileID)}
          >
            Сохранить
          </button>
          <button className="editButton" onClick={() => handleEditCancel()}>
            Отменить
          </button>
        </>
      ) : (
        <span
          className="cardInfo"
          onClick={handleEditToggle}
          style={{ cursor: 'pointer' }}
        >
          {fileName}
        </span>
      )}
    </>
  )
}
