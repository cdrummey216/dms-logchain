//const blockchainController = require('./src/controllers/blockchain');
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
//let controller = new blockchainController(url, port);
//app.get('/resolve', controller.resolve.bind(controller));
//app.get('/nodes', controller.getNodes.bind(controller));
//app.post('/transaction', controller.postTransaction.bind(controller));
//app.get('/transactions', controller.getTransactions.bind(controller));
//app.get('/mine', controller.mine.bind(controller));
//app.get('/blockchain/last-index', controller.getBlockLastIndex.bind(controller));
//app.get('/blockchain/:idx', controller.getBlockByIndex.bind(controller));
//app.get('/blockchain', controller.getBlockchain.bind(controller));

let lcontroller = new logchainController(url, port);

const thisCache = new NodeCache();
app.get('/lode/:oldguid/:timestamp/:newguid', (req, res) => {
  const now = Math.floor(+new Date() / 1000);
  const newkey = req.params.newguid;
  const oldkey = req.params.oldguid;
  const timestamp = req.params.timestamp;
  const currentURL = url + ':' + port;
  
  if (thisCache.has(oldkey)) {
    thisCache.del(oldkey);
  }  
  thisCache.set(newkey, timestamp, 604800);

  const keys = thisCache.keys();
  const postEntryUrl = "http://" + currentURL + "/entry";
  console.log(keys);
  for (const key of keys) {
      const cachedStamp = thisCache.get(key);
      const diff = Math.abs(now - cachedStamp);
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const payload = {
        lastGuid: key,
        lastLog: -1,
        status: "dead",
        fortune: "veritatem iterum"
      };
     
      
      if (days >= 7) {
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
        //console.log(guid);
      })();
    }
  }  
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
