'use strict';

(function () {
  // тип помещения в объявлении
  var TYPES = [
    'flat',
    'house',
    'bungalo',
    'palace'
  ];

  var offerType = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало',
    palace: 'Дворец'
  };

  // соответствие типа жилого объекта с его минимальной ценой
  var offerTypePrice = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  // время регистрации и выезда в объявлении
  var CHECKS = ['12:00', '13:00', '14:00'];

  window.data = {
    arrOfferTypes: TYPES.slice(),
    arrTypes: TYPES.map(function (elem) {
      return offerType[elem];
    }),
    arrPrices: TYPES.map(function (elem) {
      return offerTypePrice[elem];
    }),
    arrOfferChecks: CHECKS.slice(),
  };
}());
