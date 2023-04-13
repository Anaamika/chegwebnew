/// <reference lib="webworker" />

function getUniqueArray(arr) {
  var a = [];
  for (var i = 0, l = arr.length; i < l; i++)
    if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
      a.push(arr[i]);
  return a;
}

function loopData(bestdealsData) {
  let i = 0;
  let obj = {};
  let catList = [];
  let storeList = [];
  while (i < bestdealsData.length) {
    if (bestdealsData[i].category != null) {
      let arr = bestdealsData[i].category.split(',');
      for (let i = 0; i < arr.length; i++) {
        catList.push(arr[i]);
      }
    }
    if (bestdealsData[i].merchantName != null) {
      storeList.push(bestdealsData[i].merchantName);
    }
    i++;
  }
  obj['category'] = getUniqueArray(catList.sort());
  obj['store'] = getUniqueArray(storeList.sort());
  return obj;
}

self.addEventListener('message', (evt) => {
  postMessage(loopData(evt['data']));
});
