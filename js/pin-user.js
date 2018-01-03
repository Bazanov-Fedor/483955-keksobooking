'use strict';

(function () {
  // Маркер в центре карты
  var pinUser = document.querySelector('.map__pin--main');
  // Контейнер, скрывающий карту
  var pinsoverlay = document.querySelector('.map__pinsoverlay');

  // Ограничение перемещения пользователського пина по карте
  // Граница по вертикали
  var BORDER_Y = {
    MIN: 100,
    MAX: 500
  };

  // Граница по горизонтали с учётом ширины самого пина
  var BORDER_X = {
    LEFT_LIMIT: 65,
    RIGHT_LIMIT: pinsoverlay.offsetWidth - 65
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

      var LEFT = pinUser.offsetLeft - shift.x;
      var TOP = pinUser.offsetTop - shift.y;

      // высота пина с учётом translate и высоты острия пина
      var HEIGHT_PIN = (HEIGHT_MAIN_PIN / 2 + HEIGHT_MAIN_TAIL);

      pinUser.style.left = LEFT + 'px';
      if (TOP >= (BORDER_Y.MIN - HEIGHT_PIN) && TOP <= (BORDER_Y.MAX - HEIGHT_PIN)) {
        pinUser.style.top = TOP + 'px';
      }

      if (LEFT < BORDER_X.LEFT_LIMIT) {
        pinUser.style.left = BORDER_X.LEFT_LIMIT + 'px';
      }

      if (LEFT > BORDER_X.RIGHT_LIMIT) {
        pinUser.style.left = BORDER_X.RIGHT_LIMIT + 'px';
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
      var x = Math.round((box.left - boxOverlay.left + box.width / 2));
      var y = Math.round((box.bottom + pageYOffset + HEIGHT_MAIN_TAIL));
      return 'x: ' + x + ' y: ' + y;
    }
  };
})();
