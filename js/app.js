function getIntPropertyValue(parameterProperty) {
  if (typeof parameterProperty === 'string') {
    return parseInt(parameterProperty, 10);
  }

  return 0;
}

function doSortObjectsByCost(parameterArray) {
  var endIndex = parameterArray.length - 1;
  var newEndIndex;
  while (endIndex > 1) {
    newEndIndex = 0;
    for (var i = 0; i < endIndex; i++) {
      if (getIntPropertyValue(parameterArray[i].cost_in_credits) >
            getIntPropertyValue(parameterArray[i + 1].cost_in_credits)) {
        [parameterArray[i], parameterArray[i + 1 ]] = [parameterArray[i + 1], parameterArray[i]];
        newEndIndex = i;
      }
    }
    endIndex = newEndIndex;
  }
}

function doRemoveObjectsWithConsumablesNull(parameterArray) {
  for (var i = 0; i < parameterArray.length; i++) {
    if (typeof parameterArray[i].consumables === 'object') {
      parameterArray.splice(i, 1);
      i--;
    }
  }
}

function setRemainingNullPropertiesToUnknown(parameterArray) {
  var objectKeys = Object.keys(parameterArray[0]);
  for (var i = 0; i < parameterArray.length; i++) {
    for (var j = 0; j < objectKeys.length; j++) {
      if (parameterArray[i][objectKeys[j]] === null) {
        parameterArray[i][objectKeys[j]] = 'unknown';
      }
    }
  }
}

function getItemImage(parameterObject) {
  var itemImage = document.createElement('img');
  itemImage.src = `/img/${parameterObject.image}`;
  itemImage.alt = parameterObject.model;
  itemImage.addEventListener('error', function setNewImage() {
    this.src = '/img/no-image.jpg';
  });

  return itemImage;
}

function getObjectKeysToDiv(parameterObject) {
  var itemPropertiesDiv = document.createElement('div');
  var objectKeys = Object.keys(parameterObject);
  var content = '';
  for (var i = 0; i < objectKeys.length; i++) {
    if (objectKeys[i] !== 'image') {
      content += `${objectKeys[i]}:<br>`;
    }
  }
  itemPropertiesDiv.innerHTML = content;
  itemPropertiesDiv.className = 'item-properties';

  return itemPropertiesDiv;
}

function getObjectValuesToDiv(parameterObject) {
  var itemValuesDiv = document.createElement('div');
  var objectKeys = Object.keys(parameterObject);
  var content = '';
  for (var i = 0; i < objectKeys.length; i++) {
    if (objectKeys[i] !== 'image') {
      content += `${parameterObject[objectKeys[i]]}<br>`;
    }
  }
  itemValuesDiv.innerHTML = content;
  itemValuesDiv.className = 'item-values';

  return itemValuesDiv;
}

function getItemDiv(parameterObject) {
  var itemContainerDiv = document.createElement('div');
  itemContainerDiv.appendChild(getItemImage(parameterObject));
  itemContainerDiv.appendChild(getObjectKeysToDiv(parameterObject));
  itemContainerDiv.appendChild(getObjectValuesToDiv(parameterObject));
  itemContainerDiv.spaceship = parameterObject;

  return itemContainerDiv;
}

function getSpaceshipList(parameterArray) {
  var containerDiv = document.querySelector('.spaceship-list');
  for (var i = 0; i < parameterArray.length; i++) {
    containerDiv.appendChild(getItemDiv(parameterArray[i]));
  }
}

function getData(url, callbackFunc) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callbackFunc(this);
    }
  };
  xhttp.open('GET', url, true);
  xhttp.send();
}

function successAjax(xhttp) {
  // Innen lesz elérhető a JSON file tartalma, tehát az adatok amikkel dolgoznod kell
  var userDatas = JSON.parse(xhttp.responseText);
  doSortObjectsByCost(userDatas);
  doRemoveObjectsWithConsumablesNull(userDatas);
  setRemainingNullPropertiesToUnknown(userDatas);
  getSpaceshipList(userDatas);
}

getData('/json/spaceships.json', successAjax);
