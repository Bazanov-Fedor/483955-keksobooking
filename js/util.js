'use strict';

window.util = (function () {
  return {
    // Очистка контейнера
    clearContainer: function (container, numChild) {
      while (container.childElementCount > numChild) {
        container.removeChild(container.lastChild);
      }
    }
  };
})();
