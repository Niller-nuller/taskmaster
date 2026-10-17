const express = require('express');
const app = express();
const {writeFile, deleteTask} = require('./utils/writer');
const jsonReader = require('./utils/reader.js');

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.status(200).send('server is running')
})

app.get('/api/tasks', async (req, res) => {
    try{
    const taskData = await jsonReader.readCurrentData();
    res.status(200).json(taskData)
    }catch(error){
        res.status(500).send({error: 'Could not get tasks'});
    }
});


app.post('/api/tasks', async (req, res) => {
    const { Title } = req.body ?? {};
    console.log(Title);

    if (typeof Title !== 'string') {
        return res.status(400).json({
            fejl: 'you have to send JSON with the field "Content" as text, that is not empty'
        })
    }
    try {
        await writeFile(Title);
        res.status(200).json({message: 'Successfully created task'});
    }catch (err) {
        console.log('error writing file', err);
        res.status(500).send({error: 'Could not create task'});
    }
});

app.delete('/api/tasks/:taskId', (req, res) => {

    try {
        const deleteTaskMessage = deleteTask(req.params.taskId);
        if (deleteTaskMessage === 'success') {
            res.status(200).json('task deleted');
        } else {
            res.status(500).send({error: 'could not delete task'});
        }
    }catch (e){
        res.status(500).send({error: 'could not delete task'});
        console.log(e);
    }
})

app.listen(3000, () => {
    console.log(`Server started on port 3000!`)
});