export const HomePage = () => {
  return (
    <article className="article">
      <h1 className="article__title">Моё облако</h1>
      <p className="article__paragraph">
        <p className="mainParagraph">
          Это учебный проект - "My Cloud", разработанный в целях получения
          практических навыков на основе полученных знаний. "My Cloud" - это
          персональное файловое хранилище для загрузки, хранения и передачи
          файлов.
        </p>
        <h2 className="mainSubHeader">Инструкция по использованию:</h2>
        <p className="mainParagraph">
          <strong>- Во вкладке "ПРОФИЛЬ"</strong> - вы можете зарегистрироваться
          или авторизироваться для использования основным интерфейсом. Если у
          вас права администратора то вам будет доступен интерфейс для
          управления пользователями, вы сможете удалить их или изменить их
          права. Дополнительно вы можете видеть количество загруженных файлов и
          их общий объём.
        </p>
        <p className="mainParagraph">
          <strong>- Во вкладке "МОИ ФАЙЛЫ"</strong>- вы можете загрузить файл в
          персональное хранилище, удалить файл из хранилища, переименовать файл
          (нажав на его имя), а также поделиться ссылкой по которой любой
          пользователь может скачать файл. На сервере настроен web socket,
          поэтому если ктото воспользуется ссылкой вы сможете увидеть это
          динамически. Администратор видит файлы всех пользователей и может с
          ними взаимодействовать.
        </p>
        <p className="mainParagraph">
          <strong>Для разработки использовались:</strong>
          <ul className="libList">
            <li>Python - для разработки back части приложения </li>
            <li>
              JavaScript\TypeScript - для разработки front части приложения.
            </li>
          </ul>
        </p>
        <p className="mainParagraph">
          <strong>В качестве библиотек и фреймворков:</strong>
          <ul className="libList">
            <li>Django</li>
            <li>React</li>
            <li>psycopg2</li>
            <li>python-dotenv</li>
            <li>djangorestframework</li>
            <li>channels + daphne</li>
          </ul>
        </p>
      </p>
    </article>
  )
}
