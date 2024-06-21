<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest
## Функционал Web API

1. Получение списка всех митапов;
2. Получение определённого митапа по его Id;
3. Регистрация нового митапа;
4. Изменение информации о существующем митапе;
5. Удаление митапа.

## Информация о митапе

1. Название / тема;
2. Описание;
3. Набор тегов / ключевых слов;
4. Время и место проведения.

## Стек

1. Node.js;
2. Express;
3. PostgreSQL 14.

## Дополнительный функционал

1. Валидация DTO (достаточно будет использовать joi).
2. Переработать запрос на получение списка митапов так, чтобы с его помощью можно было осуществить поиск по митапам, отфильтровать их, отсортировать. Результат также должен быть разбит на страницы.
3. Добавить документацию к API через Swagger.
4. Система аутентификации (предлагается к использованию библиотека PassportJS). Систему аутентификации можно разрабатывать поэтапно, постепенно расширяя и усложняя её:
   - Пользователь регистрируется, авторизуется (получая JWT Access Token). Используя Access Token можно получить информацию о владельце токена (т.е. получить текущего пользователя по токену) и записаться на митап.
   - Добавить персистентный JWT Refresh Token.
   - Разделить авторизованных пользователей на 2 типа: обычные пользователи (описаны в пунке 3.a) и организаторы митапов (только они могут регистрировать новые митапы, редактировать/удалять зарегистрированные ими митапы)

## Примечания

1. Очень часто допускаются следующие проблемы:
   - Качество кода (в том числе нейминг и форматирования) оставляют желать лучшего;
   - Некорректно ведётся работа с Git (указан не тот email пользователя, весь код залит 1м коммитом, закоммичены не те файлы);
   - DTO не используются вообще, или используются некорректно
   - Нарушается REST принцип, или общие правила использования HTTP методов, статус кодов и, особенно, правила формирования URL
2. Не стоит разрабатывать большое и сложное решение. Начните с простого – напишите весь код в сразу контроллерах, приведите его в порядок. Если после этого у вас останется время и желание для усовершенствования задания, обратите внимание на возможные направления расширения (описаны далее). Приступайте к решению архитектурно-организационных вопросов только если вы полностью реализовали все перечисленные расширения.
3. Внимательно читайте описание задания – задание состоит в том, чтобы реализовать REST Web API, а не полноценное Full Stack Web приложение (не нужно добавлять веб-интерфейс).
  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
