'use strict';

(function () {

  // Массив объектов недвижимости
  var offer = [];
  // контейнер со списком марекров
  var pinsContainer = document.querySelector('.map__pins');
  // Фрагмент документа, который формируется для вставки в документ
  var fragmentPin = document.createDocumentFragment();

  //  ----------- Обработчики событий на сайте  -----------  //
  // начало работы страницы(отрисовка объявлений и ативация формы) по клику на центральный пин
  var onPinMouseUp = function () {
    // удалим класс скрывающий объявления на карте
    window.map.classList.remove('map--faded');
    // Добавляем маркеры на страницу
    pinsContainer.appendChild(fragmentPin);
    // удалим класс скрывающий форму
    window.form.classList.remove('notice__form--disabled');
  };

  // Клик по маркеру
  var onPinClick = function (evt) {
    window.showCard.renderAndOpen(evt.target, offer, pinsContainer);
  };

  // Обработчики на элементах
  // Делаем страницу доступной для работы пользователя
  window.pinUser.addEventListener('mouseup', onPinMouseUp);
  // Клик на маркер ловим на контейнере
  pinsContainer.addEventListener('click', onPinClick);

  // Данные успешно загружены
  var successHandler = function (arrData) {
    arrData.forEach(window.pin.renderPin, fragmentPin);
    offer = arrData.slice();
    // Делаем страницу доступной для работы пользователя
    window.pinUser.addEventListener('mouseup', onPinMouseUp);
  };

  // Создаем и скрываем окно для информирования пользователя о возможных ошибках
  window.backend.makeMessageError();
  // Загружаем данные с сервера
  window.backend.load(successHandler, window.backend.errorHandler);
  // Добавляем карточку недвижимости на страницу и скрываем ее
  window.map.appendChild(window.showCard.renderAndOpen(window.pinUser, offer[0], pinsContainer));

  // Реализуем перемещение пользовательского пина на карте и запись координат в форму подачи объявления
  // Характеристики пина - его высота и высота его 'острия'
  var USER_PIN_HEIGHT = 65;
  var ARROW_PIN_HEIGHT = 22;

  // Размещение пина ограниченно координатами по вертикалии
  var pinBorder = {
    min: 100,
    max: 500
  };

  // Найдём блок в котором размещаются пины на карте
  var pinsoverlay = document.querySelector('.map__pinsoverlay');

  var getCoords = function (elem, container) {
    var box = elem.getBoundingClientRect();
    var boxOverlay = container.getBoundingClientRect();
    return 'x: ' + Math.round((box.left - boxOverlay.left + box.width / 2)) + ' y: ' + Math.round((box.bottom + pageYOffset + ARROW_PIN_HEIGHT));
  };


  // Реализация перетаскивания пользовательского пина
  var onPinuserMousedown = function (evt) {
    evt.preventDefault();
    // Начальные координаты
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    // Отслеживаем перемещение мыши на карте
    document.addEventListener('moveEvt', onMouseMove);
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      // смещение
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      window.pinUser.style.left = (window.pinUser.offsetLeft - shift.x) + 'px';
      if ((window.pinUser.offsetTop - shift.y) >= (pinBorder.min - (USER_PIN_HEIGHT / 2 + ARROW_PIN_HEIGHT)) && (window.pinUser.offsetTop - shift.y) <= (pinBorder.max - (USER_PIN_HEIGHT / 2 + ARROW_PIN_HEIGHT))) {
        window.pinUser.style.top = (window.pinUser.offsetTop - shift.y) + 'px';
      }
    };

    // удаляем обработчики и заполняем координаты пользователського пина в форму
    var onMouseUp = function (event) {
      event.preventDefault();

      window.userAdres.value = getCoords(window.pinUser, pinsoverlay);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    // Обработаем события движения и отпускания мыши
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // Перемещение пина на карте
  window.pinUser.addEventListener('mousedown', onPinuserMousedown);
  getCoords(window.pinUser, pinsoverlay);
})();
