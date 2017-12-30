'use strict';

(function () {

  // код клавиш для обработчиков
  var keyCode = {
    ESC: 27,
    ENTER: 13
  };

  // шаблон подачи объявлений
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var mapCard = mapCardTemplate.cloneNode(true);
  // кнопка закрытия карточки объявления
  var buttonClose = mapCard.querySelector('.popup__close');
  // состояние маркера
  var activPin = false;

  // удаление активного маркера
  var pinActivDisabled = function () {
    if (activPin !== false) {
      activPin.classList.remove('map__pin--active');
    }
  };

  // Реакция на нажатие ESC
  var onPopupEscPress = function (evt) {
    if (evt.keyCode === keyCode.ESC) {
      closePopup();
    }
  };

  // Закрыть карточку мышкой
  var onCardCloseClick = function () {
    closePopup();
  };

  // Закрыть карточку с клавиатуры
  var onCardCloseEnterPress = function (evt) {
    if (evt.keyCode === keyCode.ENTER) {
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
    pinActivDisabled();
    activPin = false;
    document.removeEventListener('keydown', onPopupEscPress);
  };

  // Закрытие карточки по нажатию мышки
  buttonClose.addEventListener('click', onCardCloseClick);
  // Закрытие карточки с клавиатуры
  buttonClose.addEventListener('keydown', onCardCloseEnterPress);

  window.showCard = {
    // Заполняем и открываем карточку
    renderAndOpen: function (elem, offer, pins) {
      var clickedElement = elem;
      while (clickedElement !== pins) {
        if (clickedElement.tagName === 'BUTTON') {
          pinActivDisabled();
          clickedElement.classList.add('map__pin--active');
          activPin = clickedElement;
          if (!clickedElement.classList.contains('map__pin--main')) {
            // Заполняем DOM-ноду карточки данными из массива объектов
            window.card.renderCard(mapCard, offer[clickedElement.dataset.numPin]);
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
}());
