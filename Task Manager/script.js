let allTasks = [];

window.onload = function(){
    if(localStorage.getItem("allTasks")){
        allTasks = JSON.parse(localStorage.getItem("allTasks"));

        if(!Array.isArray(allTasks)){
            allTasks = [];
        }

        let taskUl = document.getElementById("task-list");
        for(let i = 0 ; i < allTasks.length; i++){
            let taskText = allTasks[i];
 let newLi = document.createElement("li");

        newLi.appendChild(document.createTextNode(taskText));
        
        let editBtn = document.createElement("button");
        editBtn.textContent= "Edit Task";
        editBtn.classList.add("edit");

        let delBtn = document.createElement("button");
        delBtn.textContent= "X";
        delBtn.classList.add("del");
        
        let btnDiv = document.createElement("div");
        btnDiv.classList.add("group");
        btnDiv.appendChild(editBtn);
        btnDiv.appendChild(delBtn);

        newLi.appendChild(btnDiv);
        taskUl.appendChild(newLi);


        delBtn.addEventListener("click" , function(){
            taskUl.removeChild(newLi);
            let idx = allTasks.indexOf(taskText);
            if(idx !== -1){
                allTasks.splice(idx , 1);
            }

            localStorage.setItem("allTasks" , JSON.stringify(allTasks));
        });

        editBtn.addEventListener("click" , function(){
            let newText = prompt("Enter your tasks:", taskText);

            if(newText !== null  && newText.trim() !== ""){
                let idx = allTasks.indexOf(taskText);
                if(idx !== -1){
                    allTasks[idx] = newText;
                    localStorage.setItem("allTasks" , JSON.stringify(allTasks));
                    location.reload();
                }
            }
        });
        }
   }
}


document.getElementById("taskForm").addEventListener("submit" , function (event){
    event.preventDefault();
    addTask();
});

document.getElementById("Task").addEventListener("click", function(event){
    event.preventDefault();
    addTask();
});

function addTask(){
    let taskInp = document.getElementById("inp").value;

    if(taskInp != "" && taskInp != null && taskInp.trim() != ""){
        allTasks.push(taskInp);
        localStorage.setItem("allTasks" , JSON.stringify(allTasks));

        let taskUl = document.getElementById("task-list");
        let newLi = document.createElement("li");

        newLi.appendChild(document.createTextNode(taskInp));
        
        let editBtn = document.createElement("button");
        editBtn.textContent= "Edit Task";
        editBtn.classList.add("edit");

        let delBtn = document.createElement("button");
        delBtn.textContent= "X";
        delBtn.classList.add("del");
        
        let btnDiv = document.createElement("div");
        btnDiv.classList.add("group");
        btnDiv.appendChild(editBtn);
        btnDiv.appendChild(delBtn);

        newLi.appendChild(btnDiv);
        taskUl.appendChild(newLi);


        delBtn.addEventListener("click" , function(){
            taskUl.removeChild(newLi);
            let idx = allTasks.indexOf(taskInp);
            if(idx !== -1){
                allTasks.splice(idx , 1);
            }

            localStorage.setItem("allTasks" , JSON.stringify(allTasks));
        });

        editBtn.addEventListener("click" , function(){
            let newText = prompt("Enter your tasks:", taskInp);

            if(newText !== null  && newText.trim() !== ""){
                let idx = allTasks.indexOf(taskInp);
                if(idx !== -1){
                    allTasks[idx] = newText;
                    localStorage.setItem("allTasks" , JSON.stringify(allTasks));
                    location.reload();
                }
            }
        });
        
    }
    else{
        alert("Please enter a valid task")
    }
    document.getElementById("inp").value = "";
}