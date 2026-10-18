const fs = require('node:fs/promises');
const fse = require('fs-extra');
const path = require('path');
const currentDataPath = path.join(__dirname, '../data/tasks.json');
const reader = require('./reader.js');
const createId = require('./createId');

async function writeTasks(tasks) {
    await fse.writeJson(currentDataPath, tasks, { spaces: 2 });
}

module.exports = {writeTasks, deleteTask}


async function deleteTask(taskId){
    try{
        let data = [];
        data = await reader;

let indexToDelete = data.findIndex(Tasks => Tasks.id === taskId);

if (indexToDelete === -1){
    return 'failed'
}

data.splice(indexToDelete, 1);
await fs.writeFile(currentDataPath, JSON.stringify(data, null, 2));
return 'success'; } catch (e){
        throw e;
    }
}
