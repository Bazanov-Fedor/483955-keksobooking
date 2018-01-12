'use strict';

(function () {
  // соответствие типов жилья в объявлении
  var OFFER_TYPE = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало',
    palace: 'Дворец'
  };

  // стили для фотографий других объявлений
  var PICTURE = {
    WIDTH: 50,
    HEIGHT: 50
  };

  // промежуток из которого берём необходимые елементы для метода slice
  var ELEMENTS = {
    BEGIN: 0,
    END: 6
  };

  // Часть шаблона - карточка объекта недвижимости
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var mapCard = mapCardTemplate.cloneNode(true);
  // кнопка закрытия карточки объявления
  var buttonClose = mapCard.querySelector('.popup__close');
  // состояние маркера
  var activPin = false;

  // cоздание списка преимуществ объявлений
  var getListFeatures = function (features) {
    var list = document.createDocumentFragment();

    features.forEach(function (feature) {
      var item = document.createElement('li');
      item.classList.add('feature', 'feature--' + feature);
      list.appendChild(item);
    });

    return list;
  };

  // cоздание списка фотографий объявления
  var getListPhotos = function (photos) {
    var photoList = document.createDocumentFragment();

    photos.slice(ELEMENTS.BEGIN, ELEMENTS.END).forEach(function (photo) {
      var item = document.createElement('li');
      var picture = document.createElement('img');
      picture.width = PICTURE.WIDTH;
      picture.height = PICTURE.HEIGHT;
      picture.src = photo;
      item.appendChild(picture);
      photoList.appendChild(item);
    });

    return photoList;
  };

  // очистка списка перед повторным открытием карты объявления
  var cleanseList = function (element) {
    while (element.hasChildNodes()) {
      element.removeChild(element.lastChild);
    }
  };

  // Улучшим текс объявления в карточкаx других пользователей
  // текст количества комнат
  var makeCorrectTextRooms = function (offerObject) {
    var text = '';

    if (offerObject.offer.rooms % 5 !== 0 && offerObject.offer.rooms !== 0) {
      text = (offerObject.offer.rooms === 1) ? ' комната для ' : ' комнаты для ';
    }

    return text;
  };

  // текст количества гостей
  var makeCorrectTextGuests = function (offerObject) {
    var textConditionFirst = offerObject.offer.guests % 10 === 1;
    var textConditionSecond = offerObject.offer.guests !== 11;
    var text = (textConditionFirst && textConditionSecond) === true ? ' гостя' : ' гостей';

    return text;
  };

  // Формирование карточки объявления - заполнение данными из массива объектов
  var render = function (offerObject) {
    var mapCardP = mapCard.querySelectorAll('p');
    var mapCardList = mapCard.querySelector('.popup__features');
    var mapCardPictures = mapCard.querySelector('.popup__pictures');
    var featuresList = getListFeatures(offerObject.offer.features);
    var photosList = getListPhotos(offerObject.offer.photos);

    cleanseList(mapCardList);
    cleanseList(mapCardPictures);

    mapCard.querySelector('img').src = offerObject.author.avatar;
    mapCard.querySelector('h3').textContent = offerObject.offer.title;
    mapCard.querySelector('.popup__price').innerHTML = offerObject.offer.price + ' &#x20bd;/ночь';
    mapCard.querySelector('small').textContent = offerObject.offer.address;
    mapCard.querySelector('h4').textContent = OFFER_TYPE[offerObject.offer.type];
    mapCardP[2].textContent = offerObject.offer.rooms + makeCorrectTextRooms(offerObject) + offerObject.offer.guests + makeCorrectTextGuests(offerObject);
    mapCardP[3].textContent = 'Заезд после ' + offerObject.offer.checkin + ', выезд до ' + offerObject.offer.checkout;
    mapCardP[4].textContent = offerObject.offer.description;
    mapCardList.appendChild(featuresList);
    mapCardPictures.appendChild(photosList);

    return mapCard;
  };

  //  ---------- обработчики событий на объявлениях других пользователей  ----------  //
  // Сброс активного маркера
  var pinDeactivate = function () {
    if (activPin !== false) {
      activPin.classList.remove('map__pin--active');
    }
  };

  // Реакция на нажатие ESC
  var onPopupEscPress = function (evt) {
    if (evt.keyCode === window.KEY_CODE.ESC) {
      closePopup();
    }
  };

  // Закрыть карточку мышкой
  var onCardCloseClick = function () {
    closePopup();
  };

  // Закрыть карточку с клавиатуры
  var onCardCloseEnterPress = function (evt) {
    if (evt.keyCode === window.KEY_CODE.ENTER) {
      closePopup();
    }
  };

  // Открыть карточку
  var openPopup = function () {
    mapCard.classList.remove('hidden');
    document.addEventListener('keydown', onPopupEscPress);
  };

  // Закрыть карточку
  var closePopup = function () {
    mapCard.classList.add('hidden');
    pinDeactivate();
    activPin = false;
    document.removeEventListener('keydown', onPopupEscPress);
  };

  // Закрытие карточки по нажатию мышки
  buttonClose.addEventListener('click', onCardCloseClick);
  // Закрытие карточки с клавиатуры
  buttonClose.addEventListener('keydown', onCardCloseEnterPress);

  // Экспортируем функцию отрисовки и показа карточек
  window.card = {
    renderAndOpen: function (element, pins) {
      var clickedElement = element;
      while (clickedElement !== pins) {
        if (clickedElement.tagName === 'BUTTON') {
          pinDeactivate();
          clickedElement.classList.add('map__pin--active');
          activPin = clickedElement;
          if (!clickedElement.classList.contains('map__pin--main')) {
            render(window.filters.filteredData[clickedElement.dataset.numPin]);
            openPopup();
          } else {
            mapCard.classList.add('hidden');
          }
        }
        clickedElement = clickedElement.parentNode;
      }
      return mapCard;
    }
  };
})();
