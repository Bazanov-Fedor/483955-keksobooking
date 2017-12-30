'use strict';
(function () {

  // Часть шаблона, пин на карте
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  // Вычисление смещения пина из-за его размеров
  // по вертикали
  var pinOffsetX = function (x) {
    return x + 'px';
  };

  var pinOffsetY = function (y) {
    return (y - window.PIN_Y) + 'px';
  };

  // Добавляем функцию создания маркера в глобальную область видимости
  window.pin = {
    renderPin: function (pin, i) {
      var mapPinElement = mapPinTemplate.cloneNode(true);

      mapPinElement.querySelector('img').src = pin.author.avatar;
      mapPinElement.style.left = pinOffsetX(pin.location.x);
      mapPinElement.style.top = pinOffsetY(pin.location.y);
      mapPinElement.dataset.numPin = i;
      this.appendChild(mapPinElement);

      return this;
    }
  };
})();
