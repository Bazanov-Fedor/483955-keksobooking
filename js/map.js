'use strict';

(function () {
  // код клавиш для обработчиков
  var keyCode = {
    ESC: 27,
    ENTER: 13
  };

  var offer = [];
  // контейнер со списком марекров
  var pinsContainer = document.querySelector('.map__pins');
  // шаблон
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var mapCard = mapCardTemplate.cloneNode(true);
  // кнопка закрытия карточки объявления
  var buttonClose = mapCard.querySelector('.popup__close');
  // Фрагмент документа, который формируется для вставки в документ
  var fragmentPin = document.createDocumentFragment();
  // состояние маркера
  var activPin = false;

  //  ----------- Обработчики событий на сайте  -----------  //
  // начало работы страницы(отрисовка объявлений и ативация формы) по клику на центральный пин
  var onPinMouseUp = function () {
    // удалим класс скрывающий объявления на карте
    window.map.classList.remove('map--faded');
    // Добавляем маркеры на страницу
    pinsContainer.appendChild(fragmentPin);
    // удалим класс скрывающий форму
    window.form.classList.remove('notice__form--disabled');
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
          window.card.renderCard(mapCard, offer[clickedElement.dataset.numPin]);
          openPopup();
        }
        return;
      }
      clickedElement = clickedElement.parentNode;
    }
  };

  // Обработчики на элементах
  // Делаем страницу доступной для работы пользователя
  window.pinUser.addEventListener('mouseup', onPinMouseUp);
  // Клик на маркер ловим на контейнере
  pinsContainer.addEventListener('click', onPinClick);
  // Закрытие карточки по нажатию мышки
  buttonClose.addEventListener('click', onCardCloseClick);
  // Закрытие карточки с клавиатуры
  buttonClose.addEventListener('keydown', onCardCloseEnterPress);

  // Создаем и заполняем данными массив объектов недвижимости
  offer = window.data.generateAds();
  // Переносим данные из массива объектов во фрагмент с маркерами для вставки на страницу
  offer.forEach(window.pin.renderPin, fragmentPin);
  // Добавляем карточку недвижимости на страницу и скрываем ее
  window.map.appendChild(mapCard);
  mapCard.classList.add('hidden');
})();
