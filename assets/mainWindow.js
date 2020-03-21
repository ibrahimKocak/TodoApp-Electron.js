const electron = require("electron")
const { ipcRenderer } = electron

ipcRenderer.on("todo:addItem", (e, todoItems) => {
    console.log("mainWindow");
    console.log(todoItems);
})

/*
//container
const container = document.querySelector(".todo-container")

//row
const row = document.createElement("div")
row.className = "row"

//col
const col = document.createElement("div")
console.className = "p-2 mb-3 text-ligth bg-dark col-md offset-2 shadow card d-flex justify-content-center flex-row align-items-center"


//p
const p = document.createElement("p")
p.className = "m-0 w-100"
p.innerText = "Bu bir yapılacaklar listesidir..."

//deleteBtn
const deleteBtn = document.createElement("button")
deleteBtn.className = "btn btn-sm btn-outline-danger flex-shrink-1"
deleteBtn.innerText = "X"


deleteBtn.addEventListener("click", () => {
    if(confirm("Bu Kaydı Silmek İstediğinize Emin misiniz)")){
        //TODO
    }
})

col.appendChild(p);
col.appendChild(deleteBtn);
row.appendChild(col);
container.appendChild(row);
*/