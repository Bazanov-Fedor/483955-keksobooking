'use strict';

(function () {
  // соответствие типов жилья в объявлении
  var OFFER_TYPE = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало',
    palace: 'Дворец'
  };

  // Часть шаблона - карточка объекта недвижимости
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var mapCard = mapCardTemplate.cloneNode(true);
  // кнопка закрытия карточки объявления
  var buttonClose = mapCard.querySelector('.popup__close');
  // состояние маркера
  var activPin = false;

  // Создадим строку для вставки преимущества
  var getStringFeatures = function (elem) {
    return '<li class="feature feature--' + elem + '"></li>';
  };

  // Создадим строку для вставки фотографий
  // добавил размер, т.к. в css нет стилей для фотографий
  var getStringPictures = function (elem) {
    return '<li><img src="' + elem + '"width="50"></li>';
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
    var text = (offerObject.offer.guests % 10 === 1 && offerObject.offer.guests !== 11) === true ? ' гостя' : ' гостей';

    return text;
  };

  // Формирование карточки объявления - заполнение данными из массива объектов
  var render = function (offerObject) {
    var mapCardP = mapCard.querySelectorAll('p');
    var mapCardList = mapCard.querySelector('.popup__features');
    var mapCardPictures = mapCard.querySelector('.popup__pictures');

    mapCard.querySelector('img').src = offerObject.author.avatar;
    mapCard.querySelector('h3').textContent = offerObject.offer.title;
    mapCard.querySelector('.popup__price').innerHTML = offerObject.offer.price + ' &#x20bd;/ночь';
    mapCard.querySelector('small').textContent = offerObject.offer.address;
    mapCard.querySelector('h4').textContent = OFFER_TYPE[offerObject.offer.type];
    mapCardP[2].textContent = offerObject.offer.rooms + makeCorrectTextRooms(offerObject) + offerObject.offer.guests + makeCorrectTextGuests(offerObject);
    mapCardP[3].textContent = 'Заезд после ' + offerObject.offer.checkin + ', выезд до ' + offerObject.offer.checkout;
    mapCardP[4].textContent = offerObject.offer.description;
    mapCardList.innerHTML = '';
    mapCardList.insertAdjacentHTML('afterBegin', offerObject.offer.features.map(getStringFeatures).join(' '));
    mapCard.appendChild(mapCardList);
    mapCardPictures.innerHTML = '';
    mapCardPictures.insertAdjacentHTML('afterBegin', offerObject.offer.photos.map(getStringPictures).join(' '));
    mapCard.appendChild(mapCardPictures);

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
