import { useEffect, useState } from 'react'
import FileUpload from './FileUpload'
import { FileViewer } from './FileViewer'

export const MyFiles = () => {
  const [userID, setUserID] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

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
          <FileUpload />
          <h1 className="article__title">Ваши файлы</h1>
          <FileViewer userID={userID} />
        </>
      ) : (
        <p className="formText">Необходимо залогиниться.</p>
      )}
    </article>
  )
}