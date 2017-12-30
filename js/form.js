'use strict';

(function () {
  // тип помещения в объявлении
  var TYPES = [
    'flat',
    'house',
    'bungalo',
    'palace'
  ];

  // время регистрации и выезда в объявлении
  var CHECKS = ['12:00', '13:00', '14:00'];

  // соответствие типа жилого объекта с его минимальной ценой
  var OFFER_TYPE_PRICE = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  // объект соответствия количества гостевых комант и возможных гостей
  var GUEST_ROOMS = {
    1: [1],
    2: [2, 1],
    3: [3, 2, 1],
    100: [0]
  };

  // Найдём необходимые элементы формы с которыми взаимодействует пользователь
  // форма подачи объявления
  var userTitle = window.form.querySelector('#title');
  var userTypeOffer = window.form.querySelector('#type');
  var userOfferPrice = window.form.querySelector('#price');
  var userCheckinHous = window.form.querySelector('#timein');
  var userCheckoutHous = window.form.querySelector('#timeout');
  var roomHous = window.form.querySelector('#room_number');
  var capacityHous = window.form.querySelector('#capacity');
  var buttonSubmit = window.form.querySelector('.form__submit');

  var arrPrices = TYPES.map(function (elem) {
    return OFFER_TYPE_PRICE[elem];
  });

  // Функция сброса полей формы в начальное состояние
  var resetForm = function () {
    userTitle.placeholder = 'Милая, но очень уютная квартирка в центре Токио';
    window.userAdres.value = window.pinUser.address;
    userTypeOffer.value = 'flat';
    userOfferPrice.value = '5000';
    userCheckinHous.value = '12:00';
    userCheckoutHous.value = '12:00';
    roomHous.value = '1';
    capacityHous.value = '1';
  };

  // Функции обратного вызова для синхронизации значений полей формы
  var syncValues = function (element, value) {
    element.value = value;
  };
  var syncValueWithMin = function (element, value) {
    element.min = value;
  };

  //  -----------  валидация заголовка объявления пользователя  ----------  //
  userTitle.addEventListener('change', function (evt) {
    // минимальное и максимальное количество знаков в заголовке
    var minLengthTitle = 30;
    var maxLengthTitle = 100;
    var target = evt.target;
    if (target.value.length < minLengthTitle) {
      target.setAttribute('style', 'border: 2px solid red;');
      target.setCustomValidity('Минимальная длина заголовка объявления 30-символов');
    } else if (target.value.length > maxLengthTitle) {
      target.setAttribute('style', 'border: 2px solid red;');
      target.setCustomValidity('Максимальная длина заголовка объявления 100 символов');
    } else {
      target.setCustomValidity('');
    }
  });

  //  -----------  валидация цены на определённый тип жилья  -----------  //
  userOfferPrice.addEventListener('change', function (evt) {
    // минимальная и максимальная цена
    var minPrice = 0;
    var maxPrice = 1000000;
    var target = evt.target;
    if (target.value < minPrice) {
      target.setAttribute('style', 'border: 2px solid red;');
      target.setCustomValidity('Стоимость жилья ниже рекомендованной, минимальное значение ' + minPrice);
    } else if (target.value > maxPrice) {
      target.setAttribute('style', 'border: 2px solid red;');
      target.setCustomValidity('Стоимость жилья выше рекомендованной, максимальное значение ' + maxPrice);
    } else {
      target.setCustomValidity('');
    }
  });

  // синхронизируем время заселения и выселения при изменении поля
  // Автоввод времени выезда при изменении времени въезда
  var onChangeTimeIn = function () {
    window.synchronizeFields(userCheckinHous, userCheckoutHous, CHECKS, CHECKS, syncValues);
  };

  // Автоввод времени въезда при изменении времени выезда
  var onChangeTimeOut = function () {
    window.synchronizeFields(userCheckoutHous, userCheckinHous, CHECKS, CHECKS, syncValues);
  };

  // Изменение минимальной стоимости жилья
  var onChangeType = function () {
    window.synchronizeFields(userTypeOffer, userOfferPrice, TYPES, arrPrices, syncValueWithMin);
  };

  // ативация и отключение опции (добавляем/удаляем класс hidden)
  var activateFormSelect = function (elem) {
    elem.classList.remove('hidden');
  };
  var disabledFormSelect = function (elem) {
    elem.classList.add('hidden');
  };

  // зависимость количества гостей от количества комнат
  var onCangeRomsGuest = function () {
    var capacitySelectHous = capacityHous.options.length;
    var capacitySelectRooms = GUEST_ROOMS[roomHous.value];
    var capacitySelecting = capacitySelectRooms.length;
    [].forEach.call(capacityHous.options, activateFormSelect);

    for (var i = 0; i < capacitySelectHous; i++) {
      var search = false;

      for (var k = 0; k < capacitySelecting; k++) {
        if (capacitySelectRooms[k] === parseInt(capacityHous.options[i].value, 10)) {
          search = true;
          break;
        }
      }
      if (!search) {
        disabledFormSelect(capacityHous.options[i]);
      }
    }

    capacityHous.value = capacitySelectRooms[0];
  };
  // вызываем функицию, чтоб она отработала сразу при открытии окна
  onCangeRomsGuest();

  // Отправка формы на сервер
  var onSubmitForm = function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(window.form), resetForm, window.backend.errorHandler);
  };

  // синхронизация времени вьезда
  userCheckinHous.addEventListener('change', onChangeTimeIn);
  // синхронизация времени выезда
  userCheckoutHous.addEventListener('change', onChangeTimeOut);
  // изменение типа жилого помещения
  userTypeOffer.addEventListener('change', onChangeType);
  // проверка комнат
  roomHous.addEventListener('change', onCangeRomsGuest);
  // Событие отправки формы на сервер
  buttonSubmit.addEventListener('submit', onSubmitForm);


  // Обработчик для проверки всей полей формы перед отправкой по клику на submit
  buttonSubmit.addEventListener('click', function () {
    var fieldsForm = window.form.querySelectorAll('input');

    for (var i = 0; i < fieldsForm.length; i++) {
      if (!fieldsForm[i].validity.valid) {
        fieldsForm[i].setAttribute('style', 'border: 2px solid red;');
      } else {
        fieldsForm[i].removeAttribute('style');
      }
    }
  });
}());
