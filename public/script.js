function setCookie(name,value,days) {
  var expires = "";
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/; SameSite=None; Secure;";
};
function getCookieValue(name) {
    const regex = new RegExp(`(^| )${name}=([^;]+)`)
    const match = document.cookie.match(regex)
    if (match) {
      return match[2];
    }
 };
 function getParam(paramName) {
  const params = new URLSearchParams(window.location.search);
  return params.get(paramName);
};
 function setCurrentUid() {
  const lastGuidCookie = getCookieValue('lastGuid');
  document.getElementById("currentUid").innerHTML = lastGuidCookie;
};
function setInputValue2() {
  const lastGuidCookie = getCookieValue('lastGuid');
  document.getElementById("lastGuid").value = lastGuidCookie;
};
function setInputValue3() {
  const lastGuidCookie = "10000000-1000-4000-8000-100000000000";
  document.getElementById("lastGuid").value = lastGuidCookie;
  document.getElementById("lastLog").value = 0;
};
function addEntry(){
  const lastGuidi = getCookieValue('lastGuid');
  const lastLogi = JSON.stringify(getCookieValue('lastLog'));
  const statusi = document.getElementById("status").value;
  const fortunei = document.getElementById("fortune").value;
  const postEntryUrl = window.location.origin + "/entry";
  const payload = {
    lastGuid: lastGuidi,
    lastLog: lastLogi,
    status: statusi,
    fortune: fortunei
  };
  (async () => {
    const rawResponse = await fetch(postEntryUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const contenti = await rawResponse.json();
    const contentii = JSON.stringify(contenti);
    const guid = contentii.replace(/"/g, '');
    const fileNamei = Math.floor(+new Date() / 1000);
    const fileNameii = fileNamei + ".txt";
    setCookie('lastGuid', guid, 14);
    setCookie('timestamp', fileNamei, 14);
    createAndDownloadFile(fileNameii, guid);
    updateCache(lastGuidi, fileNamei, guid);
  })();
};
function checkin(){
  const lastGuidi = getCookieValue('lastGuid');
  const lastLogi = JSON.stringify(getCookieValue('lastLog'));
  const statusi = "alive";
  const fortunei = "checking in";
  const postEntryUrl = window.location.origin + "/entry";
  const payload = {
    lastGuid: lastGuidi,
    lastLog: lastLogi,
    status: statusi,
    fortune: fortunei
  };
  (async () => {
    const rawResponse = await fetch(postEntryUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const contenti = await rawResponse.json();
    const contentii = JSON.stringify(contenti);
    const guid = contentii.replace(/"/g, '');
    const fileNamei = Math.floor(+new Date() / 1000);
    const fileNameii = fileNamei + ".txt";
    var output = document.getElementById("logoutput");
    const item = document.createElement("span");
    item.innerHTML = '%> checkin entry successfully logged';
    output.appendChild(item);
    setCookie('lastGuid', guid, 14);
    setCookie('timestamp', fileNamei, 14);
    updateCache(lastGuidi, fileNamei, guid);
  })();
};
function createAndDownloadFile(fileName, content) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const item = JSON.stringify(fileName).replace(/"/g, '');
  link.href = url;
  link.innerHTML = 'to log back in: (now)' + item;
  link.download = fileName;
  document.body.appendChild(link);
  //link.click();
  //document.body.removeChild(link);
};
function updateCache(oldguid, timestamp, newguid) {
  var updateCacheUrl = window.location.origin + "/lode/" + oldguid + "/" + timestamp + "/" + newguid;
  fetch(updateCacheUrl)
    .then(response => response.json())
    .then(data => {
        var output = document.getElementById("logoutput");
        const item = document.createElement("span");
        item.innerHTML = '%> cache updated for uid: ' + data;
        output.appendChild(item);
        console.log("cache updated for uid: " + data);
    })
    .catch(error => console.error('Error fetching data:', error));
};
function findLogIdx(guid) {
  var lastGuid = guid;
  var findLogIdxUrl = window.location.origin + "/logchain/log/" + lastGuid;
  fetch(findLogIdxUrl)
    .then(response => response.json())
    .then(data => {
      setCookie('lastLog', JSON.stringify(data), 14);                      
      //document.getElementById("lastLog").value = data;
    })
    .catch(error => console.error('Error fetching data:', error));
};
function mineEntries() {
  var mineEntriesUrl = window.location.origin + "/mine";
  fetch(mineEntriesUrl)
    .then(response => response.json())
    .then(data => {
        var output = document.getElementById("logoutput");
        const item = document.createElement("span");
        item.innerHTML = '%> entries successfully mined';
        output.appendChild(item);
        console.log("entries successfully mined");
        const lastGuidCookie = getCookieValue('lastGuid');
        findLogIdx(lastGuidCookie);
    })
    .catch(error => console.error('Error fetching data:', error));
};
function lodeUIDs() {
    const lastGuidCookie = getCookieValue('lastGuid');
    const timestampCookie = getCookieValue('timestamp');
      var updateCacheUrl = window.location.origin + "/lode/10000000-1000-4000-8000-100000000000/" + timestampCookie + "/" + lastGuidCookie;
      fetch(updateCacheUrl)
        .then(response => response.json())
        .then(data => {
          var output = document.getElementById("logoutput");
          const item = document.createElement("span");
          item.innerHTML = '%> cache updated for uid: ' + data;
          output.appendChild(item);
          console.log("cache updated for uid: " + data);
        })
        .catch(error => console.error('Error fetching data:', error));
};
function findHistory() {
  var lastGuid = getCookieValue('lastGuid');
  var findHistoryUrl = window.location.origin + "/logchain/strata/" + lastGuid;
  clearTable("thisTable");
  fetch(findHistoryUrl)
    .then(response => response.json())
    .then(data => {
      const table = document.getElementById('thisTable');
      const tbody = table.getElementsByTagName('tbody')[0];

      data.forEach(item => {
        const row = tbody.insertRow();
        Object.values(item).forEach(value => {
          const cell = row.insertCell();
          if (item.timestamp == value){
            const date = new Date(value * 1000);
            cell.textContent = date;
          }
          else {
            cell.textContent = value;
          }
        });
      });
    })
    .catch(error => console.error('Error fetching data:', error));
};
function findEntry() {
  var lastGuid = document.getElementById("lastGuid").value;
  clearTable("thisTable");
  var findEntryUrl = window.location.origin + "/logchain/entry/" + lastGuid;
  fetch(findEntryUrl)
    .then(response => response.json())
    .then(data => {
      const table = document.getElementById('thisTable');
      const tbody = table.getElementsByTagName('tbody')[0];
      console.log(data[0]);
      const row = tbody.insertRow();
      Object.values(data[0]).forEach(value => {
          const cell = row.insertCell();
          if (data[0].timestamp == value){
            const date = new Date(value * 1000);
            cell.textContent = date;
          }
          else {
            cell.textContent = value;
          }
        });
    })
    .catch(error => console.error('Error fetching data:', error));
};
function findSubsequence() {
  var lastGuid = document.getElementById("lastGuid").value;
  clearTable("thisTable");
  var findSubsequenceUrl = window.location.origin + "/logchain/subsequence/" + lastGuid;

  fetch(findSubsequenceUrl)
    .then(response => response.json())
    .then(data => {
      const table = document.getElementById('thisTable');
      const tbody = table.getElementsByTagName('tbody')[0];

      data.forEach(item => {
        const row = tbody.insertRow();
        Object.values(item).forEach(value => {
          const cell = row.insertCell();
          if (item.timestamp == value){
            const date = new Date(value * 1000);
            cell.textContent = date;
          }
          else {
            cell.textContent = value;
          }
        });
      });
    })
    .catch(error => console.error('Error fetching data:', error));
};
function initiateWatchlist() {
    let delimiter = '#';
    let uid = document.getElementById("lastGuid").value;
    const watchlistCookieStr = getCookieValue("watchlist");
    if (watchlistCookieStr === undefined) {
      console.log("no uids in watchlist");
    }
    else {
      const watchlistArray = watchlistCookieStr.split("#");
      watchlistArray.pop();
      for (let i = 0; i < watchlistArray.length; i++) {
        let table = document.getElementById("outputTable");
        let newRow = table.insertRow(table.rows.length);
        newRow.insertCell(0).innerHTML = watchlistArray[i];
        newRow.insertCell(1).innerHTML = '<a href="history.html?uid='+watchlistArray[i]+'">prior entries</a>';
        newRow.insertCell(2).innerHTML = '<a href="following.html?uid='+watchlistArray[i]+'">following entries</a>';
        newRow.insertCell(3).innerHTML = '<button onclick="deleteData(this)">Delete</button>';
        clearInputs();
      }
    }
};
function addData() {
    let delimiter = '#';
    let uid = document.getElementById("lastGuid").value;
    const watchlistCookieStr = getCookieValue("watchlist");
    if (watchlistCookieStr === undefined) {
      let first = uid;
      setCookie('watchlist', first + delimiter, 14);
    }
    else {
      let multiple = watchlistCookieStr + uid;
      setCookie('watchlist', multiple + delimiter, 14);
    }
    let table = document.getElementById("outputTable");
    let newRow = table.insertRow(table.rows.length);

    newRow.insertCell(0).innerHTML = uid;
    newRow.insertCell(1).innerHTML = '<a href="history.html?uid='+uid+'">prior entries</a>';
    newRow.insertCell(2).innerHTML = '<a href="following.html?uid='+uid+'">following entries</a>';
    newRow.insertCell(3).innerHTML = '<button onclick="deleteData(this)">Delete</button>';
    clearInputs();
};
function deleteData(button) {
    let row = button.parentNode.parentNode;
    let uidCell = row.cells[0];
    let uid = uidCell.innerHTML;
    const watchlistCookieStr = getCookieValue("watchlist");
    const watchlistArray = watchlistCookieStr.split("#");          
    const index = watchlistArray.indexOf(uid);
    if (index > -1) {
      watchlistArray.splice(index, 1);
      const delimited = watchlistArray.join("#");
      setCookie('watchlist', delimited, 14);
    }
    row.parentNode.removeChild(row);
};

function clearInputs() {            
    document.getElementById("lastGuid").value = "";
};
function clearTable(tableId) {
  const table = document.getElementById(tableId);
  const rows = table.getElementsByTagName("tr");
  for (let i = 1; i < rows.length; i++) {
    table.deleteRow(i);
    i--;
  }
}
