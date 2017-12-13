'use strict';

(function () {
  // количество меток других заказов на карте
  var NUMBER_ORDERS = 8;

  // заголовки объявлений
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

  // диапазон цен
  var PRICE = {
    min: 1000,
    max: 1000000
  };

  // тип жилого помещения
  var HOUSE_TYPES = ['flat', 'house', 'bungalo'];

  var offerType = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  // количество комнат
  var ROOMS = {
    min: 1,
    max: 5
  };

  // время заезда и выезда
  var CHECKIN = ['12:00', '13:00', '14:00'];
  var CHECKOUT = ['12:00', '13:00', '14:00'];

  // преимущества в конкретном месте
  var FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];

  // количество гостей
  var guests = {
    min: 1,
    max: 8
  };

  // диапазон координат расположения пина заказа на карте
  var COORDINATES = {
    x: {
      min: 300,
      max: 900
    },
    y: {
      min: 100,
      max: 500
    }
  };

  // создадим массив объявлений
  var offerAds = [];
  // создадим копию исходного массива заголовков объявлений
  var offerTitles = TITLE.slice();

  // найдём элементы в DOM с которыми будем работать
  // блок с картой, уберём у него скрывающий класс
  var map = document.querySelector('.map');

  map.classList.remove('map--faded');


  // "блок" с элементами которые будем заполнять
  var orderBlock = document.querySelector('.map__pins');
  // карточка заказка(описание) в блоке
  var orderDescription = document.querySelector('template').content.querySelector('.map__card');
  // пин заказа(маркер)
  var orderPin = document.querySelector('template').content.querySelector('.map__pin');
  // созадние фрагмента, который будем вставлять вдокумент
  var fragment = document.createDocumentFragment();


  //  ----------  функции-утилиты  ----------  //
  // нахождение рандомного числа в пределах от min до max
  var getRandomNumber = function (min, max) {
    return Math.random() * (max - min) + min;
  };
  //  ----------  функции-утилиты  ----------  //

  // найдём смещение координта расположения пина из-за его размеров
  var pinHeight = 62;
  var pinOffsetX = function (x) {
    return x + 'px';
  };
  var pinOffsetY = function (y) {
    return (y - pinHeight) + 'px';
  };

  // создадим массив со случайными удобствами для других объйявлений поблизости
  var makeRandomFeatures = function () {
    // скопируем массив удобств для заполнения
    var featuresList = FEATURES.slice();
    var arrFeatures = getRandomNumber(Math.round(featuresList.length / 2), featuresList.length);
    var offerFeatures = [];

    for (var i = 0; i <= arrFeatures; i++) {
      var indexFetures = getRandomNumber(0, featuresList.length);

      offerFeatures[i] = offerFeatures.slice(indexFetures, 1);
    }

    return offerFeatures;
  };

  // проработаем строку для преимущества
  var getString = function (elem) {
    return '<li class="feature feature--' + elem + '"></li>';
  };

  // создадим массив с сгенерированными характеристиками
  var generateOffer = function () {
    for (var i = 0; i <= NUMBER_ORDERS - 1; i++) {
      // создаём координаты в заданных промежутках
      var locX = getRandomNumber(COORDINATES.x.min, COORDINATES.x.max);
      var locY = getRandomNumber(COORDINATES.y.min, COORDINATES.y.max);

      offerAds[i] = {
        author: {
          avatar: 'img/avatars/user0' + +i + '.png',
        },

        offer: {
          title: offerTitles.splice(getRandomNumber(0, offerTitles.length), 1),
          address: locX + ', ' + locY,
          price: getRandomNumber(PRICE.min, PRICE.max),
          type: HOUSE_TYPES[getRandomNumber(0, HOUSE_TYPES.length)],
          rooms: getRandomNumber(ROOMS.min, ROOMS.max),
          guests: getRandomNumber(guests.min, guests.max),
          checkin: CHECKIN[getRandomNumber(0, CHECKIN.length)],
          checkout: CHECKOUT[getRandomNumber(0, CHECKIN.length)],
          features: makeRandomFeatures(),
          descroptopn: '',
          photos: []
        },

        location: {
          x: locX,
          y: locY
        }
      };
    }
    return offerAds;
  };

  // создание пина с координатами
  var renderPin = function (offerAd) {
    var orderElement = orderPin.cloneNode(true);

    orderElement.querySelector('img').scr = offerAd.author.avatar;
    orderElement.style.left = pinOffsetX(offerAd.location.x);
    orderElement.style.top = pinOffsetY(offerAd.location.y);

    return orderElement;
  };

  var renderCard = function (offerAd) {
    var cardElement = orderDescription.cloneNode(true);
    var cardP = cardElement.querySelector('p');
    var cardList = cardElement.querySelector('.popup__features');

    cardElement.querySelector('h3').textContent = offerAd.offer.title;
    cardElement.querySelector('.popup__price').innerHTML = offerAd.offer.price + '&#x20bd;/ночь';
    cardElement.querySelector('small').textContent = offerAd.offer.address;
    cardElement.querySelector('h4').textContent = offerType[offerAd.offer.type];

    cardP[2].textContent = offerAd.offer.rooms + ' комнат для ' + offerAd.offer.guests + ' гостей';
    cardP[3].textContent = 'Заезд после ' + offerAd.offer.checkin + ', выезд до ' + offerAd.offer.checkout;
    cardP[4].textContent = offerAd.offer.descroptopn;

    cardList.innerHTML = '';
    cardList.insertAdjacentHTML('afterBegin', offerAd.offer.features.map(getString).join(' '));

    cardElement.appendChild(cardList);

    return cardElement;
  };

  offerAds = generateOffer(NUMBER_ORDERS);

  offerAds.forEach(function (elem) {
    fragment.appendChild(renderPin(elem));
  });

  orderBlock.appendChild(fragment);

  fragment = document.createDocumentFragment();

  fragment.appendChild(renderCard(offerAds[0]));
  debugger
  map.appendChild(fragment);
})();
