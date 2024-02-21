import { useState } from 'react'
import { FormData, authBlockProps } from '../models'


const AuthBlock = ({ setLoggedIn, setUsername }: authBlockProps) => {
  const [username, setCurrentUsername] = useState('')
  const [password, setPassword] = useState('')


  const handleLogin  = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();

    const formData: FormData = {
      username,
      password,
      email: '',
    };

    try {
      const response = await fetch('/api/login/', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Вход успешен!');
        setLoggedIn(true)
        const data = await response.json()
        setUsername(data.username)
      } else {
        console.error('Ошибка при входе');
        // Дополнительные действия при ошибке регистрации
      }
    } catch (error) {
      console.error('Ошибка при отправке данных на бэкенд', error);
    }
    
    // Здесь вы можете добавить логику проверки логина и пароля
    // В данном примере просто устанавливаем состояние "loggedIn" в true, чтобы симулировать успешную авторизацию.
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
          <br />
          <button type="button" onClick={handleLogin}>
            Войти
          </button>
        </form>
    </div>
  )
}

export default AuthBlock
