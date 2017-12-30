'use strict';

(function () {

  // Главная часть страницы документа
  var map = document.querySelector('.map');
  // Контейнер со списком марекров
  var pinsContainer = map.querySelector('.map__pins');
  //  Фрагмент документа с маркерами для вставки в документ
  var fragmentPin = document.createDocumentFragment();


  // начало работы страницы(отрисовка объявлений и ативация формы) по клику на центральный пин
  var onPinMouseUp = function () {
    // Удалим класс скрывающий объявления на карте
    map.classList.remove('map--faded');
    // Добавляем маркеры на страницу
    pinsContainer.appendChild(fragmentPin);
    // Активируем форму
    window.form.activateForm();
  };

  // Клик по маркеру
  var onPinClick = function (evt) {
    window.card.renderAndOpen(evt.target, pinsContainer);
  };

  //  -------- Работа с сервером  ----------  //
  // Данные успешно загружены
  var onSuccessLoad = function (data) {
    window.filters.transferData(data);
    window.backend.removeError();
    window.filters.filteredData.forEach(window.pin.renderPin, fragmentPin);
    // Делаем страницу доступной для работы пользователя
    window.pinUser.pinGlobal.addEventListener('mouseup', onPinMouseUp);
  };

  // Инициализация формы
  window.form.init();
  // Создаем и скрываем окно для информирования пользователя о возможных ошибках
  window.backend.createMessageError();
  // Загружаем данные с сервера
  window.backend.load(onSuccessLoad, window.backend.onErrorLoad);
  // Добавляем карточку недвижимости на страницу и скрываем ее
  map.appendChild(window.card.renderAndOpen(window.pinUser.pinGlobal, pinsContainer));
  // Клик на маркер ловим на контейнере
  pinsContainer.addEventListener('click', onPinClick);

  window.map = {
    // Функция добавления маркеров на страницу
    appendPins: function () {
      // Очищаем контейнер с маркерами от предыдущего результата
      var childs = pinsContainer.querySelectorAll('.map__pin');
      [].forEach.call(childs, function (element) {
        if (!element.classList.contains('map__pin--main')) {
          pinsContainer.removeChild(element);
        }
      });
      // Заполняем фрагмент в соответствии с отфильтрованным массивом
      window.filters.filteredData.forEach(window.pin.renderPin, fragmentPin);
      // Добавляем фрагмент на страницу
      pinsContainer.appendChild(fragmentPin);
    }
  };
})();
