'use strict';

window.pin = (function () {
  // высота пина на карте
  var PIN_Y = 64;
  // часть шаблона - пин
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  // Вычисление смещения пина из-за его размеров
  var pinOffsetX = function (x) {
    return x + 'px';
  };
  var pinOffsetY = function (y) {
    return (y - PIN_Y) + 'px';
  };

  // Формирование метки для объекта - заполнение данными из массива объектов
  return {
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
}());
