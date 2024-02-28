import { useState } from 'react'
import { FormData, authBlockProps } from '../../models'

const AuthBlock = ({ setLoggedIn, setUsername }: authBlockProps) => {
  const [username, setCurrentUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authErr, setAuthErr] = useState('')

  const handleLogin = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    e.preventDefault()
    setAuthErr('')
    const formData: FormData = {
      username,
      password,
      email: '',
    }

    try {
      const response = await fetch('/api/user/login/', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setLoggedIn(true)
        const data = await response.json()
        setUsername(data.username)
      } else {
        setAuthErr('Неверный логин или пароль')
        console.error('Ошибка при входе')
      }
    } catch (error) {
      console.error('Ошибка при отправке данных на бэкенд', error)
    }
  }

  return (
    <div>
      <form>
        <label>
          Логин:
          <input
            type="text"
            value={username}
            onChange={(e) => setCurrentUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Пароль:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {authErr ? (
          <>
            <p className="formText">{authErr}</p>
          </>
        ) : (
          <></>
        )}
        <br />
        <button type="button" onClick={handleLogin}>
          Войти
        </button>
      </form>
    </div>
  )
}

export default AuthBlock
