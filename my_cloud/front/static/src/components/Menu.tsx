import { NavLink } from 'react-router-dom'

export const Menu = () => {
  const menuItemClassName = ({ isActive }: { isActive: boolean }) =>
    'menu__item ' + (isActive && 'menu__item-active')

  return (
    <nav className="menu">
      <NavLink className={menuItemClassName} to="/">
        Главная
      </NavLink>
      <NavLink className={menuItemClassName} to="/my_files">
        Мои файлы
      </NavLink>
      <NavLink className={menuItemClassName} to="/registration">
        Регистрация
      </NavLink>
    </nav>
  )
}
