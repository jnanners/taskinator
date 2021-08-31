//counter to give each task a unique id
var taskIdCounter = 0;

//making button element a js variable
var formEl = document.querySelector("#task-form");
var taskToDoEl = document.querySelector("#tasks-to-do");

var taskFormHandler = function(event) {
    
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    //check if input values are empty strings
    if(!taskNameInput || !taskTypeInput){
        alert("You need to fill out the task form!");
        return false;
    }

    //have the form values rest so the input fields are empty after you submit a task
    formEl.reset();

    //package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    //send it as an argument to createTaskEl
    createTaskEl(taskDataObj);
    
};

var createTaskEl = function(taskDataObj){
    //create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    //create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    //give it a class name
    taskInfoEl.className = "task-info";
    //add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    listItemEl.appendChild(taskInfoEl);

    //create variable that represents the action container created in createTaskActions
    var taskActionsEl = createTaskActions(taskIdCounter);

    //append container created in createTaskActions to listItemEl
    listItemEl.appendChild(taskActionsEl);

    //add entire list item to list
    taskToDoEl.appendChild(listItemEl);

    //increase task counter for each unique id
    taskIdCounter++;
}

var createTaskActions = function(taskId){
    //create a div that will hold other elements
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId)

    //append edit button to actionContainter div
    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    //append delete button to actionContainer div
    actionContainerEl.appendChild(deleteButtonEl);

    //create select element for dropdown menu
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    //array for select options
    var statusChoices = ["To Do", "In Progress", "Completed"];

    //for loop to create options from array
    for(var i = 0; i < statusChoices.length; i++){
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    //append select element to actionContainer div
    actionContainerEl.appendChild(statusSelectEl);

    return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);
