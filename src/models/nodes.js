//import fetch from 'node-fetch';
//const fetch = require('node-fetch');
let fetch;
(async () => {
    fetch = (await import('node-fetch')).default;
})();
const Logchain = require('./logchain');

class Nodes {
    constructor(url, port) {
        const nodes = require(process.env.NODE_ENV=='production' ? '../../config/nodes.prod.json' : '../../config/nodes.current.json');
        const currentURL = url + ':' + port;
        this.list = [];

        for(let i in nodes)
            if (nodes[i].indexOf(currentURL) == -1)
                this.list.push(nodes[i]);
    }
    
    resolve(res, logchain) {
        let completed = 0;
        let nNodes = this.list.length;
        let response = [];
        let errorCount = 0;
        const uniqueArray = [];
        const seenObjects = new Set();
        var counter = 0;
        this.list.forEach(function(node) {
            fetch(node + '/logchain')
                .then(function(resp) {
                    return resp.json();
                })
                .then(function(respLogchain) {                    
                    
                    for (const obj of respLogchain) {
                        const stringifiedObj = JSON.stringify(obj);
                        //obj["hash"] = "test";
                        if (!seenObjects.has(stringifiedObj)) {                            
                            if (obj["previousHash"] == "0000000000000000") {
                                if (counter == 0) {
                                    uniqueArray.push(obj);
                                    seenObjects.add(stringifiedObj);
                                    console.log("previousHash counter: " + counter); 
                                }
                            }
                            else {
                                uniqueArray.push(obj);
                                seenObjects.add(stringifiedObj);
                                console.log("obj.hash: " + counter +" "+ JSON.stringify(obj["hash"]));
                            }
                            //uniqueArray.push(obj);
                            //seenObjects.add(stringifiedObj);
                            //console.log("obj.hash: " + counter +" "+ JSON.stringify(obj["hash"]));
                        }
                        counter++;
                    }
                    //console.log("uniqueArray "+JSON.stringify(uniqueArray));
                    uniqueArray.sort((a, b) => {
                    //console.log("a.index "+a.index);
                        const indexA = a.index;
                        const indexB = b.index;
                        
                        if (indexA == indexB) {
                            console.log("indexA == indexB "+a.hash);
                            const mergedObject = a.entries.concat(b.entries);
                            console.log("a.entries " + JSON.stringify(a.entries));
                            console.log("b.entries " + JSON.stringify(b.entries));
                            console.log("Merged a.entries and b.entries" + JSON.stringify(mergedObject));
                            a.entries = mergedObject;
                            return 1;
                        }
                        if (indexA < indexB) {
                            return -1;
                        }
                        if (indexA > indexB) {
                            return 1;
                        }
                        
                        return 0;
                    });
                    //let uniqueSortedArr = [...new Set(uniqueArray)];
                    if (logchain.logs.length < uniqueArray.length) {//new entries
                        logchain.updateLogs(uniqueArray);
                        response.push({synced: node});
                        console.log("logchain.logs.length: " + logchain.logs.length);
                        console.log("uniqueArray.length: " + uniqueArray.length);
                    } else {
                        response.push({noaction: node});
                    }
                    
                    if (++completed == nNodes) {
                        if (errorCount == nNodes)
                            res.status(500);
                        res.send(response);
                    }
                })
                .catch(function(error) { 
                    ++errorCount;
                    //response.push({error: 'Failed to reach node at ' + node})
                    response.push({error: error.message})
                    if (++completed == nNodes) {
                        if (errorCount == nNodes)
                            res.status(500);
                        res.send(response);
                    }
                });
        });
    }

    addUniqueObjects(array) {
      const uniqueArray = [];
      const seenObjects = new Set();
    
      for (const obj of array) {
        const stringifiedObj = JSON.stringify(obj);
    
        if (!seenObjects.has(stringifiedObj)) {
          uniqueArray.push(obj);
          seenObjects.add(stringifiedObj);
        }
      }
    
      return uniqueArray;
    }
    
    broadcast() {
        this.list.forEach(function(node) {
            fetch(node + '/resolve')
                .then(function(resp) {
                    return resp.json();
                })
                .then(function(resp) {
                    console.log(node, resp)
                })
                .catch(function(error) { 
                    console.log(node, error);
                });
        });
    }
}

module.exports = Nodes;
