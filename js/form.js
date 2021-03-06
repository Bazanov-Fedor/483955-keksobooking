'use strict';

(function () {

  // тип помещения в объявлении
  var TYPES = [
    'flat',
    'house',
    'bungalo',
    'palace'
  ];

  // минимальная цена на различные объекты недвижимости
  var MIN_PRICES = [
    1000,
    5000,
    0,
    10000
  ];

  // время регистрации и выезда в объявлении
  var CHECKS = ['12:00', '13:00', '14:00'];

  // объект соответствия количества гостевых комант и возможных гостей
  var GUEST_ROOMS = {
    1: ['1'],
    2: ['2', '1'],
    3: ['3', '2', '1'],
    100: ['0']
  };

  // минимальное и максимальное количество знаков в заголовке объявления
  var MIN_LENGTH_TITLE = 30;
  var MAX_LENGTH_TITLE = 100;
  // минимальная и максимальная цена в объявлении
  var MIN_PRICE = 0;
  var MAX_PRICE = 1000000;

  // Найдём необходимые элементы формы с которыми взаимодействует пользователь
  // Форма подачи объявления и поля для заполнения
  var form = document.querySelector('.notice__form');
  var formFields = form.querySelectorAll('fieldset');
  // Заголоовк объявления
  var userTitle = form.querySelector('#title');
  // Тип помещения
  var userTypeOffer = form.querySelector('#type');
  // Цена
  var userOfferPrice = form.querySelector('#price');
  // Время приезда и отезда
  var userCheckinHous = form.querySelector('#timein');
  var userCheckoutHous = form.querySelector('#timeout');
  // Количество комнат
  var roomHous = form.querySelector('#room_number');
  // Количество возможных гостей
  var capacityHous = form.querySelector('#capacity');
  // Чекбоксы преимуществ
  var features = form.querySelectorAll('input[type="checkbox"]');
  // Поле с координатами
  var userAdres = form.querySelector('#address');

  // Функции обратного вызова для синхронизации значений полей формы
  var syncValues = function (element, value) {
    element.value = value;
  };

  var syncValueWithMin = function (element, value) {
    element.min = value;
  };

  // Функция сброса полей формы в начальное состояние
  var resetForm = function () {
    window.backend.removeError();
    userTitle.value = '';
    userTitle.placeholder = 'Милая, но очень уютная квартирка в центре Токио';
    window.form.setAddressHousing();
    userTypeOffer.value = 'flat';
    userOfferPrice.value = '5000';
    userCheckoutHous.value = '12:00';
    userCheckinHous.value = '12:00';
    roomHous.value = '1';
    capacityHous.value = '1';
    [].forEach.call(capacityHous.options, function (element) {
      activateFormSelect(element);
    });
    [].forEach.call(features, function (element) {
      element.checked = false;
    });
  };

  // Автоввод времени выезда при изменении времени въезда
  var onTimeInChange = function () {
    window.util.synchronizeFields(userCheckoutHous, userCheckinHous, CHECKS, CHECKS, syncValues);
  };

  // Автоввод времени въезда при изменении времени выезда
  var onTimeOutChange = function () {
    window.util.synchronizeFields(userCheckinHous, userCheckoutHous, CHECKS, CHECKS, syncValues);
  };

  // Изменение минимальной стоимости жилья
  var onTypeChange = function () {
    window.util.synchronizeFields(userTypeOffer, userOfferPrice, TYPES, MIN_PRICES, syncValueWithMin);
  };
  onTypeChange();

  // зависимость количества гостей от количества комнат
  var onRoomNumberChange = function () {
    var guests = GUEST_ROOMS[roomHous.value];
    [].forEach.call(capacityHous.options, function (element) {
      if (guests.includes(element.value)) {
        activateFormSelect(element);
      } else {
        disabledFormSelect(element);
      }
    });

    capacityHous.value = guests[0];
  };

  // Функции включения-выключения вариантов количества гостей
  var activateFormSelect = function (element) {
    element.classList.remove('hidden');
  };

  var disabledFormSelect = function (element) {
    element.classList.add('hidden');
  };

  // Изменение количества комнат, если первоначально изменение было в количестве гостей
  var onCapacityChange = function () {
    var capacityValue = capacityHous.value;
    if (!GUEST_ROOMS[roomHous.value].includes(capacityValue)) {
      for (var key in GUEST_ROOMS) {
        if (GUEST_ROOMS[key].includes(capacityValue)) {
          roomHous.value = key;
          onRoomNumberChange();
          return;
        }
      }
    }
  };

  onRoomNumberChange();
  onCapacityChange();


  // Отправка формы на сервер
  var onFormSubmit = function (evt) {
    window.backend.save(new FormData(form), resetForm, window.backend.onErrorSave);
    evt.preventDefault();
  };

  //  -----------  валидация заголовка объявления пользователя  ----------  //
  userTitle.addEventListener('change', function (evt) {
    var target = evt.target;
    if (target.value.length < MIN_LENGTH_TITLE) {
      target.setAttribute('style', 'border: 2px solid red');
      target.setCustomValidity('Минимальная длина заголовка объявления 30-символов');
    } else if (target.value.length > MAX_LENGTH_TITLE) {
      target.setAttribute('style', 'border: 2px solid red');
      target.setCustomValidity('Максимальная длина заголовка объявления 100 символов');
    } else {
      target.setCustomValidity('');
      target.setAttribute('style', 'border: 2px solid #d9d9d3');
    }
  });

  //  -----------  валидация цены на определённый тип жилья  -----------  //
  userOfferPrice.addEventListener('invalid', function (evt) {
    var target = evt.target;
    if (target.value < MIN_PRICE) {
      target.setAttribute('style', 'border: 2px solid red');
      target.setCustomValidity('Стоимость жилья ниже рекомендованной, минимальное значение ' + MIN_PRICE);
    } else if (target.value > MAX_PRICE) {
      target.setAttribute('style', 'border: 2px solid red');
      target.setCustomValidity('Стоимость жилья выше рекомендованной, максимальное значение ' + MAX_PRICE);
    } else {
      target.setCustomValidity('');
      target.setAttribute('style', 'border: 2px solid #d9d9d3');
    }
  });

  // Событие изменения времени въезда
  userCheckoutHous.addEventListener('change', onTimeInChange);
  // Событие изменения времени выезда
  userCheckinHous.addEventListener('change', onTimeOutChange);
  // Событие изменения типа жилья
  userTypeOffer.addEventListener('change', onTypeChange);
  // События изменения количества комнат и гостей
  roomHous.addEventListener('change', onRoomNumberChange);
  capacityHous.addEventListener('change', onCapacityChange);

  // Событие отправки формы на сервер
  form.addEventListener('submit', onFormSubmit);

  window.form = {
    // Устанавливаем значение в поле адреса
    setAddressHousing: function () {
      userAdres.value = window.pinUser.getCoords();
    },
    activateForm: function () {
      form.classList.remove('notice__form--disabled');
      [].forEach.call(formFields, function (element) {
        element.removeAttribute('disabled', 'disabled');
      });
      window.form.setAddressHousing();
    },
    init: function () {
      [].forEach.call(formFields, function (element) {
        element.setAttribute('disabled', 'disabled');
      });
      roomHous.value = '1';
      capacityHous.value = '1';
    }
  };
})();
