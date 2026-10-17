const fs = require('node:fs/promises');
const path = require('path');
const currentDataPath = path.join(__dirname, '../data/tasks.json');


async function readCurrentData(){
    try {
    const tasks = await fs.readFile(currentDataPath, 'utf8');
    return JSON.parse(tasks);
    }catch(error){
        console.error('Error while reading from json data task file');
        throw error;
    }
}

async function readTasksForTaskSystem(){
    try {
        const tasks = await fs.readFile(currentDataPath, 'utf8');
        return tasks.trim() ? JSON.parse(tasks) : [];
    }catch(error){
        console.error('Error while reading from json data task file');
        throw error;
    }
}

module.exports = {readCurrentData,
readTasksForTaskSystem}