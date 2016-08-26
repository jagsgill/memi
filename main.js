const {app, BrowserWindow, ipcMain: ipc} = require('electron')
const exec = require('child_process').exec
const platform = process.platform
const commands = require('./commands').commands

// TODO tests for each command
// TODO move commands into module
// TODO implement `du` commands

let win

function notImpl(){
  // TODO
}

function addArg(cmd, arg){
  // typeof(cmd) = String, typeof(arg) = String
  return cmd + ' ' + arg
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

{
  let channel = 'clientRequestListDirContents'
  let command = commands.list_dir_contents[platform]
  ipc.on(channel, (event, dir) => {
    exec(
      addArg(command, dir),
      (err, stdout, stderr) => {
      let output = (err || stdout || stderr)
      console.log(`${command} :\n ${output}`)
      event.sender.send(channel, output)
    })
  })
}
