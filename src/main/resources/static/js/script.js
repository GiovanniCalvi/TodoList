const taskAddButton = document.getElementById("task-add-button");
const tasksList = document.getElementById("tasks-list");
const taskContent = document.getElementById("task-content");
const categories = document.getElementById("categories");
const taskCounter = document.getElementById("task-counter");
const spanDoneCounter = document.getElementById("done-counter");
const buttonClearAll = document.getElementById("clear-all");

const HTTP_RESPONSE_SUCCESS = 200;


let counter = 0;
let doneCounter = 0;
const REST_API_ENDPOINT = 'http://localhost:8080';
/*
    questa funzione aggiorna la select delle categorie interrogando il server attraverso ajax
    verrà invocata subito dopo il completo caricamento della pagina
*/
function updateCategoriesList() {
    //creo un oggetto di tipo XMLHttpRequest per gestire la chiamata ajax al server
    let ajaxRequest = new XMLHttpRequest();
    //gestisco l'onload: ovvero quello che succede dopo che il server mi risponde
    ajaxRequest.onload = function () {
        //mi salvo tutte le categorie ritornate dal server in una variabile denominata categories 
        //parsando il contenuto della response attreverso l'utility JSON.parse()
        let categoriesDB = [...JSON.parse(ajaxRequest.response)];
        //cicliamo ogni categoria all'interno dell'array categories
        /* con il .map
        let categoriesOption = categoriesDB.map(elem => {
            let option = document.createElement("option");
            option.innerText = elem.name;
            option.value = elem.id;
            return option;
        });
        categoriesOption.forEach(elem => {
            categories.appendChild(elem);
        });*/
        // con il .forEach
        categoriesDB.forEach(elem => {
            //creo la option
            let option = document.createElement("option");
            //setto il value e il text
            option.innerText = elem.name;
            option.value = elem.id;
            option.setAttribute("data-color", elem.color);
            //la appendo
            categories.appendChild(option);
        });
    };
    //imposto metodo e url  della request (get)
    ajaxRequest.open("GET", REST_API_ENDPOINT + '/categories');
    //la mando
    ajaxRequest.send();
}

updateCategoriesList();

function createTask(task) {
    
    const newTaskLine = document.createElement("div");
    newTaskLine.classList.add("task");
    newTaskLine.classList.add("unconfirmed");

    if (task.category) {
        newTaskLine.classList.add(task.category.color);
    }

    //creo la checkbox da aggiungere alla riga
    const newCheck = document.createElement("INPUT");
    newCheck.setAttribute("type", "checkbox");

    if (task.done) {
        newTaskLine.classList.add("task-done");
        newCheck.checked = true;
    }
    //appendo la checkbox alla riga
    newTaskLine.appendChild(newCheck);

    const newText = document.createElement("span");
    newText.classList.add("task-text");
    newText.innerHTML = task.name;
    newTaskLine.appendChild(newText);

    //creo pannello di controllo
    const btnPanel = document.createElement("div");
    btnPanel.classList.add("button-panel");

    const trash = document.createElement("button");
    trash.classList.add( "button", "trash", "red-outline");
    trash.innerHTML = "<span class='icon-bin'></span>";
    
    
    const edit = document.createElement("button");
    edit.classList.add( "button", "red-outline");
    edit.innerHTML = '<i class="fas fa-edit"></i>';
    edit.style.visibility = task.done ? 'hidden' : 'visible';
    
    btnPanel.appendChild(edit);
    btnPanel.appendChild(trash);
    newTaskLine.appendChild(btnPanel);

    // aggiungere una data nel formato d/m/Y e allinearla a destra nella riga
    const newDate = document.createElement("div");
    newDate.classList.add("task-date");
    const date = new Date(task.created);
    newDate.innerText = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    newTaskLine.appendChild(newDate);

    tasksList.appendChild(newTaskLine);
    
    taskContent.value = "";

    edit.addEventListener("click", function () {
        let input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("id", "input-edit-" + task.id);
        if (newTaskLine.classList.contains("editing")) {
            
            let inputEdit = document.getElementById("input-edit-" + task.id);

            let taskContent = {
                name: inputEdit.value
            };

            updateTask(task.id, taskContent, () => {
                //aggiorno l'attributo name del''oggetto task su cui sto lavorando
                task.name = inputEdit.value;
                //sostituisco l'input con uno span contenente il testo aggiornato
                newText.innerText = task.name;
                //sostituisco il dischetto con la pennina
                edit.innerHTML = '<i class="fas fa-edit"></i>';
                //rimuovo la classe editing
                newTaskLine.classList.remove("editing");
                newCheck.style.visibility = 'visible';
            });

        } else {
            //aggiungo una classe editing
            newTaskLine.classList.add("editing");
            //sostituisco lo span con l'imput
            input.value = newText.textContent;
            newText.innerHTML = "";
            //sostituisco l pennetta col dischetto
            edit.innerHTML = '<i class="fas fa-save"></i>';
            newText.appendChild(input);
            newCheck.style.visibility = 'hidden';
        }

    });

    trash.addEventListener("click", function () {
        deleteTask(task.id, newTaskLine);
    });
    newCheck.addEventListener("click", function () {
        task.done = !task.done;
        let taskContent = {
            done: task.done,
            name: task.name
        };
        setDone(task.id, taskContent, () => {
            newTaskLine.classList.toggle("task-done");
            spanDoneCounter.innerHTML = task.done ? ++doneCounter : --doneCounter;
            edit.style.visibility = task.done ? 'hidden' : 'visible';
        });
    });
    if (task.done) {
        doneCounter++
    }
    counter ++;
    taskCounter.innerHTML = counter;
    spanDoneCounter.innerHTML = doneCounter;
}


