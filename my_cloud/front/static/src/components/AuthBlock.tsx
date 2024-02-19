import { useState } from 'react'

const AuthBlock = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  const handleLogin = () => {
    // Здесь вы можете добавить логику проверки логина и пароля
    // В данном примере просто устанавливаем состояние "loggedIn" в true, чтобы симулировать успешную авторизацию.
    setLoggedIn(true)
  }

  return (
    <div>
      {loggedIn ? (
        <p>Вы успешно авторизованы!</p>
      ) : (
        <form>
          <label>
            Логин:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <br />
          <button type="button" onClick={handleLogin}>
            Войти
          </button>
        </form>
      )}
    </div>
  )
}

export default AuthBlock
