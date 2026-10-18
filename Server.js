const express = require('express');
const app = express();
const {writeFile, deleteTask, writeTasks} = require('./utils/writer');
const jsonReader = require('./utils/reader.js');
const path = require('path');

const TYPES = ['opgave', 'bug', 'feature']

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.status(200).send('server is running')
})

app.get('/api/tasks', async (req, res) => {
    try{
        res.status(200).json(await jsonReader.readTasks())
    } catch (err) {
        console.error('GET /api/tasks fejlede', err);
        res.status(500).json({error: 'kunne ikke læse opgaver'})
    }
});


app.post('/api/tasks', async (req, res) => {
    try {
        const text = typeof req.body.text === 'string' ? req.body.text.trim() : '';
        if(!text) {
            return res.status(400).json({error: 'opgaven skal have en tekst'})
        }

        const task = {
            id: crypto.randomUUID(),
            text,
            type: TYPES.includes(req.body.type) ? req.body.type : 'opgave',
            status: 'åben'
        }

        const tasks = await jsonReader.readTasks();
        tasks.push(task)
        await writeTasks(tasks)

        console.log('Tilføjet', task)
        res.status(201).json({task})
    } catch (err) {
        console.error('POST /api/tasks fejlede', err);
        res.status(500).json({err:'kunne ikke gemme opgaven'})
    }
});

app.delete('/api/tasks/:id', async (req, res) => {

    try {
        const tasks = await jsonReader.readTasks();
        const remaining = tasks.filter((t) => t.id !== req.params.id);

        if (remaining.length === tasks.length) {
            return res.status(404).json({ error: 'Opgaven findes ikke' })
        }
        await writeTasks(remaining)
        console.log('slettet:', req.params.id)
        res.json({ deleted: req.params.id })
    } catch (err) {
        console.error('DELETE /api/tasks fejlede', err);
        res.status(500).json({ error: 'kunne ikke slette opgaven'})
    }
})

app.listen(3000, () => {
    console.log(`Server started on port 3000!`)
});