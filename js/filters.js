'use strict';

(function () {

  // Найдём элементы с которыми будем работать над фильтрацией объявлений
  // блок с выбором фильтров
  var blockFilter = document.querySelector('.map__filters');

  // Фильтры:
  // фильтр типа помещения
  var filterType = blockFilter.querySelector('#housing-type');
  // фильтр цены
  var filterPrice = blockFilter.querySelector('#housing-price');
  // фильтр числа комнат
  var filterRooms = blockFilter.querySelector('#housing-rooms');
  // фильтр числа возможных гостей
  var filterGuests = blockFilter.querySelector('#housing-guests');
  // фильтр приемуществ
  var filterFeatures = blockFilter.querySelector('#housing-features');

  // Отмеченные пользователем удобства
  var checkedFeatures = [];

  // объект c текущими значениями фильтров
  var FILTER_VALUE = {
    type: 'any',
    price: 'any',
    rooms: 'any',
    guests: 'any'
  };

  // Массива полученных с сервера данных
  var dataInfo = [];

  var filterFunctions = [
    // Фильтр - тип жилья
    function (arr) {
      if (FILTER_VALUE.type !== 'any') {
        arr = arr.filter(function (element) {
          return element.offer.type === FILTER_VALUE.type;
        });
      }
      return arr;
    },

    // Фильтр - стоимости
    function (arr) {
      switch (FILTER_VALUE.price) {
        case 'any':
          break;
        case 'low':
          arr = arr.filter(function (element) {
            return element.offer.price <= 10000;
          });
          break;
        case 'high':
          arr = arr.filter(function (element) {
            return element.offer.price >= 50000;
          });
          break;
        case 'middle':
          arr = arr.filter(function (element) {
            return (element.offer.price > 10000) && (element.offer.price < 50000);
          });
      }
      return arr;
    },

    // Фильтр - количество комнат
    function (arr) {
      if (FILTER_VALUE.rooms !== 'any') {
        arr = arr.filter(function (element) {
          return element.offer.rooms === parseInt(FILTER_VALUE.rooms, 10);
        });
      }
      return arr;
    },

    // Фильтр - количество гостей
    function (arr) {
      if (FILTER_VALUE.guests !== 'any') {
        arr = arr.filter(function (element) {
          return element.offer.guests === parseInt(FILTER_VALUE.guests, 10);
        });
      }
      return arr;
    },

    // Фильтр - выбранные удобства
    function (arr) {
      return arr.filter(function (element) {
        return checkedFeatures.every(function (currentFeature) {
          return element.offer.features.includes(currentFeature);
        });
      });
    }
  ];

  // Функции отвечающие за фильтрацию
  var onFiltersChange = function (evt) {
    // Выставляем значение сработавшего фильтра в объекте текущих значений фильтров
    var filterName = evt.target.name.substring(8);
    FILTER_VALUE[filterName] = evt.target.value;
    // Копируем исходные данные для фильтрования
    window.filters.filteredData = dataInfo.slice();
    // Получаем список выбранны преимуществ
    var checkedElements = filterFeatures.querySelectorAll('input[type="checkbox"]:checked');
    // Преобразуем список в массив
    checkedFeatures = [].map.call(checkedElements, function (element) {
      return element.value;
    });

    // Массив после применения фильтров
    filterFunctions.forEach(function (getFiltered) {
      window.filters.filteredData = getFiltered(window.filters.filteredData);
    });

    // Получаем массив нужной длинны
    if (window.filters.filteredData.length > window.PIN_ORDERS) {
      window.filters.filteredData = window.filters.filteredData.slice(0, window.PIN_ORDERS);
    }

    // Добавляем пины на страницу через установленный тайм-аут
    window.debounce(window.map.appendPins);
  };

  //  ----------- Обработчики для работы фильтров  ----------  //
  filterType.addEventListener('change', onFiltersChange);
  filterPrice.addEventListener('change', onFiltersChange);
  filterRooms.addEventListener('change', onFiltersChange);
  filterGuests.addEventListener('change', onFiltersChange);
  filterFeatures.addEventListener('change', onFiltersChange);

  window.filters = {
    filteredData: [],
    transferData: function (data) {
      dataInfo = data.slice();
      this.filteredData = data.slice(0, window.PIN_ORDERS);
    },
  };
})();
