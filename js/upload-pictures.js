'use strict';

(function () {
  // Поле для загрузки изображения пользователського пина
  var avatarDropZone = document.querySelector('.notice__photo .drop-zone');
  // Поле для загрузки изображений обявления
  var imageDropZone = document.querySelector('.form__photo-container .drop-zone');
  var avatarImage = document.querySelector('.notice__preview img');
  var uploadImageArea = document.querySelector('.form__photo-container');
  var avatarFile = document.querySelector('#avatar');
  var imageFile = document.querySelector('#images');

  imageFile.setAttribute('multiple', true);

  function showAvatar(element) {
    var file = element;
    var fileName = file.name.toLowerCase();

    var typeMatches = window.FILE_TYPES.some(function (item) {
      return fileName.endsWith(item);
    });

    if (typeMatches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarImage.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  }

  // Отображение миниатюр
  function showPreview(element) {
    var file = element;
    var fileName = file.name.toLowerCase();

    var matches = window.FILE_TYPES.some(function (item) {
      return fileName.endsWith(item);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        var img = document.createElement('IMG');
        img.width = '40';
        uploadImageArea.appendChild(img);
        img.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  }

  // Загрузка через input[type=file]
  avatarFile.addEventListener('change', function () {
    showAvatar(avatarFile.files[0]);
  });

  imageFile.addEventListener('change', function () {
    [].forEach.call(imageFile.files, showPreview);
  });

  // Загрузка drag-and-drop
  avatarDropZone.addEventListener('dragenter', function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  });

  avatarDropZone.addEventListener('dragover', function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  });

  avatarDropZone.addEventListener('drop', function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
    showAvatar(evt.dataTransfer.files[0]);
  });

  imageDropZone.addEventListener('dragenter', function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  });

  imageDropZone.addEventListener('dragover', function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    return false;
  });

  imageDropZone.addEventListener('drop', function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
    [].forEach.call(evt.dataTransfer.files, showPreview);
  });
})();
