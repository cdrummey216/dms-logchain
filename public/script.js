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
      //console.log(match[2]);
      return match[2];
    }
 };
 function setInputValue1() {
 console.log("guidcookie");
  const lastGuidCookie = getCookieValue('lastGuid');
  document.getElementById("currentAccount").innerHTML = lastGuidCookie;
}
function setInputValue2() {
  const lastGuidCookie = getCookieValue('lastGuid');
  document.getElementById("lastGuid").value = lastGuidCookie;
};
function addEntry(){
  const lastGuidi = document.getElementById("lastGuid").value;
  console.log(lastGuidi);
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
  console.log(postEntryUrl);
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
    console.log(guid);
    const fileNamei = Math.floor(+new Date() / 1000);
    const fileNameii = fileNamei + ".txt";
    setCookie('lastGuid', guid, 7);
    //setCookie('key', fileNameii, 7);
    setCookie('timestamp', fileNamei, 7);
    createAndDownloadFile(fileNameii, guid);
    updateCache(lastGuidi, fileNamei, guid);
    console.log(guid);
  })();
};

function createAndDownloadFile(fileName, content) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
function updateCache(oldguid, timestamp, newguid) {
  var updateCacheUrl = window.location.origin + "/lode/" + oldguid + "/" + timestamp + "/" + newguid;
  console.log(updateCacheUrl);
  fetch(updateCacheUrl)
    .then(response => response.json())
    .then(data => {
      console.log("Cache Updated for  guid: " + newguid);
    })
    .catch(error => console.error('Error fetching data:', error));
};
function findLogIdx(guid) {
  var lastGuid = guid;
  var lastLog = document.getElementById("lastLog").value;
  var findLogIdxUrl = window.location.origin + "/logchain/log/" + lastGuid;
  console.log(findLogIdxUrl);
  fetch(findLogIdxUrl)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        console.log("lastLog");
      setCookie('lastLog', JSON.stringify(data), 7);                      
      document.getElementById("lastLog").value = data;
    })
    .catch(error => console.error('Error fetching data:', error));
};
function mineEntries() {
  var mineEntriesUrl = window.location.origin + "/mine";
  console.log(mineEntriesUrl);
  fetch(mineEntriesUrl)
    .then(response => response.json())
    .then(data => {
      const table = document.getElementById('thisTable');
      const tbody = table.getElementsByTagName('tbody')[0];
      console.log(data.entries);
      data.entries.forEach(item => {
        const row = tbody.insertRow();
        Object.values(item).forEach(value => {
          const cell = row.insertCell();
          cell.textContent = value;
        });
      });
    })
    .catch(error => console.error('Error fetching data:', error));
}

function lodeEntries() {
    const lastGuidCookie = getCookieValue('lastGuid');
    const timestampCookie = getCookieValue('timestamp');
      var updateCacheUrl = window.location.origin + "/lode/10000000-1000-4000-8000-100000000000/" + timestampCookie + "/" + lastGuidCookie;
      console.log(updateCacheUrl);
      fetch(updateCacheUrl)
        .then(response => response.json())
        .then(data => {
          console.log("Cache Updated for  guid: " + newguid);
        })
        .catch(error => console.error('Error fetching data:', error));
};
function findHistory() {
  var lastGuid = document.getElementById("lastGuid").value;
  var lastLog = document.getElementById("lastLog").value;
  var findHistoryUrl = window.location.origin + "/logchain/history/" + lastGuid;
  console.log(findHistoryUrl);
  fetch(findHistoryUrl)
    .then(response => response.json())
    .then(data => {
      const table = document.getElementById('thisTable');
      const tbody = table.getElementsByTagName('tbody')[0];

      data.forEach(item => {
        const row = tbody.insertRow();
        Object.values(item).forEach(value => {
          const cell = row.insertCell();
          cell.textContent = value;
        });
      });
    })
    .catch(error => console.error('Error fetching data:', error));
}
function findEntry() {
  var lastGuid = document.getElementById("lastGuid").value;
  var lastLog = document.getElementById("lastLog").value;
  var findEntryUrl = window.location.origin + "/logchain/entry/" + lastGuid;
  console.log(findEntryUrl);
  fetch(findEntryUrl)
    .then(response => response.json())
    .then(data => {
      const table = document.getElementById('thisTable');
      const tbody = table.getElementsByTagName('tbody')[0];

      data.forEach(item => {
        const row = tbody.insertRow();
        Object.values(item).forEach(value => {
          const cell = row.insertCell();
          cell.textContent = value;
        });
      });
    })
    .catch(error => console.error('Error fetching data:', error));
}
