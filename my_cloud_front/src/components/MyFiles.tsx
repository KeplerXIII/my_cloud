import FileUpload from "./FileUpload"

export const MyFiles = () => {
  return (
    <article className="article">
      <h1 className="article__title">Загрузка файлов</h1>
      <FileUpload/>
      <h1 className="article__title">Ваши файлы</h1>
    </article>
  )
}
