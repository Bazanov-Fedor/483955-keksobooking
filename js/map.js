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
    'bungalo'
  ];

  // соответствие типов объектов недвижимости
  var offerType = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
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

  // высота пина на карте
  var PIN_Y = 64;

  // диапазон размещения координат маркеров на карте
  var coordinates = {
    x: {min: 300, max: 900},
    y: {min: 100, max: 500}
  };

  // Создадим массив объявлений и копию массива заголовков
  var offer = [];
  var offerTitles = TITLES.slice();

  // Найдём в DOM-е элементы с которыми будем работать
  var map = document.querySelector('.map');

  // Оъект DOM, содержащий список маркеров
  var pinsContainer = document.querySelector('.map__pins');
  // Шаблон для заполнения состоящий из пина на карте и блока с информацией о объявлении
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
  //  Фрагмент документа, который формируется для вставки в документ
  var fragment = document.createDocumentFragment();

  // ----------  util  ---------- //
  // Получение случайного целого значения, включая min и исключая max
  var getRandomValue = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  // Вычисление смещения пина из-за его размеров
  var pinOffsetX = function (x) {
    return x + 'px';
  };
  var pinOffsetY = function (y) {
    return (y - PIN_Y) + 'px';
  };

  // Создаёт массив со случайным количеством преимуществ
  var makeFeatures = function () {
    var arrAdvantages = FEATURES.slice();
    var lengthArrRandom = getRandomValue(Math.round(arrAdvantages.length / 2), arrAdvantages.length);
    var OfferFeatures = [];

    for (var i = 0; i <= lengthArrRandom; i++) {
      var indexRandom = getRandomValue(0, arrAdvantages.length);
      OfferFeatures[i] = arrAdvantages.splice(indexRandom, 1);
    }

    return OfferFeatures;
  };

  // Создадим строку для вставки преимущества
  var getStringFeatures = function (elem) {
    return '<li class="feature feature--' + elem + '"></li>';
  };

  // Создание массива объектов недвижимости
  var generateAds = function (numberObj) {
    for (var i = 0; i < numberObj; i++) {
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
          features: makeFeatures(),
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

  // Формирование метки для объекта - заполнение данными из массива объектов
  var renderPin = function (pin) {
    var mapPinElement = mapPinTemplate.cloneNode(true);

    mapPinElement.querySelector('img').src = pin.author.avatar;
    mapPinElement.style.left = pinOffsetX(pin.location.x);
    mapPinElement.style.top = pinOffsetY(pin.location.y);

    return mapPinElement;
  };

  // Формирование карточки объекта - заполнение данными из массива объектов
  var renderCard = function (offerObject) {
    var mapElement = mapCardTemplate.cloneNode(true);
    var mapCardP = mapElement.querySelectorAll('p');
    var mapCardList = mapElement.querySelector('.popup__features');

    // заголовок объявления
    mapElement.querySelector('h3').textContent = offerObject.offer.title;
    // цена
    mapElement.querySelector('.popup__price').innerHTML = offerObject.offer.price + '&#x20bd;/ночь';
    // адрес
    mapElement.querySelector('small').textContent = offerObject.offer.address;
    // тип
    mapElement.querySelector('h4').textContent = offerType[offerObject.offer.type];
    // количество гостей
    mapCardP[2].textContent = offerObject.offer.rooms + ' комнаты для ' + offerObject.offer.guests + ' гостей';
    // время заезда и выезда
    mapCardP[3].textContent = 'Заезд после ' + offerObject.offer.checkin + ', выезд до ' + offerObject.offer.checkout;
    // описание
    mapCardP[4].textContent = offerObject.offer.description;
    mapCardList.innerHTML = '';
    mapCardList.insertAdjacentHTML('afterBegin', offerObject.offer.features.map(getStringFeatures).join(' '));
    mapElement.appendChild(mapCardList);

    return mapElement;
  };

  // Создаем и заполняем данными массив объектов недвижимости
  offer = generateAds(NUMBER_PINS);
  // Переносим данные из массива объектов во фрагмент с маркерами для вставки на страницу
  offer.forEach(function (elem) {
    fragment.appendChild(renderPin(elem));
  });

  // Создаем новый пустой фрагмент
  fragment = document.createDocumentFragment();
  // Заполняем фрагмент данными из массива объектов для отрисовки первой карточки недвижимости
  fragment.appendChild(renderCard(offer[0]));
  // Добавляем карточку недвижимости на страницу
  map.appendChild(fragment);

  // --------- module4-task1  --------  //
  // код клавиш для обработчиков
  var keyCode = {
    ESC: 27,
    ENTER: 13
  };

  // найдём элементы с которыми будем работать

  // форма подачи объявления
  var form = document.querySelector('.notice__form');
  // главный пин в центре / пользовательский пин
  var pinUser = map.querySelector('.map__pin--main');
  // состояние пина
  var activPin = false;
  // кнопка закрытия попапа объявления
  var buttonClose = document.querySelector('.popup__close');

  // функция активации работы сайта - удаление скрывающих слассов и добавление маркеров объявлений
  var startJob = function () {
    // удалим класс скрывающий объявления на карте
    map.classList.remove('map--faded');
    // удалим класс скрывающий форму
    form.classList.remove('.notice__form--disabled');
    // Добавляем маркеры на страницу
    pinsContainer.appendChild(fragment);
  };

  pinUser.addEventListener('mouseup', function () {
    startJob();
  });

  // Закрытие попапа
  var closePopup = function () {
    mapCard.classList.add('hidden');
    if (activPin !== false) {
      activPin.classList.remove('map__pin--active');
      activPin = false;
    }
    document.removeEventListener('keydown', onPopupEscPress);
  };

  // Реализуем закрытие описания объявления с помощью мыши и клавиатуры
  // закрытие карточки описания по клику
  buttonClose.addEventListener('click', function () {
    closePopup();
  });
  // закрытие карточки описания с клавиатуры
  buttonClose.addEventListener('keydown', function (evt) {
    if (evt.keyCode === keyCode.ENTER) {
      closePopup();
    }
  });
})();
