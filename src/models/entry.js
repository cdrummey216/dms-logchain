const crypto = require('crypto');
class Entry {
    constructor(lastGuid, status, fortune) {
        if (!lastGuid || !status || !fortune)
            throw new Error('Invalid data');

        this.guid = ;
        this.lastGuid = lastGuid;
        this.status = status;
        this.timestamp = Math.floor(+new Date() / 1000);
        this.fortune = fortune;
    }
}

module.exports = Entry;