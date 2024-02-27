import { FileButtonType } from '../../models'

export const FileShareButton = ({ fileID }: FileButtonType) => {
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
        await navigator.clipboard.writeText(data.special_link);
        alert(`Одноразовая ссылка для скачивания скопирована в буфер: ${data.special_link}`)
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