function deleteTask(taskId, taskHtmlElement) {
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onload = function () {
        if (ajaxRequest.response == "ok") {
            if (taskHtmlElement.classList.contains('task-done')) {
                doneCounter--;
            }
            counter --;
            taskCounter.innerHTML = counter;
            spanDoneCounter.innerHTML = doneCounter;
            console.log(taskHtmlElement);
            taskHtmlElement.remove();
        }
        
    }
    ajaxRequest.open("DELETE", REST_API_ENDPOINT + "/tasks/" + taskId);
    ajaxRequest.send();
}

function updateTasksList() {
    tasksList.innerHTML = "";
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onload = function () {
        let tasks = JSON.parse(ajaxRequest.response);
        for (let task of tasks) {
            createTask(task);
        }
    }

    ajaxRequest.open("GET", REST_API_ENDPOINT + '/tasks/');
    ajaxRequest.send();
}

updateTasksList();

function saveTask(taskToSave) {
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onload = () => {
        let savedTask = JSON.parse(ajaxRequest.response);
        createTask(savedTask);
    }
    ajaxRequest.open("POST", REST_API_ENDPOINT + "/tasks/add");
    //dal momento che il server è di tipo REST-full utilizza il tipo json per scambiare informazioni con il front-end
    //pertanto il server si aspetterà dei dati in formato JSON e NON considererà richieste in cui il formato non è specificato nella header della richiesta stessa
    ajaxRequest.setRequestHeader("content-type", "application/json");
    let body = {
        name: taskToSave.name,
        created: new Date(),
        category: {
            id: taskToSave.category.id,
            color: taskToSave.category.color
        }
    };
    ajaxRequest.send(JSON.stringify(body));
}

function updateTask(taskId, taskContent, successfullCallback) {
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onload = () => {
        if (ajaxRequest.status == HTTP_RESPONSE_SUCCESS) {
           successfullCallback(); 
        }
    }
    ajaxRequest.open("PUT", REST_API_ENDPOINT + "/tasks/" + taskId);
    ajaxRequest.setRequestHeader("content-type", "application/json");

    ajaxRequest.send(JSON.stringify(taskContent));
}

function setDone(taskId, taskContent, successfullCallback) {
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onload = () => {
        if (ajaxRequest.status == HTTP_RESPONSE_SUCCESS) {
            successfullCallback();
        }
    }
    ajaxRequest.open("PUT", REST_API_ENDPOINT + "/tasks/" + taskId + "/set-done");
    ajaxRequest.setRequestHeader("content-type", "application/json");

    ajaxRequest.send(JSON.stringify(taskContent));
}

taskAddButton.addEventListener("click", function () {
    const taskContentValue = taskContent.value;
    const categoryId = categories.value;
    if (taskContentValue.length < 1) {
        alert("Please write something to add !!");
        return;
    }
    if (categoryId == "select a category") {
        alert("Please select a category!");
        return;
    }

    //mi creo un oggetto che rappresenta il task da aggiungere
    let task = {
        name: taskContentValue,
        category: {
           id: categoryId,
           color: categories.options[categories.selectedIndex].dataset.color
        }
    };
    saveTask(task);
});

buttonClearAll.addEventListener("click", function() {
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onload = function () {
        if (ajaxRequest.response == "ok") {
            tasksList.innerHTML = "";
            counter = 0;
            doneCounter = 0;
            taskCounter.innerHTML = counter;
            spanDoneCounter.innerHTML = doneCounter;
        }
    };

    ajaxRequest.open("DELETE", REST_API_ENDPOINT + "/tasks/delete-all");
    ajaxRequest.send();
});