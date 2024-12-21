const crypto = require('crypto');
class Entry {
    constructor(lastGuid, status, fortune) {
        if (!lastGuid || !status || !fortune)
            throw new Error('Invalid data');

        this.guid = crypto.randomUUID();
        this.lastGuid = lastGuid;
        this.lastBlock = 1;
        this.status = status;
        this.fortune = fortune;
        this.timestamp = Math.floor(+new Date() / 1000);
    }
}

module.exports = Entry;