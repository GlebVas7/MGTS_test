// eslint-disable-next-line no-undef
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['PROF'] // Разрешенные типы коммитов
    ],
    'type-case': [2, 'always', 'upper-case'], // Тип коммита должен быть в верхнем регистре
    'type-empty': [0], // Тип коммита может быть пустым
    'scope-empty': [0], // Область коммита может быть пустой
    'subject-empty': [0], // Сообщение коммита может быть пустым
    'subject-full-stop': [2, 'never', '.'], // Сообщение коммита не должно заканчиваться точкой
    'subject-case': [0], // Регистр сообщения коммита не важен
    'header-max-length': [2, 'always', 100] // Максимальная длина заголовка коммита
  }
};