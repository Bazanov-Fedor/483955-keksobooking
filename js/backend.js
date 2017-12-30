'use strict';
(function () {

  // Создадим элемент в котором будет возникать ошибка
  var cloud = document.createElement('div');

  // Функция создания запроса к серверу
  var makeRequest = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    // Событие окончания загрузки
    xhr.addEventListener('load', function () {
      return xhr.status === window.CODE_SUCSESS ? onSuccess(xhr.response) : onError(xhr.response);
    });

    // Обработка ошибки во время загрузки
    xhr.addEventListener('error', function () {
      onError(window.MESSAGES.ERROR_NET);
    });

    // Обработка слишком долгого ожидания загрузки
    xhr.addEventListener('timeout', function () {
      onError(window.MESSAGES.ERROR_TIME + xhr.timeout + 'мс');
    });
    xhr.timeout = window.TIME_OUT;
    return xhr;
  };

  // Функции обмена данными с сервером, экспортируемые из модуля
  window.backend = {
    load: function (onSuccess, onErrorLoad) {
      var xhr = makeRequest(onSuccess, onErrorLoad);
      xhr.open('GET', window.URL + '/data');
      xhr.send();
    },

    save: function (data, onSuccess, onErrorSave) {
      var xhr = makeRequest(onSuccess, onErrorSave);
      xhr.open('POST', window.URL);
      xhr.send(data);
    },

    // Функция создания элемента с сообщением об ошибке
    makeMessageError: function () {
      cloud.style.zIndex = '50';
      cloud.style.margin = '10px auto';
      cloud.style.textAlign = 'center';
      cloud.style.backgroundColor = 'magenta';
      cloud.style.border = '2px solid black';
      cloud.style.position = 'absolute';
      cloud.style.left = 0;
      cloud.style.right = 0;
      cloud.style.fontSize = '30px';
      cloud.textContent = '';
      document.body.insertAdjacentElement('afterbegin', cloud);
      cloud.classList.add('hidden');
    },

    // Ошибка загрузки данных - выводим сообщение для пользователя
    onErrorLoad: function (errorMessage) {
      cloud.textContent = errorMessage;
      cloud.classList.remove('hidden');
      cloud.style.top = '0px';
    },

    // Ошибка отправки данных - выводим сообщение для пользователя
    onErrorSave: function (errorMessage) {
      cloud.textContent = errorMessage;
      cloud.classList.remove('hidden');
      cloud.style.top = '1450px';
    },

    // Убираем ошибку
    removeError: function () {
      cloud.textContent = '';
      cloud.classList.add('hidden');
    }
  };
})();
