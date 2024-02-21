import { useEffect, useState } from 'react'
import AuthBlock from './AuthBlock'
import RegistrationForm from './RegForm'

export const Registration = () => {
  const [loggedIn, setLoggedIn] = useState(false)

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/islogin/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          console.log('Сессия авторизована!');
          setLoggedIn(true);
        } else {
          console.error('Сессия не авторизована');
        }
      } catch (error) {
        console.error('Ошибка при отправке данных на бэкенд', error);
      }
      console.log('useEffect done');
    };
  
    fetchData();
  }, [])

  return  <article className="articleForm">
             {!loggedIn ? ( <>
                            <div>
                                <h1 className="article__title">Вход</h1>
                                <AuthBlock setLoggedIn={setLoggedIn}/>
                              </div>
                              <div className='divider'>
                              </div>
                              <div>
                                <h1 className="article__title">Регистрация</h1>
                                <p className="article__paragraph">Форма регистрации:</p>
                                <RegistrationForm />
                              </div>
                            </>
              ) : (<><p className="formText">Вы успешно авторизованы!</p><button type="submit" onClick={handleLogOut}>Выйти</button></>)}
          </article>

}
