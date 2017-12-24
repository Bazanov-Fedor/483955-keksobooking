'use strict';

window.card = (function () {
  // Создадим строку для вставки преимущества
  var getStringFeatures = function (elem) {
    return '<li class="feature feature--' + elem + '"></li>';
  };

  return {
    renderCard: function (mapCard, offerObject) {
      var mapCardP = mapCard.querySelectorAll('p');
      var mapCardList = mapCard.querySelector('.popup__features');
      // вставка изображения
      mapCard.querySelector('img').src = offerObject.author.avatar;
      // заголовок объявления
      mapCard.querySelector('h3').textContent = offerObject.offer.title;
      // цена
      mapCard.querySelector('.popup__price').innerHTML = offerObject.offer.price + '&#x20bd;/ночь';
      // адрес
      mapCard.querySelector('small').textContent = offerObject.offer.address;
      // тип
      mapCard.querySelector('h4').textContent = window.data.offerType[offerObject.offer.type];
      // количество гостей
      mapCardP[2].textContent = offerObject.offer.rooms + ' комнаты для ' + offerObject.offer.guests + ' гостей';
      // время заезда и выезда
      mapCardP[3].textContent = 'Заезд после ' + offerObject.offer.checkin + ', выезд до ' + offerObject.offer.checkout;
      // описание
      mapCardP[4].textContent = offerObject.offer.description;
      mapCardList.innerHTML = '';
      mapCardList.insertAdjacentHTML('afterBegin', offerObject.offer.features.map(getStringFeatures).join(' '));
      mapCard.appendChild(mapCardList);

      return mapCard;
    }
  };
}());
