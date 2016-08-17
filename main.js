const {app, BrowserWindow, ipcMain: ipc} = require('electron')

let win

// find OS, the load disk usage script for it
// TODO

function createMainWindow(){
  win = new BrowserWindow({
                          width: 800,
                          height: 800
                          })

  win.loadURL(`file://${__dirname}/index.html`)
  var contents = win.webContents

  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createMainWindow) // don't call createWindow yet!

ipc.on('clientSendFormMsg', (event, arg1) => {
  console.log(`Received msg: ${arg1}`)
  event.sender.send('echoMain', arg1)
})
