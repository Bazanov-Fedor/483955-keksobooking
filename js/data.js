'use strict';

(function () {
  // количество других предложений на карте
  var NUMBER_PINS = 8;

  // Заголовки объявлений по соседству
  var TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];

  // тип помещения в объявлении
  var TYPES = [
    'flat',
    'house',
    'bungalo',
    'palace'
  ];

  // соответствие типов объектов недвижимости
  var offerType = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало',
    palace: 'Дворец'
  };

  // время регистрации и выезда в объявлении
  var CHECKS = ['12:00', '13:00', '14:00'];

  // преимущества определённого объявления
  var FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];

  // количество комнат
  var ROOMS = {
    min: 1,
    max: 5
  };

  // количество гостей
  var GUESTS = {
    min: 1,
    max: 10
  };

  // диапазон цен на объекты недвижимости
  var PRISE = {
    min: 1000,
    max: 1000000
  };

  // диапазон размещения координат маркеров на карте
  var coordinates = {
    x: {min: 300, max: 900},
    y: {min: 100, max: 500}
  };

  // Создадим массив объявлений и копию массива заголовков
  var offer = [];
  var offerTitles = TITLES.slice();

  // Получение случайного целого значения, включая min и исключая max
  var getRandomValue = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  // Создаёт массив со случайным количеством преимуществ
  var getRandomFeatures = function () {
    var arrAdvantages = FEATURES.slice();
    var lengthArrRandom = getRandomValue(Math.round(arrAdvantages.length / 2), arrAdvantages.length);
    var OfferFeatures = [];

    for (var i = 0; i <= lengthArrRandom; i++) {
      var indexRandom = getRandomValue(0, arrAdvantages.length);
      OfferFeatures[i] = arrAdvantages.splice(indexRandom, 1);
    }

    return OfferFeatures;
  };


  // Создание массива объектов недвижимости
  var generateAds = function () {
    for (var i = 0; i < NUMBER_PINS; i++) {
      // измение адрес изображения
      var avatarPrefix = (i + 1);
      // создание координат в заданных диапозонах
      var locationX = getRandomValue(coordinates.x.min, coordinates.x.max);
      var locationY = getRandomValue(coordinates.y.min, coordinates.y.max);

      offer[i] = {
        author: {
          avatar: 'img/avatars/user0' + avatarPrefix + '.png',
        },

        offer: {
          title: offerTitles.splice(getRandomValue(0, offerTitles.length), 1),
          address: locationX + ', ' + locationY,
          price: getRandomValue(PRISE.min, PRISE.max),
          type: TYPES[getRandomValue(0, TYPES.length)],
          rooms: getRandomValue(ROOMS.min, ROOMS.max),
          guests: getRandomValue(GUESTS.min, GUESTS.max),
          checkin: CHECKS[getRandomValue(0, CHECKS.length)],
          checkout: CHECKS[getRandomValue(0, CHECKS.length)],
          features: getRandomFeatures(),
          description: '',
          photos: []
        },

        location: {
          x: locationX,
          y: locationY
        }
      };
    }

    return offer;
  };

  window.data = {
    generateAds: generateAds,
    offerType: offerType
  };
}());
