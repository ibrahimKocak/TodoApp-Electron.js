const { 
    remote,
    ipcRenderer } = require('electron');

let currWindow = remote.BrowserWindow.getFocusedWindow();

window.closeCurrentWindow = function(){
  currWindow.close();
}


ipcRenderer.on("initApp", (e, todos) => {
    todos.forEach(todo => {
        drawRow(todo)
    });
})

//checkTodoCount();
/*
const todoValue = document.querySelector("#todoValue")

document.querySelector("#addBtn").addEventListener("click", () => {
    ipcRenderer.send("newTodo:save", todoValue.value);
    todoValue.value = "";
})
*/

ipcRenderer.on("todo:addItem", (e, todo) => {
    drawRow(todo)
})

function checkTodoCount(){
    const container = document.querySelector(".todo-container")
    const alertContainer = document.querySelector(".alert-container")

    document.querySelector(".total-count-container").innerText =
        container.children.length;

    if(container.children.length !== 0)
        alertContainer.style.display = "none"
    else
        alertContainer.style.display = "block"

}

function drawRow(todo){

    console.log("preload");
    console.log(todo);

    const container = document.querySelector(".todo-container")
    console.log(container)


    //row
    const row = document.createElement("div")
    row.className = "row"

    //col
    const col = document.createElement("div")
    col.className = "todo-item p-2 mb-3 text-light bg-dark col-md-12 shadow card d-flex justify-content-center flex-row align-items-center"

    //p
    const p = document.createElement("p")
    p.className = "m-0 w-100"
    p.innerText = todo.text

    //deleteBtn
    const deleteBtn = document.createElement("button")
    deleteBtn.className = "btn btn-sm btn-outline-danger"
    deleteBtn.innerText = "X"
    deleteBtn.setAttribute("data-id", todo.id)

    deleteBtn.addEventListener("click", (e) => {
        if(confirm("Bu Kaydı Silmek İstediğinize Emin misiniz)")){
            e.target.parentNode.parentNode.remove()
            ipcRenderer.send("remove:todo", e.target.getAttribute("data-id"))
            checkTodoCount()
        }
    })

    col.appendChild(p);
    col.appendChild(deleteBtn);
    row.appendChild(col);

    container.appendChild(row);

    checkTodoCount();
}