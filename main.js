const electron = require("electron")
const url = require("url")
const path = require("path")
const db = require("./lib/connection").db

const { app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow, addWindow;

app.allowRendererProcessReuse = true;
app.on("ready", () => {

    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(app.getAppPath(), 'preload.js')
        },
        resizable: false,
        //frame: false
    })

    //Pencerenin oluşturulması
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "pages/mainWindow.html"),
            protocol: "file",
            slashes: true
        })
    )
    
    //Menünün oluşturulması
    const mainMenu = new Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

    ipcMain.on("todo:close", () => {
        app.quit();
        addWindow = null;
    })

    //NewTodo Penceresi Olayları...

    ipcMain.on("newTodo:close", () => {
        addWindow.close();
        addWindow = null;
    })

    ipcMain.on("newTodo:save", (err, data) => {
        
        db.query("INSERT INTO todos SET text = ?", data.todoValue, (e,r,f) => {
            console.log(r)
            mainWindow.webContents.send("todo:addItem", {
                id : r.insertId,
                text : data.todoValue
            })
        })

        if(data.ref == "new"){

            addWindow.close();
            addWindow = null;
        }
    })

    mainWindow.webContents.once("dom-ready", () => {
        db.query("SELECT * FROM todos", (error, result, fields) => {
            mainWindow.webContents.send("initApp", result)
        })
    })

    ipcMain.on("remove:todo", (e,id) => {
        db.query("DELETE FROM todos WHERE id = ?", id, (e,r,f) => {
            if(r.efectedRows > 0){
                console.log("slime işlemi başarılı")
            }
        })
    })

});

//Menü template yapsıı
const mainMenuTemplate = [
    {
        label : "Dosya",
        submenu : [
            {
                label : "Yeni TODO Ekle",
                click(){
                    createWindow();
                }
            },
            {
                label : "Tümünü Sil"
            },
            {
                label : "Çıkış",
                accelerator : process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
                role : "quit"
            }
        ]
    }
]

if(process.env.NODE_ENV !== "production"){
    mainMenuTemplate.push(
        {
            label : "Geliştirici Araçları",
            submenu : [
                {
                    label : "Geliştirici Araçları",
                    click(item, focusedWindow){
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                    label : "Yenile",
                    role : "reload"
                }
            ]
        }
    );
}

function createWindow(){

    addWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
            //preload: path.join(app.getAppPath(), 'preload.js')
        },
        width: 480,
        height: 208,
        resizable: false
        //frame : false
    });

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, "pages/newTodo.html"),
        protocol: "file",
        slashes: true
    }));

    addWindow.on('close', () => {
        addWindow = null;
    })
}