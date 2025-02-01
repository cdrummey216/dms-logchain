const logchainController = require('./src/controllers/logchain');
const express = require('express');
const bodyParser = require('body-parser');
const NodeCache = require('node-cache');
const url = process.env.URL || '0.0.0.0';
const port = process.env.PORT || 4000;
const fs = require('fs');

const thisCache = new NodeCache();
process.on('SIGINT', () => {
    const cacheData = JSON.stringify(thisCache.data);
    fs.writeFileSync('cache.json', cacheData);
    process.exit(0);
});

try {
    const cacheData = fs.readFileSync('cache.json');
    thisCache.data = JSON.parse(cacheData);
} catch(err) {
    console.log(err);
}

let app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

let listener = app.listen(port, url, function() {
    console.log('Server started at ' + listener.address().address + ':' + listener.address().port);
});

let lcontroller = new logchainController(url, port);

app.get('/cache', (req, res) => {
    const keylist = [];
    const keys = thisCache.keys();
    const now = Math.floor(+new Date() / 1000);
    keys.forEach( (key) => {
          var cachedStamp = thisCache.get(key);
          var diff = Math.abs(now - cachedStamp);
          var seconds = Math.floor(diff / 1000);
          var minutes = Math.floor(seconds / 60);
          var hours = Math.floor(minutes / 60);
          var days = Math.floor(hours / 24);
          var payload = {
            lastUuid: key,
            lastSeen: days + " days ago"
          };
          if (key !== "10000000-1000-4000-8000-100000000000") {
              keylist.push(payload);
            }
        });
    var response = {
        count: (thisCache.keys().length - 1),
        status: "running",
        keys: keylist
      };
    res.send(response);
});
app.get('/lode/:olduuid/:timestamp/:newuuid', (req, res) => {
  const now = Math.floor(+new Date() / 1000);
  const newkey = req.params.newuuid;
  const oldkey = req.params.olduuid;
  const timestamp = req.params.timestamp;
  const currentURL = url + ':' + port;
  
  if (thisCache.keys().length === 0) {
        thisCache.set("10000000-1000-4000-8000-100000000000", timestamp, 1209600);
  }
  
  if (thisCache.has(oldkey)) {
    if (oldkey.includes("10000000-1000-4000-8000-100000000000")) {
      thisCache.set(oldkey, timestamp, 1209600);
    }
    else {
      thisCache.del(oldkey);
    }
  }
  
  thisCache.set(newkey, timestamp, 1209600);
    
  const keys = thisCache.keys();
  const postEntryUrl = "http://" + currentURL + "/entry";
  keys.forEach( (key) => {
          var cachedStamp = thisCache.get(key);
          //console.log(cachedStamp);
          var diff = Math.abs(now - cachedStamp);
          //console.log(diff);
          var seconds = Math.floor(diff / 1000);
          //console.log(seconds);
          var minutes = Math.floor(seconds / 60);
          //console.log(minutes);
          var hours = Math.floor(minutes / 60);
          //console.log(hours);
          var days = Math.floor(hours / 24);
          //console.log(days);
          var payload = {
            lastUuid: key,
            lastLog: -1,
            status: "dead",
            fortune: "veritatem iterum",
          };

          if (days < 7) {
            console.log("last sign of life for " +key+ " was " +days+ " days ago." );
          }
          else {
            (async () => {
                var rawResponse = await fetch(postEntryUrl, {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(payload)
                });
                console.log("logged dead entry for " + key);
                thisCache.del(key);
                console.log("removed " + key +" from cache");
              })();
            };
        });
        res.send(JSON.stringify(newkey));
        //res.end();
});
app.get('/resolve', lcontroller.resolve.bind(lcontroller));
app.get('/nodes', lcontroller.getNodes.bind(lcontroller));
app.post('/entry', lcontroller.postEntry.bind(lcontroller));
app.get('/entries', lcontroller.getEntries.bind(lcontroller));
app.get('/mine', lcontroller.mine.bind(lcontroller));
app.get('/logchain/last-index', lcontroller.getLogLastIndex.bind(lcontroller));
app.get('/logchain/:idx', lcontroller.getLogByIndex.bind(lcontroller));
app.get('/logchain', lcontroller.getLogchain.bind(lcontroller));
app.get('/logchain/entry/:uuid', lcontroller.getEntryByUuid.bind(lcontroller));
app.get('/logchain/strata/:uuid', lcontroller.getStrata.bind(lcontroller));
app.get('/logchain/trace/strata/:uuid', lcontroller.traceStrata.bind(lcontroller));
app.get('/logchain/log/:uuid', lcontroller.getLogIdxByUuid.bind(lcontroller));
app.get('/logchain/last/:uuid', lcontroller.getLastTimestampByUuid.bind(lcontroller));
app.get('/logchain/subsequence/:uuid', lcontroller.getSubsequence.bind(lcontroller));
app.get('/logchain/trace/subsequence/:uuid', lcontroller.traceSubsequence.bind(lcontroller));
app.get('/latestlog', lcontroller.getLastLog.bind(lcontroller));
