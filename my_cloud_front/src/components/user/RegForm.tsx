import { ChangeEvent, FormEvent, useState } from 'react'
import { FormData, authBlockProps } from '../../models'

const RegistrationForm = ({ setLoggedIn, setUsername }: authBlockProps) => {
  const [username, setCurrentUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [regErr, setRegErr] = useState('')

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    if (name === 'username') setCurrentUsername(value)
    else if (name === 'password') setPassword(value)
    else if (name === 'email') setEmail(value)
  }

  const validateUsername = (input: string): boolean => {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{3,19}$/
    return usernameRegex.test(input)
  }

  const validatePassword = (input: string): boolean => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    return passwordRegex.test(input)
  }

  const validateEmail = (input: string): boolean => {
    // Простая проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(input)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setRegErr('')

    if (!validateUsername(username)) {
      setRegErr(
        'Логин должен состоять из латинских букв и цифр, начинаться с буквы и иметь длину от 4 до 20 символов',
      )
      return
    }

    if (!validatePassword(password)) {
      setRegErr(
        'Пароль должен быть не менее 6 символов и содержать по крайней мере одну заглавную букву, одну цифру и один специальный символ',
      )
      return
    }

    if (!validateEmail(email)) {
      setRegErr('Введите корректный адрес электронной почты')
      return
    }

    const formData: FormData = {
      username,
      password,
      email,
    }

    try {
      const response = await fetch('/api/user/registration/', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setRegErr('Регистрация успешна, авторизуемся!')
        setTimeout(() => {
          setLoggedIn(true)
          setUsername(data.username)
        }, 2000)
      } else {
        console.error('Ошибка при регистрации')
        setRegErr('Пользователь уже зарегистрирован.')
      }
    } catch (error) {
      console.error('Ошибка при отправке данных на бэкенд', error)
    }
  }

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <label>
        Имя пользователя:
        <input
          type="text"
          name="username"
          value={username}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Пароль:
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
        />
      </label>
      {regErr ? (
        <>
          <p className="formText">{regErr}</p>
        </>
      ) : (
        <></>
      )}
      <br />
      <button type="submit">Зарегистрироваться</button>
    </form>
  )
}

export default RegistrationForm
