'use strict';

(function () {

  var TITLE = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало поколено в воде'
  ];

  var PRICE = {
    max: 1000,
    min: 1000000
  };

  var TYPE = [
    'flat',
    'house',
    'bungalo'];

  var ROOMS = {
    min: 1,
    max: 5
  };

  var CHECKIN = ['12:00', '13:00', '14:00'];
  var CHECKOUT = ['12:00', '13:00', '14:00'];
  var FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];

  var guests = {
    min: 1,
    max: 8
  };

  var LOCATIONS = {
    X_MIN: 300,
    Y_MIN: 100,
    X_MAX: 900,
    Y_MAX: 500
  };

  // найдём DOM элементы необходимые для задания
  var map = document.querySelector('.map');
  var mapPin = map.querySelector('.map__pins');
  var mapFilters = document.querySelector('.map__filters-container');
  // шаблон для копирования и элементы которые копируем
  var template = document.querySelector('template').content;
  var templateMapPin = template.querySelector('.map__pin');
  var templateMapCard = template.querySelector('.map__card');

  // функции-утилиты
  // Получение случайного элемента из массива
  var getRandomValue = function (array) {
    return array[Math.floor(Math.random() * array.length)];
  };

  // нахождение рандомного числа в пределах от min до max
  var randomNumber = function (min, max) {
    return Math.random() * (max - min) + min;
  };
})();
