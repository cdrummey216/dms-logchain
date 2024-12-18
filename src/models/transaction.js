class Transaction {
    constructor(from, to, amount, fortune) {
        if (!from || !to || isNaN(amount))
            throw new Error('Invalid data');

        this.from = from;
        this.to = to;
        this.amount = amount;
        this.timestamp = Math.floor(+new Date() / 1000);
        this.fortune = fortune;
    }
}

module.exports = Transaction;