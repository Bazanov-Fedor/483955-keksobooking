'use strict';

window.form = (function () {
// объект соответствия количества гостевых комант и возможных гостей
  var guestRooms = {
    1: [1],
    2: [2, 1],
    3: [3, 2, 1],
    100: [0]
  };

  // соответствие типа жилого объекта с его минимальной ценой
  var offerTypePrice = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  // форма подачи объявления
  var form = document.querySelector('.notice__form');
  // Найдём необходимые элементы формы с которыми взаимодействует пользователь
  var userAdres = form.querySelector('#address');
  var userTitle = form.querySelector('#title');
  var userTypeOffer = form.querySelector('#type');
  var userOfferPrice = form.querySelector('#price');
  var userCheckinHous = form.querySelector('#timein');
  var userCheckoutHous = form.querySelector('#timeout');
  var roomHous = form.querySelector('#room_number');
  var capacityHous = form.querySelector('#capacity');
  var buttonSubmit = form.querySelector('.form__submit');
  // временный адрес в форме
  userAdres.value = 'Временный адрес для проверки';

  // валидация заголовка объявления пользователя
  // минимальное и максимальное количество знаков в заголовке
  var minLengthTitle = 30;
  var maxLengthTitle = 100;
  // заголовок объявления пользователя
  userTitle.addEventListener('change', function (evt) {
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

  // валидация цены на определённый тип жилья
  // минимальная и максимальная цена
  var minPrice = 0;
  var maxPrice = 1000000;
  // проверка цены
  userOfferPrice.addEventListener('change', function (evt) {
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

  // изменение минимальной стоимости жилья
  var izmenenizMinPrice = function () {
    userOfferPrice.min = offerTypePrice[userTypeOffer.value];
  };

  // синхронизируем время заселения и выселения при изменении поля
  // Автоввод времени выезда при изменении времени въезда
  var onChangeTimeIn = function () {
    userCheckoutHous.selectedIndex = userCheckinHous.selectedIndex;
  };
  // Автоввод времени въезда при изменении времени выезда
  var onChangeTimeOut = function () {
    userCheckinHous.value = userCheckoutHous.value;
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
    var capacitySelectRooms = guestRooms[roomHous.value];
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
  // вызываем функицю, чтоб она отработала сразу при открытии окна
  onCangeRomsGuest();

  // синхронизация времени вьезда
  userCheckinHous.addEventListener('change', onChangeTimeIn);
  // синхронизация времени выезда
  userCheckoutHous.addEventListener('change', onChangeTimeOut);
  // изменение типа жилого помещения
  userTypeOffer.addEventListener('change', izmenenizMinPrice);
  // проверка комнат
  roomHous.addEventListener('change', onCangeRomsGuest);

  // Обработчик для проверки всей формы перед отправкой
  buttonSubmit.addEventListener('click', function () {
    var fieldsForm = form.querySelectorAll('input');

    for (var i = 0; i < fieldsForm.length; i++) {
      if (!fieldsForm[i].validity.valid) {
        fieldsForm[i].setAttribute('style', 'border: 2px solid red;');
      } else {
        fieldsForm[i].removeAttribute('style');
      }
    }
  });

  return {
    activate: function () {
      // удалим класс скрывающий форму
      form.classList.remove('notice__form--disabled');
    }
  };
}());
