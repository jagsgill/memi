const {app, BrowserWindow, ipcMain: ipc} = require('electron')
const exec = require('sudo-prompt').exec

const commands = require('./dev/backend/commands').commands
const STATUS = require('./dev/util/errorcodes.js').STATUS

// TODO tests for each command
// TODO add progress notification for long operations, stop command for user
// TODO want to use -x flag for `du` ?
// TODO make base url in win.loadURL call injectable

const platform = process.platform
let win // the window
let sudo_options = {
  name: 'memi'
}

function notImpl(){
  // TODO
}

function createMainWindow(){
  win = new BrowserWindow({
    width: 800,
    height: 800
  })

  win.loadURL(`http://localhost:8080/index.html`)
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
  let channel = 'clientRequestListDirContents',
  command = commands.list_dir_contents[platform]
  ipc.on(channel, (event, dir) => {
    exec(
      command(dir),
      sudo_options,
      (err, stdout, stderr) => {
        let output = (err || stdout || stderr)
        console.log(`${command(dir)} :\n ${output}`)
        event.sender.send(channel, output)
      })
    })
  }

  {
    let channel = 'clientRequestDiskUsageForPath',
    command = commands.disk_usage_summary[platform]
    ipc.on(channel, (event, dir) => {
      exec(
        command(dir),
        sudo_options,
        (err, stdout, stderr) => {
          let output = (err || stdout || stderr).trim()
          if (output  === STATUS.DIR_NOT_EXIST){
            event.sender.send(channel, { status: STATUS.DIR_NOT_EXIST, content: "" }, dir)
          } else {
            console.log(`${command(dir)} :\n ${output}`)
            event.sender.send(channel, { status: STATUS.OK, content: output }, dir)
          }
        })
      })
    }
