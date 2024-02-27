import { FileButtonType } from '../../models'
import { fetchFiles } from './fetchFiles'

export const FileDeleteButton = ({
  fileID,
  userID,
  setData,
}: FileButtonType) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/files/delete_file/${fileID}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        fetchFiles(userID, setData)
      } else {
        const data = await response.json()
        console.error('Ошибка при удалении файла:', data.message)
      }
    } catch (error) {
      console.error('Ошибка при удалении файла:', error)
    }
  }

  return (
    <button className="deleteButton" onClick={handleDelete}>
      &#10060;
    </button>
  )
}
