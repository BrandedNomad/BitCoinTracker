const {app, BrowserWindow,Menu} = require('electron');
const path = require('path');
const url = require('url');
const shell =require('electron').shell
const ipc = require('electron').ipcMain

let win;

const createWindow = ()=>{
    win = new BrowserWindow({width:800, height:600, icon:path.join(__dirname,'./assets/img/bitcoin.png'),webPreferences:{nodeIntegration:true,enableRemoteModule: true}});
    win.loadURL(url.format({
        pathname:path.join(__dirname,'./src/index.html'),
        protocol:'file',
        slashes:true
    }))

    //win.webContents.openDevTools();

    win.on('closed',()=>{
        win = null;
    })

    var menu = Menu.buildFromTemplate([
        {
            label:'Menu',
            submenu:[
                {label:'Adjust Notification Value'},
                {
                    label:'CoinMarketCap',
                    click(){
                        shell.openExternal('http://coinmarketcap.com')
                    }
                },
                {
                   type:'separator'
                },
                {
                    label:'Exit',
                    click(){
                        app.quit()
                    }
                }
            ]
        },
        {
            label:'Info'
        }
    ])

    Menu.setApplicationMenu(menu)
}

app.on('ready',createWindow)

app.on('window-all-closed',()=>{
    if(process.platform !== 'darwin'){
        app.quit();
    }
})

app.on('activate', ()=>{
    if(win === null){
        createWindow()
    }
})

ipc.on('update-notify-value',(event,arg)=>{
    win.webContents.send('targetPriceVal',arg)
})

app.setAppUserModelId(process.execPath)