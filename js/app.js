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

function getClickedOnToResult(parameterObject) {
  var resultDiv = document.querySelector('.result');
  resultDiv.innerHTML = '';
  resultDiv.appendChild(getItemDiv(parameterObject));
}

function getItemDiv(parameterObject) {
  var itemContainerDiv = document.createElement('div');
  itemContainerDiv.appendChild(getItemImage(parameterObject));
  itemContainerDiv.appendChild(getObjectKeysToDiv(parameterObject));
  itemContainerDiv.appendChild(getObjectValuesToDiv(parameterObject));
  itemContainerDiv.spaceship = parameterObject;
  itemContainerDiv.addEventListener('click', function getEvent() {
    getClickedOnToResult(this.spaceship);
  });
  itemContainerDiv.className = 'ship';

  return itemContainerDiv;
}

function getSpaceshipList(parameterArray) {
  var containerDiv = document.querySelector('.spaceship-list');
  for (var i = 0; i < parameterArray.length; i++) {
    containerDiv.appendChild(getItemDiv(parameterArray[i]));
  }
}

function getResultDiv() {
  var rightSideDiv = document.querySelector('.one-spaceship');
  var searchDiv = document.querySelector('.searchbar');
  var resultDiv = document.createElement('div');
  resultDiv.className = 'result';
  rightSideDiv.innerHTML = '';
  rightSideDiv.appendChild(resultDiv);
  rightSideDiv.appendChild(searchDiv);
}

function getSumOfSingleCrewShips(parameterArray) {
  var sumOfShips = 0;
  for (var i = 0; i < parameterArray.length; i++) {
    if (parseInt(parameterArray[i].crew, 10) === 1) {
      sumOfShips++;
    }
  }

  return sumOfShips;
}

function getShipWithBiggestCargo(parameterArray) {
  var index = 0;
  var biggestCargo = parseInt(parameterArray[0].cargo_capacity, 10);
  for (var i = 1; i < parameterArray.length; i++) {
    if (biggestCargo < parseInt(parameterArray[i].cargo_capacity, 10)) {
      index = i;
      biggestCargo = parseInt(parameterArray[i].cargo_capacity, 10);
    }
  }

  return parameterArray[index].model;
}

function getSumOfPassengers(parameterArray) {
  var sumOfPassengers = 0;
  for (var i = 0; i < parameterArray.length; i++) {
    if  (!isNaN(parseInt(parameterArray[i].passengers, 10))) {
      sumOfPassengers += parseInt(parameterArray[i].passengers, 10);
    }
  }

  return sumOfPassengers;
}

function getLongestShip(parameterArray) {
  var index = 0;
  var longestShip = parseInt(parameterArray[0].lengthiness, 10);
  for (var i = 1; i < parameterArray.length; i++) {
    if (longestShip < parseInt(parameterArray[i].lengthiness, 10)) {
      index = i;
      longestShip = parseInt(parameterArray[i].lengthiness, 10);
    }
  }

  return parameterArray[index].image;
}

function getStatistic(parameterArray) {
  var statisticsDiv = document.createElement('div');
  statisticsDiv.className = 'statistics';
  var content = '';
  content += `<b>Egy fős legénységgel rendelkező hajók darabszáma:</b> ${getSumOfSingleCrewShips(parameterArray)}<br>`;
  content += `<b>A legnagyobb cargo_capacity-vel rendelkező hajó neve:</b> ${getShipWithBiggestCargo(parameterArray)}<br>`;
  content += `<b>Az összes hajó utasainak összesített száma:</b> ${getSumOfPassengers(parameterArray)}<br>`;
  content += `<b>A leghosszabb hajó képe:</b> ${getLongestShip(parameterArray)}`;
  statisticsDiv.innerHTML = content;
  var containerDiv = document.querySelector('.spaceship-list');
  containerDiv.appendChild(statisticsDiv);
}

function getShipByName() {
  var itemArray = document.querySelectorAll('.ship');
  var searchingForName = document.querySelector('#search-text');
  var found = false;
  var index = 0;
  while (!found && index < itemArray.length) {
    if (itemArray[index].spaceship.model.toLowerCase().indexOf(searchingForName.value.toLowerCase()) > -1) {
      found = true;
      getClickedOnToResult(itemArray[index].spaceship);
      searchingForName.value = '';
    }
    index++;
  }
  if (!found) {
    document.querySelector('.result').innerHTML = 'No ship found!';
    searchingForName.value = '';
  }
}

function doAddSerch() {
  var textbox = document.querySelector('#search-text');
  var searchButton = document.querySelector('#search-button');
  textbox.placeholder = 'Search for shipname';
  searchButton.addEventListener('click', getShipByName);
}

function getData(url, callbackFunc) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function check() {
    if (this.readyState === 4 && this.status === 200) {
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
  getStatistic(userDatas);
  getResultDiv();
  doAddSerch();
}

getData('/json/spaceships.json', successAjax);


