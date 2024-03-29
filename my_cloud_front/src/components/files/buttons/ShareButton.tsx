import { FileButtonType } from '../../../models'
import { fetchFiles } from '../fetchFiles'

export const FileShareButton = ({ fileID, userID, setData }: FileButtonType) => {
  const handleShare = async () => {
    try {
      const response = await fetch(
        `/api/files/generate_special_link/${fileID}/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.ok) {
        const data = await response.json()
        // await navigator.clipboard.writeText(data.special_link);
        fetchFiles(userID, setData)
        alert(`Одноразовая ссылка для скачивания: ${data.special_link}`)
      } else {
        const data = await response.json()
        console.error('Ошибка генерации ссылки:', data.message)
      }
    } catch (error) {
      console.error('Ошибка генерации ссылки:', error)
    }
  }

  return (
    <button className="deleteButton" onClick={handleShare}>
      &#128279;
    </button>
  )
}
