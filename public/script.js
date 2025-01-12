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
 function setInputValue1() {
  const lastGuidCookie = getCookieValue('lastGuid');
  document.getElementById("currentUid").innerHTML = lastGuidCookie;
}
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
  const lastGuidi = document.getElementById("lastGuid").value;
  const lastLogi = document.getElementById("lastLog").value;
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
  const lastLogi = getCookieValue('lastLog');
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
      document.getElementById("lastLog").value = data;
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
      //const table = document.getElementById('thisTable');
      //const tbody = table.getElementsByTagName('tbody')[0];
     // data.entries.forEach(item => {
       // const row = tbody.insertRow();
       // Object.values(item).forEach(value => {
      //    const cell = row.insertCell();
      //    cell.textContent = value;
      //  });
      //});
    })
    .catch(error => console.error('Error fetching data:', error));
}
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
  var lastGuid = document.getElementById("lastGuid").value;

  var findHistoryUrl = window.location.origin + "/logchain/history/" + lastGuid;

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
}
function findEntry() {
  var lastGuid = document.getElementById("lastGuid").value;

  var findEntryUrl = window.location.origin + "/logchain/entry/" + lastGuid;
  fetch(findEntryUrl)
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
}
