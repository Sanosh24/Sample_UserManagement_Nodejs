const mongoose = require('mongoose');

module.exports = {
    init(dbname) {
        return new Promise(resolve => {
            mongoose.connect(`mongodb://localhost/${dbname}`, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useCreateIndex: true,
                useUnifiedTopology: true
            })
                .then(() => {
                    console.log(`Database has been connected to ${dbname}`);
                    return resolve({ status: true });
                }, err => {
                    console.error('Mongoose connection error:', err);
                    return resolve({ status: false });
                });
        });
    }
};