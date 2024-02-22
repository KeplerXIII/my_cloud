import { ChangeEvent, FormEvent, useState } from 'react'
import { FormData, authBlockProps } from '../models'

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setRegErr('')
    const formData: FormData = {
      username,
      password,
      email,
    }

    try {
      const response = await fetch('/api/register/', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setLoggedIn(true)
        setUsername(data.username)
        console.log('Регистрация прошла успешно!')
      } else {
        console.error('Ошибка при регистрации')
        setRegErr('Данные уже существуют в базе или введены некорректно')
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
