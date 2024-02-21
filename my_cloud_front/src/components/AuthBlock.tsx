import { useEffect, useState } from 'react'
import { FormData } from '../models'

const AuthBlock = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  
  useEffect(() => {
    // const searchParams = new URLSearchParams(window.location.search)
    // const needLogin = searchParams.get('needLogin');
    // if (needLogin) setLoggedIn(true)
    const fetchData = async () => {
      try {
        const response = await fetch('/api/islogin/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const responseData = await response.json()
        console.log(responseData.login)
        if (response.ok) {
          console.log('Сессия авторизована!');
          setLoggedIn(true);
          // Дополнительные действия при успешной регистрации
        } else {
          console.error('Ошибка при входе');
          // Дополнительные действия при ошибке регистрации
        }
      } catch (error) {
        console.error('Ошибка при отправке данных на бэкенд', error);
      }
      console.log('useEffect done');
    };
  
    fetchData();
  }, [])

  const handleLogOut  = async (): Promise<void> => {
    const response = await fetch('/api/logout/', {
      method: 'GET',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (response.ok) {
      console.log('Вышли!');
      setLoggedIn(false)
      // Дополнительные действия при успешной регистрации
    } else {
      console.error('Ошибка при регистрации');
      // Дополнительные действия при ошибке регистрации
    }
  }

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
        // Дополнительные действия при успешной регистрации
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
      {loggedIn ? (
        <><p>Вы успешно авторизованы!</p><button type="submit" onClick={handleLogOut}>Выйти</button></>
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
