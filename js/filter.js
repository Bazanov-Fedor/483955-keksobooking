'use strict';

(function () {
  // на карте отображается не более пяти пинов других объявлений
  var PIN_ORDERS = 5;

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

  // объект c текущими значениями фильтров
  var FilterValue = {
    type: 'any',
    price: 'any',
    rooms: 'any',
    guests: 'any'
  };

  // Массива полученных с сервера данных
  var dataInfo = [];
  // Выбранные приемущества
  var selectedAdvantages = [];

  var filterFunctions = [

    // Фильтр по типу жилья
    function (arr) {
      if (FilterValue.type !== 'any') {
        arr = arr.filter(function (element) {
          return element.offer.type === FilterValue.type;
        });
      }
      return arr;
    },

    // Фильтр по стоимости
    function (arr) {
      switch (FilterValue.price) {
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

    // Фильтр по количеству комнат
    function (arr) {
      if (FilterValue.rooms !== 'any') {
        arr = arr.filter(function (element) {
          return element.offer.rooms === parseInt(FilterValue.rooms, 10);
        });
      }
      return arr;
    },

    // Фильтр по количеству гостей
    function (arr) {
      if (FilterValue.guests !== 'any') {
        arr = arr.filter(function (element) {
          return element.offer.guests === parseInt(FilterValue.guests, 10);
        });
      }
      return arr;
    },

    // Фильтр по удобствам
    function (arr) {
      return arr.filter(function (element) {
        return selectedAdvantages.every(function (currentFeature) {
          return element.offer.features.includes(currentFeature);
        });
      });
    }
  ];

  var onFiltersChange = function (evt) {
    // Выставляем значение сработавшего фильтра в объекте текущих значений фильтров
    var filterName = evt.target.name.substring(8);
    FilterValue[filterName] = evt.target.value;
    // Копируем исходные данные для фильтрования
    window.mapFilters.filteredData = dataInfo.slice();
    // Получаем список отмеченных чекбоксов
    var checkedElements = filterFeatures.querySelectorAll('input[type="checkbox"]:checked');
    // Преобразуем список в массив строк
    selectedAdvantages = [].map.call(checkedElements, function (element) {
      return element.value;
    });

    // Получаем массив данных после обработки системой фильтров
    filterFunctions.forEach(function (element) {
      window.mapFilters.filteredData = element(window.mapFilters.filteredData);
    });

    // Обрезаем полученный массив до необходимой длинны
    if (window.mapFilters.filteredData.length > PIN_ORDERS) {
      window.mapFilters.filteredData = window.mapFilters.filteredData.slice(0, PIN_ORDERS);
    }

    // Добавляем пины на страницу через установленный тайм-аут
    window.debounce(window.map.appendPins);
  };
  // ==========================================================================
  // Обработчики событий изменения фильтров
  // ==========================================================================
  filterType.addEventListener('change', onFiltersChange);
  filterPrice.addEventListener('change', onFiltersChange);
  filterRooms.addEventListener('change', onFiltersChange);
  filterGuests.addEventListener('change', onFiltersChange);
  filterFeatures.addEventListener('change', onFiltersChange);

  // Экспортируем функцию, принимающую массив данных с сервера,
  // и отфильтрованный массив данных
  // ==========================================================================
  window.mapFilters = {
    filteredData: [],
    transferData: function (data) {
      dataInfo = data.slice();
      this.filteredData = data.slice(0, PIN_ORDERS);
    },
  };
})();
