import { FileButtonType } from '../../../models'
import { fetchFiles } from '../fetchFiles'

export const FileDownloadButton = ({ fileID, userID, setData }: FileButtonType) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/files/download_file/${fileID}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const contentDispositionHeader = response.headers.get(
          'Content-Disposition',
        )

        if (contentDispositionHeader) {
          const regex = /filename="(.*?)"/
          const match = contentDispositionHeader.match(regex)

          if (match && match[1]) {
            const fileName = match[1]

            // Создаем временную ссылку на Blob
            const url = URL.createObjectURL(blob)

            // Создаем ссылку для скачивания
            const link = document.createElement('a')
            link.href = url
            link.download = fileName
            document.body.appendChild(link)

            // Имитируем клик по ссылке
            link.click()

            // Освобождаем ресурсы
            URL.revokeObjectURL(url)
            document.body.removeChild(link)

          } else {
            console.error(
              'Не удалось извлечь имя файла из заголовка Content-Disposition',
            )
          }
        } else {
          console.error('Отсутствует заголовок Content-Disposition в ответе')
        }
        
        fetchFiles(userID, setData)
      } else {
        const data = await response.json()
        console.error('Ошибка при скачивании файла:', data.message)
      }
    } catch (error) {
      console.error('Ошибка при скачивании файла:', error)
    }
  }

  return (
    <button className="deleteButton" onClick={handleDownload}>
      &#128229;
    </button>
  )
}
