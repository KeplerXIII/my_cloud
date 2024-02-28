import { useEffect, useState } from 'react'
import { UserListType } from '../../models'

const AdmUsersList = () => {
  const [users, setUsers] = useState<UserListType[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdm, setShowAdm] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/user/all')
        if (response.ok) {
          const data = await response.json()
          setUsers(data.users)
          setShowAdm(true)
        } else {
          setShowAdm(false)
          console.error('Недостаточно прав для получения списка пользователей.')
        }
      } catch (error) {
        console.error('Ошибка при запросе на бэкенд', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return <p>Загрузка...</p>
  }

  return (
    <>
      {showAdm && (
        <div className="admPanel">
          <h2 className="admListHeader">Список пользователей:</h2>
          <ul>
            {users.map((user) => (
              <li key={user.userID} className="userListItem">
                {user.userName} (ID: {user.userID}, Админ:{' '}
                {user.isAdmin ? 'Да' : 'Нет'}), Всего файлов:
                {user.totalStorageCount}, Объём: {user.totalStorageSize}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

export default AdmUsersList
