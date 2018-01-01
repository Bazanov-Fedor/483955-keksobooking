'use strict';

(function () {
  // высота пина на карте
  window.PIN_Y = 46;
  // Характеристики пина - его высота и высота его 'острия'
  window.USER_PIN_HEIGHT = 65;
  window.ARROW_PIN_HEIGHT = 22;
  // Размещение пина ограниченно координатами по вертикалии
  window.PIN_BORDER = {
    MIN: 100,
    MAX: 500
  };
  // код клавиш для обработчиков
  window.KEY_CODE = {
    ESC: 27,
    ENTER: 13
  };
  // время ожидания ответа от сервера
  window.TIME_OUT = 10000;
  // код при успешном соединении с сервером
  window.CODE_SUCSESS = 200;
  // Сообщения об ошибках
  window.MESSAGES = {
    ERROR_NET: 'Произошла ошибка соединения',
    ERROR_TIME: 'Запрос не успел выполниться за '
  };
  // путь на сервер
  window.URL = 'https://1510.dump.academy/keksobooking';
  // на карте отображается не более пяти пинов других объявлений
  window.PIN_ORDERS = 5;
  window.FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
})();
