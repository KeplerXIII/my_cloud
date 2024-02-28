import { useEffect, useState } from 'react'
import { UserListType } from '../../models'

const AdmUsersList = () => {
  const [users, setUsers] = useState<UserListType[]>([])
  const [showAdm, setShowAdm] = useState(false)
  const [userDeleted, setUserDeleted] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/user/all')
        if (response.ok) {
          const data = await response.json()
          setUsers(data.users)
          setShowAdm(true)
          setUserDeleted(false)
        } else {
          setShowAdm(false)
          console.error('Недостаточно прав для получения списка пользователей.')
        }
      } catch (error) {
        console.error('Ошибка при запросе на бэкенд', error)
      }
    }

    fetchUsers()
  }, [userDeleted])

  const handleDeleteUser = async (userID: number) => {
    try {
      const response = await fetch(`/api/user/delete/${userID}`)
      if (response.ok) {
        setUserDeleted(true)
      } else {
        console.error('Недостаточно прав для получения списка пользователей.')
      }
    } catch (error) {
      console.error('Ошибка при запросе на бэкенд', error)
    }
  }

  const handleToggleAdmin = async (userID: number) => {
    try {
      const response = await fetch(`/api/user/toggle_admin/${userID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setUserDeleted(true)
      } else {
        console.error('Ошибка при изменении прав пользователя.')
      }
    } catch (error) {
      console.error('Ошибка при запросе на бэкэнд', error)
    }
  }

  return (
    <>
      {showAdm && (
        <div className="admPanel">
          <h2 className="admListHeader">Список пользователей:</h2>
          <ul>
            {users.map((user) => (
              <li key={user.userID} className="userListItem">
                <p>
                  {user.userName} (ID: {user.userID}), Всего файлов:
                  {user.totalStorageCount}, Объём:{' '}
                  {(user.totalStorageSize / (1024 * 1024)).toFixed(2)} Mb{' '}
                </p>
                <div className='admControlPanel'>
                  <p>
                    Админ:{' '}
                    <input
                      type="checkbox"
                      checked={user.isAdmin}
                      onChange={() => handleToggleAdmin(user.userID)}
                    />
                  </p>
                  <button
                    className="editButton"
                    onClick={() => handleDeleteUser(user.userID)}
                  >
                    Удалить
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

export default AdmUsersList
