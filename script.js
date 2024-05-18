// script.js
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');
    const clearAllButton = document.getElementById('clear-all-button');
    let editMode = false;
    let taskToEdit = null;

    addTaskButton.addEventListener('click', addOrEditTask);
    taskList.addEventListener('click', handleTaskAction);
    clearAllButton.addEventListener('click', clearAllTasks);

    loadTasksFromLocalStorage();

    function addOrEditTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            if (editMode) {
                taskToEdit.querySelector('span').textContent = taskText;
                editMode = false;
                taskToEdit = null;
                addTaskButton.textContent = 'Add Task';
            } else {
                const li = document.createElement('li');
                li.innerHTML = `
                    <input type="checkbox" class="complete-task">
                    <span>${taskText}</span>
                    <div>
                        <button class="edit-task">Edit</button>
                        <button class="delete-task">Delete</button>
                    </div>
                `;
                taskList.appendChild(li);
            }
            taskInput.value = "";
            saveTasksToLocalStorage();
        }
    }

    function handleTaskAction(event) {
        if (event.target.classList.contains('delete-task')) {
            const li = event.target.closest('li');
            taskList.removeChild(li);
        } else if (event.target.classList.contains('edit-task')) {
            const li = event.target.closest('li');
            taskInput.value = li.querySelector('span').textContent;
            editMode = true;
            taskToEdit = li;
            addTaskButton.textContent = 'Save Task';
        } else if (event.target.classList.contains('complete-task')) {
            const li = event.target.closest('li');
            li.classList.toggle('completed');
        }
        saveTasksToLocalStorage();
    }

    function clearAllTasks() {
        taskList.innerHTML = '';
        saveTasksToLocalStorage();
    }

    function saveTasksToLocalStorage() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" class="complete-task" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
                <div>
                    <button class="edit-task">Edit</button>
                    <button class="delete-task">Delete</button>
                </div>
            `;
            if (task.completed) {
                li.classList.add('completed');
            }
            taskList.appendChild(li);
        });
    }
});
