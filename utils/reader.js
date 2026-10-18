const fs = require('node:fs/promises');
const fse = require('fs-extra');
const path = require('path');
const currentDataPath = path.join(__dirname, '../data/tasks.json');

async function readTasks() {
    await fse.ensureFile(currentDataPath)
    const raw = await fs.readFile(currentDataPath, 'utf-8')
    if (!raw.trim()) return [];
    try {
        return JSON.parse(raw);
    } catch (err) {
        console.error('tasks.json er ikke gyldig JSON:'. err.message);
        return [];
    }
}

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
readTasksForTaskSystem,
readTasks}