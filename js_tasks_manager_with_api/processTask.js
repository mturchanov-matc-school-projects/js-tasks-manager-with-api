//bool flag that .deleteBtns have time to be catched for addEventListener
let isInitialized = false; 
ajaxRequest("get");

const init = () => {
    let btnDeleteTask = [...document.querySelectorAll(".deleteBtns")];
    let btnAddTask = document.querySelector("#newTaskBtn");
    
    btnAddTask.addEventListener("click", function(){ajaxRequest("post")}, false);
    btnDeleteTask.forEach((el => {
        el.addEventListener("click", function(){ajaxRequest("delete")}, false)
    }));
     isInitialized = true;
}

//display tasks and add delete event for new task -  dom html
const displayTasks = tasks => {
    let ul = !document.querySelector("ul") 
        ? document.createElement("ul")
        : document.querySelector("ul");
    tasks.forEach((task => {
        let trash = document.createElement("img");
        trash.setAttribute("class", "deleteBtns");
        trash.setAttribute("src", "images/delete.png");
        let li = document.createElement("li");
        li.appendChild(trash);
        li.innerHTML += task.Description;
        li.appendChild(document.createElement("br"));
        ul.appendChild(li);
    }));
    document.body.appendChild(ul);

    let delBtns = document.querySelectorAll("li img");
    let lastBtn = delBtns[delBtns.length-1];
    if(lastBtn){
        lastBtn.addEventListener("click", function(){ajaxRequest("delete")}, false);
    }
    isInitialized ? "" : init();
}

const deleteTask = event => event.parentElement.remove();

//making ajax request based on method
function ajaxRequest(method) {
    let xhr = new XMLHttpRequest();
    let url = "https://ghu8xhzgfe.execute-api.us-east-1.amazonaws.com/tasks";
    let studentID = "2906006";
    method == "get" ? url += "/" + studentID : url;
    let apiKey = "Itcheui2tB58SlUGe8rrP8mskudGsNDT9nfKKG9S";
    let description = method == "delete"
            ? event.currentTarget.nextSibling.nodeValue
            : document.querySelector("#newTask").value;    
    let params =  {
        "StudentId": studentID,
        "Description": description
    };
    xhr.open(method, url, true);    
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("x-api-key", apiKey);
    xhr.onreadystatechange = () => {
        if(xhr.readyState == 4) {
            if(method == "get"){
                let items = JSON.parse(xhr.responseText).Items;
                displayTasks(items);
            }
        }
    }
    if(method == "post") {
        if(!params.Description) return; //lazy validation
        xhr.send(JSON.stringify(params));
        displayTasks([params]);
    } else if(method == "delete"){
        deleteTask(event.currentTarget);
        xhr.send(JSON.stringify(params));
    } else {
        xhr.send(null);
    }
    document.querySelector("#newTask").value = "";
}