import React, { useState } from 'react'
import { fetchFiles } from '../hooks/fetchFiles'
import { FileViewerType } from '../models'

export const FileUpload = ({ userID, setData }: FileViewerType) => {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      alert('Выберите файл для загрузки')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/files/add/', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        alert('Файл успешно загружен')
        fetchFiles(userID, setData)
      } else {
        alert('Ошибка при загрузке файла')
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error)
    }
  }

  return (
    <div className="fileInputBlock">
      <input className="fileInput" type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Загрузить файл</button>
    </div>
  )
}

export default FileUpload
