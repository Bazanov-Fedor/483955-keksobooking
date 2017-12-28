'use strict';

(function () {

  // Создадим строку для вставки преимущества
  var getStringFeatures = function (elem) {
    return '<li class="feature feature--' + elem + '"></li>';
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
  window.card = {
    renderCard: function (mapCard, offerObject) {
      var mapCardP = mapCard.querySelectorAll('p');
      var mapCardList = mapCard.querySelector('.popup__features');
      mapCard.querySelector('img').src = offerObject.author.avatar;
      mapCard.querySelector('h3').textContent = offerObject.offer.title;
      mapCard.querySelector('.popup__price').innerHTML = offerObject.offer.price + ' &#x20bd;/ночь';
      mapCard.querySelector('small').textContent = offerObject.offer.address;
      mapCard.querySelector('h4').textContent = window.data.offerType[offerObject.offer.type];
      mapCardP[2].textContent = offerObject.offer.rooms + makeCorrectTextRooms(offerObject) + offerObject.offer.guests + makeCorrectTextGuests(offerObject);
      mapCardP[3].textContent = 'Заезд после ' + offerObject.offer.checkin + ', выезд до ' + offerObject.offer.checkout;
      mapCardP[4].textContent = offerObject.offer.description;
      mapCardList.innerHTML = '';
      mapCardList.insertAdjacentHTML('afterBegin', offerObject.offer.features.map(getStringFeatures).join(' '));
      mapCard.appendChild(mapCardList);

      return mapCard;
    }
  };
}());
