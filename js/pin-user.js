'use strict';

(function () {
  // Маркер в центре карты
  var pinUser = document.querySelector('.map__pin--main');
  // Контейнер, скрывающий карту
  var pinsoverlay = document.querySelector('.map__pinsoverlay');

  var BorderY = {
    MIN: 100,
    MAX: 500
  };
  // Высота главного маркера
  var HEIGHT_MAIN_PIN = 65;
  // Высота хвостика главного маркера
  var HEIGHT_MAIN_TAIL = 22;

  //  ---------- обработчики событий на пине пользователя  ----------  //
  // Перетаскиваем центральный маркер
  var onPinUserMousedown = function (evt) {
    evt.preventDefault();
    // Начальные координаты
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    // Отслеживаем перемещение мыши
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

      pinUser.style.left = (pinUser.offsetLeft - shift.x) + 'px';
      if ((pinUser.offsetTop - shift.y) >= (BorderY.MIN - (HEIGHT_MAIN_PIN / 2 + HEIGHT_MAIN_TAIL)) && (pinUser.offsetTop - shift.y) <= (BorderY.MAX - (HEIGHT_MAIN_PIN / 2 + HEIGHT_MAIN_TAIL))) {
        pinUser.style.top = (pinUser.offsetTop - shift.y) + 'px';
      }
    };

    // Убираем слежение за событиями при отпускании мыши
    // и записываем координаты маркера в поле адреса формы
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      window.form.setAddressHousing();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    // Обработаем события движения и отпускания мыши
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // Перетаскиваем главный маркер
  pinUser.addEventListener('mousedown', onPinUserMousedown);

  // Экспортируем строку с координатами для ввода адреса в форму
  window.pinUser = {
    pinGlobal: pinUser,
    // Функция для определения координат острого кончика маркера
    getCoords: function () {
      var box = pinUser.getBoundingClientRect();
      var boxOverlay = pinsoverlay.getBoundingClientRect();
      return Math.round((box.left - boxOverlay.left + box.width / 2)) + ', ' + Math.round((box.bottom + pageYOffset + HEIGHT_MAIN_TAIL));
    }
  };
})();
