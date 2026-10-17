async function loadTasks() {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    document.getElementById('tasklist');
}

loadTasks();