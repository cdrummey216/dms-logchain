class Log {
    constructor() {
        this.index = 0;
        this.previousHash = '';
        this.hash = '';
        this.timestamp = Math.floor(+new Date() / 1000);
        this.nonce = 0;
        this.entries = [];
    }

    get key() {
        return JSON.stringify(this.entries) + this.index + this.previousHash + this.nonce;
    }

    addEntries(entries) {
        entries.list.forEach(entry => {
            this.entries.push(entry);
        });
        entries.reset();
    }

}

module.exports = Log;