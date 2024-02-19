import React, { ChangeEvent, FormEvent, useState } from 'react';

interface FormData {
  username: string;
  password: string;
  email: string;
}

const RegistrationForm: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'email') setEmail(value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const formData: FormData = {
      username,
      password,
      email,
    };

    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Регистрация прошла успешно!');
        // Дополнительные действия при успешной регистрации
      } else {
        console.error('Ошибка при регистрации');
        // Дополнительные действия при ошибке регистрации
      }
    } catch (error) {
      console.error('Ошибка при отправке данных на бэкенд', error);
    }
  };

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
  );
};

export default RegistrationForm;
