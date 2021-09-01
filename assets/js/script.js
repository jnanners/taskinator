//js variable for main element
var pageContentEl = document.querySelector("#page-content");

//counter to give each task a unique id
var taskIdCounter = 0;

//js variable for the form in the header
var formEl = document.querySelector("#task-form");

//js variable for the tasks to do column
var taskToDoEl = document.querySelector("#tasks-to-do");

//js variable for the tasks in progress column
var taskInProgressEl = document.querySelector("#tasks-in-progress");

//js variable for the tasks completed column
var taskCompletedEl = document.querySelector("#tasks-completed");

//task array
var tasks = [];

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

    //variable to check if form has data-task-id attribute to see if it is an edited form
    var isEdit = formEl.hasAttribute("data-task-id");
    
    //if isEdit has data attribute get task id and call functino to complete edit process
    if(isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    //no data attribute, so create object as normal and pass to createTaskEl function
    else{
        //package up data as an object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };
        //send it as an argument to createTaskEl
        createTaskEl(taskDataObj);
    }
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

    //append the taskIdCounter to the taskDataObj
    taskDataObj.id = taskIdCounter;

    //push the current tasks object into the tasks array
    tasks.push(taskDataObj);

    saveTasks();

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

var taskButtonHandler = function(event){
    //get target element from event
    var targetEl = event.target;

    //edit button was clicked
    if(targetEl.matches(".edit-btn")){
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    //delete button was clicked
    else if(targetEl.matches(".delete-btn")){
        //get the elemnt's task id
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var deleteTask = function(taskId){
    //no space between .task-item and [data-task-id] because they must both be on the same element
    //if there was a space it would look for an elemnt with the [data-task-id] attribute inside a .task-item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    //create new array to hold updated list of tasks
    var updatedTaskArr = [];

    //loop through current tasks
    for(var i = 0; i < tasks.length; i++){
        //if tasks[i] doesn't match the value of taskId keep it and add it to updatedTaskArr
        if(tasks[i].id !== parseInt(taskId)){
            updatedTaskArr.push(tasks[i]);
        }
    }

    //reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    saveTasks();
};

var editTask = function(taskId){
    //get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    //place name and type values back in form elements for editing
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    //make add task button say save task so user knows they are editing
    document.querySelector("#save-task").textContent = "Save Task";

    //add taskId to the data-task-id attribute to the form to save the correct task
    formEl.setAttribute("data-task-id", taskId);
}

var completeEditTask = function(taskName, taskType, taskId){
    //find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    //loop through tasks array and task object with new content
    //for each iteration the loop checks if the tasks id propert matches the taskId arugment
    for(var i = 0; i < tasks.length; i++){
        if(tasks[i].id === parseInt(taskId)){
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    saveTasks();

    //reset form by removing task id and changing button text back to normal
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

var taskStatusChangeHandler = function(event){
    //get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    //get the currently selection option's value and convert to to lowercase (future-proofing)
    var statusValue = event.target.value.toLowerCase();

    //find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if(statusValue === "to do"){
        taskToDoEl.appendChild(taskSelected);
    }
    else if(statusValue === "in progress"){
        taskInProgressEl.appendChild(taskSelected);
    }
    else if(statusValue === "completed"){
        taskCompletedEl.appendChild(taskSelected);
    }

    //update task status in tasks array
    for(var i = 0; i < tasks.length; i++){
        if(tasks[i].id === parseInt(taskId)){
            tasks[i].status = statusValue;
        }
    }

    saveTasks();
};

var saveTasks = function(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function(){
    //get task items from localStorage
    tasks = localStorage.getItem("tasks");
    //if statement in case tasks is equal to null
    if(!tasks){
        tasks = [];
        return false;
    }

    //Convert tasks from string back into an array of object
    tasks = JSON.parse(tasks);

    //iterate through a tasks array and create task elements on the page from it
    for(var i = 0; i < tasks.length; i++){
        tasks[i].id = taskIdCounter;

        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";
        listItemEl.setAttribute("data-task-id", tasks[i].id);

        //create div to hold task info and add to list item
        var taskInfoEl = document.createElement("div");
        //give it a class name
        taskInfoEl.className = "task-info";
        //add HTML content to div
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
        listItemEl.appendChild(taskInfoEl);
        
        var taskActionsEl = createTaskActions(tasks[i].id);

        listItemEl.appendChild(taskActionsEl);
        
        if(tasks[i].status === "to do"){
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
            taskToDoEl.appendChild(listItemEl);
        }
        else if(tasks[i].status === "in progress"){
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
            taskInProgressEl.appendChild(listItemEl);
        }
        else if(tasks[i] === "complete"){
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
        }

        taskIdCounter++;
    }
}

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();