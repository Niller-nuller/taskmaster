const crypto = require('crypto');

async function createTaskId(){
    return crypto.randomUUID({disableEntropyCache : true});
}

module.exports = createTaskId();

