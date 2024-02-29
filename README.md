# Моё облако.

Это учебный проект - **"My Cloud"**, разработанный в целях получения практических навыков на основе полученных знаний. "My Cloud" - это персональное файловое хранилище для загрузки, хранения и передачи файлов.

## Инструкция по пользованию:

- **ПРОФИЛЬ:** В этой вкладке вы можете:
  - Зарегистрироваться или авторизироваться для использования основным интерфейсом.
  - Если у вас есть права администратора, вам будет доступен интерфейс для управления пользователями. Вы сможете удалить их или изменить их права.

- **МОИ ФАЙЛЫ:** В этой вкладке вы можете:
  - Загрузить файл в персональное хранилище.
  - Удалить файл из хранилища.
  - Переименовать файл (нажав на его имя).
  - Поделиться ссылкой, по которой любой пользователь может скачать файл.
  - На сервере настроен web socket, поэтому если кто-то воспользуется ссылкой, вы сможете увидеть это динамически.
  - Администратор видит файлы всех пользователей и может с ними взаимодействовать.
  - Дополнительно вы можете видеть количество загруженных файлов и их общий объём.

## Для разработки использовались:

- **Python:** Для разработки back части приложения.
- **JavaScript/TypeScript:** Для разработки front части приложения.

## В качестве библиотек и фреймворков были использованы:

- **Django**
- **React**
- **psycopg2**
- **python-dotenv**
- **djangorestframework**
- **channels**
- **daphne**

Установка на сервер
 1. Убедитесь что у вас уставновлены свежие пакеты приложений:
 - sudo apt update
 - sudo atp upgrade
   
 2. Установите и подготовьте базу данных для работы, подразумевается PostgreSQL:
 - sudo apt install postgresql
 - sudo service postgresql start
 - sudo -u postgres psql
 - CREATE USER user WITH PASSWORD 'user' (создадим пользователя для подключения)
 - createdb -h your_host -p your_port -U your_username -E UTF8 your_database_name (создадим БД)

 3. Скачайте проект на сервер и перейдите в папку проекта:
 - git clone https://github.com/KeplerXIII/my_cloud.git

 5. Для удобства в корне проекта лежит файл .env.example, заполните его данными, в том числе
   для подключения к созданной вами БД.

 6. В качестве менеджера пакетов используется poetry, поэтому необходимо его установть:
 - sudo apt install python3
 - sudo apt install python3-pip
 - pip install poetry

 7. Серверная часть проекта находится в папк my_cloud_back, перейдите в неё установите зависимости
    и активируйте виртуальное окружение:
 -  poetry install
 -  poetry shell

 8. Настройка NGINX стандартная, за исключением использования проксирования запросов на WebSocket соединения,
    Оно используется в проекте для уведомления пользователей о том, что одноразовая ссылка была исопльзована.
 - nano /etc/nginx/sites-available/my_cloud (создаст файл настройки)
    server {
       location /static/ {
        root /home/root/my_cloud/my_cloud_back; - путь до статики
      }
      location / {
        proxy_pass http://your_asgi_server; - здесь укажите ваш ASGI сервер с портом, который мы запустим позже
      }
      location /ws/ {
        proxy_pass http://your_asgi_server; - здесь укажите ваш ASGI сервер с портом, который мы запустим позже
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
      }
    }
 - sudo ln -s /etc/nginx/sites-available/your_project /etc/nginx/sites-enabled/ (создать ссылку на конфиг для его работы)
 - sudo systemctl start nginx (или sudo systemctl restart nginx если был запущен до этого)
   
 9. Для сбора статики используем стандартную функцию Django из папки my_cloud_back:
 - python manage.py collectstatic

 10. Для органзации работы сервера мы спользуем Daphne в качстве ASGI и NGINX в качестве WEB-сервера.
    Проверьте установлены ли они, если нет установите. Проект уже настроен для работы по ASGI и вы
    можете запустить его из папки my_cloud_back при помощи команды:
 - daphne -b 127.0.0.1 -p 8000 my_clud.asgi:application (адрес и порт указывайте тот который укажем в настройках к NGINX)


Опционально: Так как пользовательская часть написана с исопльзованием React она собирается с помощью бандлера Vite
и в пользовательской части есть необходимость настройки WebSocket соединения для его корректной работы требуется
пересобрать проект. Для этого понадобится yarn, тк он был использован как менеджер и обновить node.

- curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
- echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
- sudo apt-get update && sudo apt-get install yarn

- curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
- nvm install node

После чего вы сможете изменить настройки в файле my_cloud_front/.env.example и использовать его переименовав.
Установить зависимости:
- yarn install
Пересобрать:
- yarn run build
Главное не забыть после этого пересобрать django проект из папки my_cloud_back:
- python manage.py collectstatic

Теперь ваш проект настроен на работу по Web Socket.
Спасибо что у Вас получилось!














