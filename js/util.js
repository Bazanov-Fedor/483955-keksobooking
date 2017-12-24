'use strict';

(function () {
  window.util = {
    // Получение случайного целого значения, включая min и исключая max
    getRandomValue: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
  };
}());
