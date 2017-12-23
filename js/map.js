'use strict';

(function () {
  // код клавиш для обработчиков
  var keyCode = {
    ESC: 27,
    ENTER: 13
  };

  // Найдём нужные элементы на странице для работы
  var map = document.querySelector('.map');
  // маркер пользователя / пин (в центре карты)
  var pinUser = map.querySelector('.map__pin--main');
  //
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
  //
  var mapCard = mapCardTemplate.cloneNode(true);
  //
  var buttonClose = mapCard.querySelector('.popup__close');
  // контейнер со списком марекров
  var pinsContainer = document.querySelector('.map__pins');
  // Фрагмент документа, который формируется для вставки в документ
  var fragment = document.createDocumentFragment();
  // состояние маркера
  var activPin = false;
  // Создадим массив объявлений и копию массива заголовков
  var offer = [];

  //  ----------- Обработчики событий на сайте  -----------  //
  // начало работы страницы(отрисовка объявлений и ативация формы) по клику на центральный пин

  var onPinMouseUp = function () {
    // удалим класс скрывающий объявления на карте
    map.classList.remove('map--faded');
    // Добавляем маркеры на страницу
    pinsContainer.appendChild(fragment);
    // удалим класс скрывающий форму
    window.form.activate();
  };

  // удаление активного маркера
  var pinActivDisabled = function () {
    if (activPin !== false) {
      activPin.classList.remove('map__pin--active');
    }
  };

  // Закрытие карточки объявления клавишей ESC
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

  // открытие объявления
  var openPopup = function () {
    mapCard.classList.remove('hidden');
    document.addEventListener('keydown', onPopupEscPress);
  };

  // закрытие объявления
  var closePopup = function () {
    mapCard.classList.add('hidden');
    pinActivDisabled();
    activPin = false;
    document.removeEventListener('keydown', onPopupEscPress);
  };

  // обработчик добавления/удаления активного состояния
  var onPinClick = function (evt) {
    var clickedElement = evt.target;
    while (clickedElement !== pinsContainer) {
      if (clickedElement.tagName === 'BUTTON') {
        pinActivDisabled();
        clickedElement.classList.add('map__pin--active');
        activPin = clickedElement;
        if (!clickedElement.classList.contains('map__pin--main')) {

          // заполняем DOM-ноду
          window.card.render.renderCard(offer[clickedElement.dataset.numPin]);
          openPopup();
        }
        return;
      }
      clickedElement = clickedElement.parentNode;
    }
  };

  // Обработчики на элементах
  // Делаем страницу доступной для работы пользователя
  pinUser.addEventListener('mouseup', onPinMouseUp);
  // Клик на маркер ловим на контейнере
  pinsContainer.addEventListener('click', onPinClick);
  // Закрытие карточки по нажатию мышки
  buttonClose.addEventListener('click', onCardCloseClick);
  // Закрытие карточки с клавиатуры
  buttonClose.addEventListener('keydown', onCardCloseEnterPress);

  /* // соответствие типов объектов недвижимости
  var offerType = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало',
    palace: 'Дворец'
  };

   */


  // Фрагмент для карточки
  var fragmentCard = document.createDocumentFragment();

  // Создаем и заполняем данными массив объектов недвижимости
  offer = window.data.generateAds();
  // Переносим данные из массива объектов во фрагмент с маркерами для вставки на страницу
  offer.forEach(window.render.pin, fragment);
  // Заполняем фрагмент данными из массива объектов для отрисовки карточки
  // fragmentCard.appendChild(renderCard(offer[0]));
  // Добавляем карточку недвижимости на страницу и скрываем ее
  map.appendChild(fragmentCard);
  mapCard.classList.add('hidden');
})();
