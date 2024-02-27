import { useEffect, useState } from 'react'
import FileUpload from './FileUpload'
import { FileViewer } from './FileViewer'
import { FileData } from '../../models'

export const MyFiles = () => {
  const [userID, setUserID] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [currentData, setData] = useState<FileData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/islogin/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (response.ok) {
          const data = await response.json()
          setUserID(data.id)
          console.log(userID)
          setLoggedIn(true)
        } else {
          console.error('Сессия не авторизована')
        }
      } catch (error) {
        console.error('Ошибка при отправке данных на бэкенд', error)
      }
      console.log('useEffect done')
    }

    fetchData()
  }, [loggedIn, userID])

  return (
    <article className="article">
      {loggedIn ? (
        <>
          <h1 className="article__title">Загрузка файлов</h1>
          <FileUpload
            userID={userID}
            currentData={currentData}
            setData={setData}
          />
          <h1 className="article__title">Ваши файлы</h1>
          <FileViewer
            userID={userID}
            currentData={currentData}
            setData={setData}
          />
        </>
      ) : (
        <p className="formText">Необходимо залогиниться.</p>
      )}
    </article>
  )
}
