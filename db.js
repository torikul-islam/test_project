const config = require('config');
const mongoose = require('mongoose')



class Database {
    options = {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    }

    constructor() {
        this._connect();
    }


    async _connect() {
        try {
            await mongoose
                .connect(config.get('uri'), this.options);

            console.log(`mongodb connected to ${process.env.NODE_ENV} environment`);
        } catch (ex) {
            console.error(`failed to established connection with mongodb:`, ex.message)
        }
    }
}


module.exports = new Database();