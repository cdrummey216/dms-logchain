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
  const lastUuidCookie = getCookieValue('lastUuid');
  document.getElementById("currentUid").innerHTML = lastUuidCookie;

};
function setInputValue2() {
  const lastUuidCookie = getCookieValue('lastUuid');
  document.getElementById("lastUuid").value = lastUuidCookie;
};
function setInputValue3() {
  const lastUuidCookie = "10000000-1000-4000-8000-100000000000";
  document.getElementById("lastUuid").value = lastUuidCookie;
  document.getElementById("lastLog").value = 0;
};
function addEntry(){
  const lastUuidi = getCookieValue('lastUuid');
  const lastLogi = JSON.stringify(getCookieValue('lastLog'));
  const statusi = document.getElementById("status").value;
  const fortunei = document.getElementById("fortune").value;
  const postEntryUrl = window.location.origin + "/entry";
  const payload = {
    lastUuid: lastUuidi,
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
    const uuid = contentii.replace(/"/g, '');
    const fileNamei = Math.floor(+new Date() / 1000);
    const fileNameii = fileNamei + ".txt";
    setCookie('lastUuid', uuid, 14);
    setCookie('timestamp', fileNamei, 14);
    createAndDownloadFile(fileNameii, uuid);
    updateCache(lastUuidi, fileNamei, uuid);
  })();
};
function spawnUuid(){
  const lastUuidi = "10000000-1000-4000-8000-100000000000";
  const lastLogi = 0;
  const statusi = "alive";
  const fortunei = "qwerty";
  const postEntryUrl = window.location.origin + "/entry";
  const payload = {
    lastUuid: lastUuidi,
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

  })();
};
function checkin(){
  const lastUuidi = getCookieValue('lastUuid');
  const lastLogi = JSON.stringify(getCookieValue('lastLog'));
  const statusi = "alive";
  const fortunei = "checking in";
  const postEntryUrl = window.location.origin + "/entry";
  const payload = {
    lastUuid: lastUuidi,
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
    const uuid = contentii.replace(/"/g, '');
    const fileNamei = Math.floor(+new Date() / 1000);
    const fileNameii = fileNamei + ".txt";
    var output = document.getElementById("logoutput");
    const item = document.createElement("span");
    item.innerHTML = '%> checkin entry successfully logged';
    output.appendChild(item);
    setCookie('lastUuid', uuid, 14);
    setCookie('timestamp', fileNamei, 14);
    updateCache(lastUuidi, fileNamei, uuid);
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
function updateCache(olduuid, timestamp, newuuid) {
  var updateCacheUrl = window.location.origin + "/lode/" + olduuid + "/" + timestamp + "/" + newuuid;
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
function findLogIdx(uuid) {
  var lastUuid = uuid;
  var findLogIdxUrl = window.location.origin + "/logchain/log/" + lastUuid;
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
        const lastUuidCookie = getCookieValue('lastUuid');
        findLogIdx(lastUuidCookie);
    })
    .catch(error => console.error('Error fetching data:', error));
};
function lodeUIDs() {
    const lastUuidCookie = getCookieValue('lastUuid');
    const timestampCookie = getCookieValue('timestamp');
      var updateCacheUrl = window.location.origin + "/lode/10000000-1000-4000-8000-100000000000/" + timestampCookie + "/" + lastUuidCookie;
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
function findHistory(uuid) {
  var lastUuid = uuid;
  var findHistoryUrl = window.location.origin + "/logchain/strata/" + lastUuid;
  clearTable("thisTable");
  fetch(findHistoryUrl)
    .then(response => response.json())
    .then(data => {
      const table = document.getElementById('thisTable');
      table.style.display = "block";
      const tbody = table.getElementsByTagName('tbody')[0];

      data.forEach(item => {
        const row = tbody.insertRow();
        Object.values(item).forEach(value => {
          const cell = row.insertCell();
          if (item.timestamp == value){
            const date = new Date(value * 1000).toLocaleString("en-US");
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
function findEntry(uuid) {
  var lastUuid = uuid;
  clearTable("thisTable");
  var findEntryUrl = window.location.origin + "/logchain/entry/" + lastUuid;
  fetch(findEntryUrl)
    .then(response => response.json())
    .then(data => {
      const table = document.getElementById('thisTable');
      table.style.display = "block";
      const tbody = table.getElementsByTagName('tbody')[0];
      console.log(findEntryUrl);
      const row = tbody.insertRow();
      Object.values(data[0]).forEach(value => {
          const cell = row.insertCell();
          if (data[0].timestamp == value){
            const date = new Date(value * 1000).toLocaleString("en-US");
            cell.textContent = date;
          }
          else {
            cell.textContent = value;
          }
        });
    })
    .catch(error => console.error('Error fetching data:', error));
};
function findSubsequence(uuid) {
  var lastUuid = uuid;
  clearTable("thisTable");
  var findSubsequenceUrl = window.location.origin + "/logchain/subsequence/" + lastUuid;

  fetch(findSubsequenceUrl)
    .then(response => response.json())
    .then(data => {
      const table = document.getElementById('thisTable');
      table.style.display = "block";
      const tbody = table.getElementsByTagName('tbody')[0];

      data.forEach(item => {
        const row = tbody.insertRow();
        Object.values(item).forEach(value => {
          const cell = row.insertCell();
          if (item.timestamp == value){
            const date = new Date(value * 1000).toLocaleString("en-US");
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
    let uid = document.getElementById("lastUuid").value;
    const watchlistCookieStr = getCookieValue("watchlist");
    //console.log(window.location.pathname);
    if (watchlistCookieStr === undefined || window.location.pathname !== "/watchlist.html") {
      console.log("skipped initializing watchlist");
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
    let uid = document.getElementById("lastUuid").value;
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
    document.getElementById("lastUuid").value = "";
};
function clearTable(tableId) {
  const table = document.getElementById(tableId);
  const rows = table.getElementsByTagName("tr");
  for (let i = 1; i < rows.length; i++) {
    table.deleteRow(i);
    i--;
  }
};
function graphSubsequence(uuid) {
    var lastUuid = uuid;
    var traceUrl = "/logchain/trace/subsequence/"+ lastUuid;
    fetch(traceUrl)
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        const nodes = data.nodes;
        const links = data.links;
        forceGraph(data);
        createNodeItems(nodes);
        })
    .catch(error => console.error('Error fetching data:', error));

};

function graphStrata(uuid) {
    var lastUuid = uuid;
    var traceUrl = "/logchain/trace/strata/"+ lastUuid;
    var response1 = [];

    fetch(traceUrl)
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        const nodes = data.nodes;
        const links = data.links;
        forceGraph(data);
        addNodes(nodes);
        createNodeItems(nodes);
        })
    .catch(error => console.error('Error fetching data:', error));
};
function graphUuidNetwork(uuid) {
    var lastUuid = uuid;
    var traceUrl = "/logchain/network/"+ lastUuid;

    fetch(traceUrl)
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        const nodes = data.nodes;
        const links = data.links;
        forceGraph(data);
        addNodes(nodes);
        createNodeItems(nodes);
        })
    .catch(error => console.error('Error fetching data:', error));
};
function graphInit() {
    var rUrl = "/vis-network.min.js";
    fetch(rUrl)
    .then(response => response)
    .then(data => {
        console.log(data);
        //const js = data.body;
        //const scriptElement = document.createElement('script');
        //scriptElement.id = "1234testing";
        //scriptElement.textContent = js;
        console.log("nightvision");
        })
    .catch(error => console.error('Error fetching data:', error));
};
function forceGraph(data) {
    var nodes = new vis.DataSet(data.nodes);
    var edges = new vis.DataSet(data.links);
    var container = document.getElementById('graph');
    //console.log(data.nodes);
    //console.log(data.links);
    var data = {
        nodes: nodes,
        edges: edges
    };
      var options = {
        nodes: {
          shape: "dot",
          size: 16,
          color: "#000000"
        },
        edges: {
            width: 2,
            color: "#000000"
          },
        physics: {
          forceAtlas2Based: {
            gravitationalConstant: -26,
            centralGravity: 0.005,
            springLength: 230,
            springConstant: 0.18,
          },
          maxVelocity: 146,
          solver: "forceAtlas2Based",
          timestep: 0.35,
          stabilization: { iterations: 150 },
        },
      };
    var network = new vis.Network(container, data, options);
    network.on("click", function (props) {
        clearNodes();
        console.log(props.nodes[0]);
        var id = "node-" + props.nodes[0];
        var element = document.getElementById(id);
        element.classList.remove("hide");
    });
};
function addNodes(nodes) {
    //console.log(nodes);
    for (let i = 0; i < nodes.length; i++) {
        var id = "node-" + nodes[i].id;
        var output = document.getElementById("selectedNode");
        var item = document.createElement("div");
        item.id = id;
        item.classList.add("hide");
        item.classList.add("nodeInfo");
        output.appendChild(item);
    }
};
function clearNodes() {
    var parentElement = document.getElementById("selectedNode");
    const childElements = parentElement.querySelectorAll(".nodeInfo"); 
    childElements.forEach(element => {
      element.classList.add("hide");
    });
};
function createNodeItems(nodes) {
    var parentElement = document.getElementById("selectedNode");
    const childElements = parentElement.querySelectorAll(".nodeInfo"); 
    for (let i = 0; i < childElements.length; i++) {
        var id = "node-" + nodes[i].id;
        var output = document.getElementById(id);
        var item = document.createElement("div");
        //"<span>"++"</span>";
        item.innerHTML += "<span><strong>when: </strong>"+ nodes[i].localeDate +"</span>";
        item.innerHTML += "<span><strong>uuid: </strong>"+ nodes[i].uuid +"</span>";
        item.innerHTML += "<span><strong>status: </strong>"+ nodes[i].status +"</span>";
        item.innerHTML += "<span><strong>fortune: </strong>"+ nodes[i].fortune +"</span>";
        item.innerHTML += "<a href=/history.html?uid="+nodes[i].uuid+">view strata</a>";
        item.innerHTML += "<a href=/following.html?uid="+nodes[i].uuid+">view subsequence</a>";
        output.appendChild(item);
    }
};
document.body.innerHTML += "<div id=\"consentBox\"><img src=\"\" alt=\"Logo\"><div id=\"consentContent\"><header id=\"consentHeader\">dms-cookies</header><p>We use cookies to monitor for sign of life. The cookies are necessary for site to function and are anonymous.</p><div class=\"buttons\"><button class=\"consentButton\">Accept Cookies</button><button class=\"rejectButton\">Reject</button></div></div></div>";
const consentBox = document.getElementById("consentBox") ?? "";
let checkCookie = document.cookie.indexOf("cookieby=dms-logchain");
checkCookie !== -1 ? consentBox.classList.add("hide") : consentBox.classList.remove("hide");
//const tooltip = document.getElementById("current-uid");
//const tooltipUid = document.getElementById("currentUid");
//tooltip.addEventListener('mouseover', e => {
//  let c = document.getElementById("currentUid");
//  c !== -1 ? tooltipUid.classList.add("displaythecurrent") : tooltipUid.classList.remove("displaythecurrent");
//  c.style.opacity = 1;
//});
//tooltip.addEventListener('mouseout', e => {
 // let c = document.getElementById("currentUid");
 // c !== -1 ? tooltipUid.classList.remove("displaythecurrent") : tooltipUid.classList.add("displaythecurrent");
 // c.style.opacity = 0;
//});
const otherCheckbox = document.querySelector("#other") ?? "";
if (otherCheckbox !== "") {
    otherCheckbox.addEventListener("change", () => {
      let c = document.getElementById("currentUid");
      if (otherCheckbox.checked) {
        c.style.opacity = 1;
      } else {
        c.style.opacity = 0;
      }
    });
}

const acceptBtn = document.querySelector(".consentButton") ?? "";
if (acceptBtn !== "") {
    acceptBtn.onclick = () => {
        document.cookie = "cookieby=dms-logchain; max-age=" + 60 * 60 * 24 * 30;
        if (document.cookie) {
            consentBox.classList.add("hide");
        } else {
            alert
                ("Cookie can't be set! Please"+
                  " unblock this site from the cookie"+
                  " setting of your browser.");
        }
    };
}

const rejectBtn = document.querySelector(".rejectButton") ?? "";
if (rejectBtn !== "") {
    rejectBtn.onclick = () => {
        alert(
            "Cookies rejected. functionality will be limited.");
        consentBox.classList.add("hide");
    };
}

const mineBtn = document.getElementById("mine") ?? "";
if (mineBtn !== "") {
    mineBtn.onclick = () => {
        mineEntries();
        findLogIdx(getCookieValue('lastUuid'));
    };
}

const lodeBtn = document.getElementById("lode") ?? "";
if (lodeBtn !== "") {
    lodeBtn.onclick = () => {
      lodeUIDs();
      mineEntries();
      findLogIdx(getCookieValue('lastUuid'));
    };
}

const checkinBtn = document.getElementById("log") ?? "";
if (checkinBtn !== "") {
    checkinBtn.onclick = () => {
      findLogIdx(getCookieValue('lastUuid'));
      mineEntries();      
      checkin();
      mineEntries();
      findLogIdx(getCookieValue('lastUuid'));
    };
}

const subsequenceBtn = document.getElementById("subsequence") ?? "";
if (subsequenceBtn !== "") {
    subsequenceBtn.onclick = () => {
      findSubsequence(document.getElementById("lastUuid").value);
      graphSubsequence(document.getElementById("lastUuid").value);
    };
}

const entryBtn = document.getElementById("entry") ?? "";
if (entryBtn !== "") {
    entryBtn.onclick = () => {
        findEntry(document.getElementById("lastUuid").value);
    };
}

const historyBtn = document.getElementById("history") ?? "";
if (historyBtn !== "") {
    historyBtn.onclick = () => {
      findHistory(document.getElementById("lastUuid").value);
      graphStrata(document.getElementById("lastUuid").value);
    };
}

const lastUuidCookie = getCookieValue('lastUuid') ?? "";
const strataElement = document.getElementById("strata") ?? "";
const subsequenceElement = document.getElementById("subsequence") ?? "";
const watchlistElement = document.getElementById("watchlist") ?? "";
const newEntryElement = document.getElementById("newEntry") ?? "";
const findEntryElement = document.getElementById("findEntry") ?? "";
const currentElement = document.getElementById("current-uid") ?? "";
const graphElement = document.getElementById("graph") ?? "";
let uidCookie = document.cookie.indexOf("lastUuid") ?? "";
const uid = getParam('uid') ?? ""; 
if (uid !== "") {
    document.getElementById("lastUuid").value = uid;
}
if (uidCookie !== "" && strataElement !== "") {
    uidCookie !== -1 ? strataElement.setAttribute("href", "/history.html?uid="+lastUuidCookie) : strataElement.setAttribute("href", "#");
}
if (uidCookie !== "" && subsequenceElement !== "") {
    uidCookie !== -1 ? subsequenceElement.setAttribute("href", "/following.html?uid="+lastUuidCookie) : subsequenceElement.setAttribute("href", "#");
}
if (uidCookie !== "" && strataElement !== "") {
    uidCookie !== -1 ?  strataElement.classList.remove("hide") : watchlistElement.classList.add("hide");
}
if (uidCookie !== "" && subsequenceElement !== "") {
    uidCookie !== -1 ?  subsequenceElement.classList.remove("hide") : watchlistElement.classList.add("hide");
}
if (uidCookie !== "" && watchlistElement !== "") {
    uidCookie !== -1 ?  watchlistElement.classList.remove("hide") : watchlistElement.classList.add("hide");
}
if (uidCookie !== "" && newEntryElement !== "") {
    uidCookie !== -1 ?  newEntryElement.classList.remove("hide") : newEntryElement.classList.add("hide");
}
if (uidCookie !== "" && currentElement !== "") {
    uidCookie !== -1 ?  currentElement.classList.remove("hide") : currentElement.classList.add("hide");
}
if (uidCookie !== "" && graphElement !== "") {
    uidCookie !== -1 ?  graphElement.classList.remove("hide") : graphElement.classList.add("hide");
}
window.addEventListener('load', (event) => {
    
    if (window.location.pathname === "/watchlist.html") {
        console.log('watchlist');
        initiateWatchlist();
    }
    if (window.location.pathname === "/history.html") {
        console.log('history');
        graphStrata(uid);
    }
    if (window.location.pathname === "/following.html") {
        console.log('following');
        graphSubsequence(uid);
    }
    if (window.location.pathname === "/index.html") {
        console.log('index');
        graphUuidNetwork("10000000-1000-4000-8000-100000000000");
    }
});

findLogIdx(lastUuidCookie);
//console.log(window.location.pathname);
setCurrentUid();
