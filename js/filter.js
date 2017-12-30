'use strict';

(function () {
  // на карте отображается не более пяти пинов других объявлений
  var PINS_ORDERS = 5;

  // Найдём элементы с которыми будем работать над фильтрацией объявлений
  // блок с выбором фильтров
  var blockFilter = document.querySelector('.map__filters');
  // фильтр типа помещения
  var filterType = blockFilter.querySelector('#housing-type');
  // фильтр цены
  var filterPrice = blockFilter.querySelector('#housing-price');
  // фильтр числа комнат
  var filterRooms = blockFilter.querySelector('#housing-rooms');
  // фильтр числа возможных гостей
  var filterGuests = blockFilter.querySelector('#housing-guests');
  // фильтр приемуществ
  var filterFeatures = blockFilter.querySelector('#housing-features');
}());
