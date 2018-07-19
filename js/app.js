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
  console.log(userDatas);
}

getData('/json/spaceships.json', successAjax);
