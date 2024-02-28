import { useEffect, useState } from 'react'
import AuthBlock from './AuthForm'
import RegistrationForm from './RegForm'
import AdmUsersList from './AdmPanel'

export const Registration = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [checkData, setCheckData] = useState(false)

  const handleLogOut = async (): Promise<void> => {
    const response = await fetch('/api/user/logout/', {
      method: 'GET',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (response.ok) {
      setLoggedIn(false)
    } else {
      console.error('Ошибка при регистрации')
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/user/islogin/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (response.ok) {
          const data = await response.json()
          setUsername(data.username)
          setLoggedIn(true)
        } else {
          console.error('Сессия не авторизована')
        }
      } catch (error) {
        console.error('Ошибка при отправке данных на бэкенд', error)
      }
      setCheckData(true)
    }

    fetchData()
  }, [])

  if (!checkData) return <article className="articleForm">Loading...</article>
  return (
    <div className="userProfile">
      {!loggedIn ? (
        <>
          <div>
            <h1 className="article__title">Вход</h1>
            <AuthBlock setLoggedIn={setLoggedIn} setUsername={setUsername} />
          </div>
          <div className="divider"></div>
          <div>
            <h1 className="article__title">Регистрация</h1>
            <RegistrationForm
              setLoggedIn={setLoggedIn}
              setUsername={setUsername}
            />
          </div>
        </>
      ) : (
        <div className="mainProfile">
          <div className='userProfile'>
            <p className="formText">{username}, вы успешно авторизованы!</p>
            <button type="submit" className='editButton' onClick={handleLogOut}>
              Выйти
            </button>
          </div>
          <AdmUsersList />
        </div>
      )}
    </div>
  )
}
