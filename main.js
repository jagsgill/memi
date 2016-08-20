const {app, BrowserWindow, ipcMain: ipc} = require('electron')
const child_process = require('child_process')
const platform = process.platform

let win
let commands = {
  list_dir_contents: {
    'darwin': 'ls -a',
    'freebsd': undefined,
    'linux': undefined,
    'sunos': undefined,
    'win32': undefined
  },
  disk_usage_summary: {
    'darwin': 'du -s',
    'freebsd': undefined,
    'linux': undefined,
    'sunos': undefined,
    'win32': undefined
  },
  disk_usage_all: {
    'darwin': 'du -a',
    'freebsd': undefined,
    'linux': undefined,
    'sunos': undefined,
    'win32': undefined
  }
}

function notImpl(){
  // TODO
}


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
