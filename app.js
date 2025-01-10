const logchainController = require('./src/controllers/logchain');
const express = require('express');
const bodyParser = require('body-parser');
const NodeCache = require('node-cache');
const url = process.env.URL || '0.0.0.0';
const port = process.env.PORT || 4000;

let app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

let listener = app.listen(port, url, function() {
    console.log('Server started at ' + listener.address().address + ':' + listener.address().port);
});


// API

let lcontroller = new logchainController(url, port);

const thisCache = new NodeCache();
app.get('/cache', (req, res) => {
res.send("total uids: " + (thisCache.keys().length - 1));
});
app.get('/lode/:oldguid/:timestamp/:newguid', (req, res) => {
  const now = Math.floor(+new Date() / 1000);
  const newkey = req.params.newguid;
  const oldkey = req.params.oldguid;
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
          var diff = Math.abs(now - cachedStamp);
          var seconds = Math.floor(diff / 1000);
          var minutes = Math.floor(seconds / 60);
          var hours = Math.floor(minutes / 60);
          var days = Math.floor(hours / 24);
          var payload = {
            lastGuid: key,
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
app.get('/logchain/entry/:guid', lcontroller.getEntryByGuid.bind(lcontroller));
app.get('/logchain/history/:guid', lcontroller.getHistory.bind(lcontroller));
app.get('/logchain/log/:guid', lcontroller.getLogIdxByGuid.bind(lcontroller));
app.get('/logchain/lastLog/:guid', lcontroller.getLastTimestampByGuid.bind(lcontroller));
