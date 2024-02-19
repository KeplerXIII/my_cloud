import { useState } from 'react'

const RegistrationForm = () => {
  // Состояния для хранения данных формы
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'username') setUsername(value)
    else if (name === 'password') setPassword(value)
    else if (name === 'email') setEmail(value)
  }
  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Опционально: валидация данных формы перед отправкой на бэкенд
    // Создание объекта с данными формы
    const formData = {
      username: username,
      password: password,
      email: email,
    }
    try {
      // Отправка данных на бэкенд Django
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      // Обработка ответа от бэкенда
      if (response.ok) {
        console.log('Регистрация прошла успешно!')
        // Дополнительные действия при успешной регистрации
      } else {
        console.error('Ошибка при регистрации')
        // Дополнительные действия при ошибке регистрации
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
      <br />
      <button type="submit">Зарегистрироваться</button>
    </form>
  )
}
export default RegistrationForm
