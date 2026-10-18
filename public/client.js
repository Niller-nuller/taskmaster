const form = document.getElementById('task-form')
const input = document.getElementById('task-input')
const typeSelect = document.getElementById('task-type')
const list = document.getElementById('task-list')
const count = document.getElementById('count')
const msg = document.getElementById('msg')

const EMOJI = { opgave: '📌', bug: '🐞', feature: '✨'}
const LABEL = { opgave: 'Opgave', bug: 'Bug', feature: 'Feature' }

function showError(text) {
    msg.textContent = text || '';
}

async function loadTasks() {
    try {
        const res = await fetch('/api/tasks')
        if (!res.ok) throw new Error ('Serveren svarede ' + res.status)
        const tasks = await res.json()
        console.log('Hentede opgaver:', tasks)
        render(tasks)
        showError('')
    } catch (err) {
        console.error(err)
        showError('Kunne ikke hente opgave. Kører serveren')
    }
}

function render(tasks) {
    list.innerHTML = '';
    count.textContent = tasks.length + (tasks.length === 1 ? ' opgave' : ' opgaver')


    if (tasks.length === 0) {
        const empty = document.createElement('li')
        empty.textContent = 'ingen opgaver endnu, Skriv den første overfor.'
        list.appendChild(empty)
        return;
    }

    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.textContent = (EMOJI[task.type] || '📌') + ' ' + task.text + ' ';

        const del = document.createElement('button')
        del.type = 'button'
        del.textContent = '🗑️ Slet'
        del.addEventListener('click', () => deleteTask(task.id))

        li.append(del);
        list.appendChild(li)
    });

}
form.addEventListener('submit',async (e) => {
    e.preventDefault()
    const text = input.value.trim()
    if (!text) {
        showError('Skriv en tekst først')
        return
    }
    try {
        const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ text, type: typeSelect.value }),
        })
        if (!res.ok) throw new Error ('Serveren svarede ' + res.status)
        input.value = ''
        input.focus()
        await loadTasks()
    } catch (err) {
        console.error(err)
        showError('Kunne ikke tilføje opgaven')
    }
})

async function deleteTask(id) {
    try {
        const res = await fetch('/api/tasks/' + id, { method: 'DELETE' })
        if (!res.ok) throw new Error ('Serveren svarede ' + res.status)
        await loadTasks()
    } catch (err) {
        console.error(err)
        showError('Kunne ikke slette opgaven. ')
    }
}
loadTasks()