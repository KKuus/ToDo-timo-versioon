var jwt = localStorage.getItem("jwt");
if (jwt == null) {
    window.location.href = './login.html'
}
let listContainer = document.getElementById('list-container');
let inputBox = document.getElementById('input-box');
let i = 0;
let tasks = []
if (tasks !== null ){localStorage.removeItem('data')}

async function logTasks() {
    const response = await fetch('https://demo2.z-bit.ee/tasks', {
        method: 'GET',
        headers: {
            'Authorization': "Bearer " + jwt,
        },
    });
    tasks = await response.json();

  
    //localStorage.removeItem('data');
    listContainer.innerHTML = '';


    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `${task.title}<span>×</span>`;
        li.dataset.taskId = task.id;  
        listContainer.appendChild(li);
    });
}


logTasks()


function logout() {
    localStorage.removeItem("jwt");
    window.location.href = './login.html'
}



function addTask() {
    if (inputBox.value === '') {
        alert('Nothing? Really?');
    } else {
        submitTask(inputBox.value);
    }
    inputBox.value = '';
}


function submitTask(title) {
    fetch('https://demo2.z-bit.ee/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt
        },
        body: JSON.stringify({ title: title })
    })
    .then(response => response.json())
    .then(task => {

        const li = document.createElement('li');
        li.innerHTML = `${task.title}<span>×</span>`;
        li.dataset.taskId = task.id;  
        listContainer.appendChild(li);
    })
    .catch(error => {
        console.error('Error adding task:', error);
    });
}


listContainer.addEventListener('click', function (e) {
    if (e.target.tagName === 'LI') {
        e.target.classList.toggle('checked');
        saveData();
    } else if (e.target.tagName === 'SPAN') {
        const taskItem = e.target.parentElement;
        const taskId = taskItem.dataset.taskId;
        
        taskItem.remove();
        
        saveData();
        
        removeTask(taskId);
    }
}, false);


function removeTask(taskId) {
    fetch(`https://demo2.z-bit.ee/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + jwt
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('Task deleted successfully');
        } else {
            console.error('Error deleting task:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Error deleting task:', error);
    });
}



// SEE ON STICKY NOTEI OSA, KASUTAB LOCAL STORAGEIT

function saveData() {
    localStorage.setItem('data', listContainer.innerHTML);
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem('data');
}

showTask();

let createbox = document.querySelector('.createbox');
let notesContainer = document.querySelector('.notes');
let input = document.getElementById('UserInput');

window.addEventListener('load', function () {
    let storedNotes = JSON.parse(localStorage.getItem('stickyNotes')) || [];
    storedNotes.forEach(function (noteData) {
        createSticky(noteData.text);
        let lastCreatedNote = notesContainer.lastChild;
        lastCreatedNote.style.top = noteData.position.top;
        lastCreatedNote.style.left = noteData.position.left;
    });
});

createbox.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
        addSticky();
    }
});

document.getElementById('create-note-btn').addEventListener('click', function () {
    createbox.style.display = 'block';
});

function addSticky() {
    let text = input.value.trim();
    if (text !== '') {
        let div = createSticky(text);
        input.value = '';
        createbox.style.display = 'none';
        saveToLocalStorage();
    }
}

function createSticky(text) {
    const marginTop = notesContainer.children.length * 50 + 'px';

    let div = document.createElement('div');
    div.className = 'note';
    div.innerText = text;
    div.style = `background: ${color()}; top: ${marginTop};`;
    div.draggable = true;

    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

    div.onmousedown = function onMouseDown(e) {
        e.preventDefault();

        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = function onMouseUp() {
            document.onmouseup = null;
            document.onmousemove = null;
            saveToLocalStorage();
        };

        document.onmousemove = function onMouseMove(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            div.style.top = `${div.offsetTop - pos2}px`;
            div.style.left = `${div.offsetLeft - pos1}px`;
        };
    };

    div.addEventListener('dblclick', function () {
        div.remove();
        removeNoteFromLocalStorage(text);
    });

    notesContainer.appendChild(div);
    return div;
}

function saveToLocalStorage() {
    let storedNotes = [];

    notesContainer.querySelectorAll('.note').forEach((note) => {
        let noteText = note.innerText;
        let notePosition = {
            top: note.style.top,
            left: note.style.left,
        };
        storedNotes.push({ text: noteText, position: notePosition });
    });

    localStorage.setItem('stickyNotes', JSON.stringify(storedNotes));
}

function removeNoteFromLocalStorage(text) {
    let storedNotes = JSON.parse(localStorage.getItem('stickyNotes')) || [];
    let index = storedNotes.findIndex((note) => note.text === text);
    if (index > -1) {
        storedNotes.splice(index, 1);
        localStorage.setItem('stickyNotes', JSON.stringify(storedNotes));
    }
}

function color() {
    let randomColors = ['#B5C0D0', '#CCD3CA', '#F5E8DD', '#EED3D9'];
    if (i > randomColors.length - 1) {
        i = 0;
    }
    return randomColors[i++];
}


