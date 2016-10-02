const {ipcRenderer: ipc}= require('electron')

var msgHolder = document.getElementById('msgHolder'),
    msgInput = document.getElementById('input_sendmsg'),
    msgDu = document.getElementById('input_senddu')

ipc.on('clientRequestListDirContents', (event, arg1) => {
  msg.innerHTML = `${arg1}`
  console.log(`${arg1}`)
})

ipc.on('clientRequestDiskUsageCurrDir', (event, output, dir) => {
  // TODO inject correct logic depending on platform/command output
  // OR enforce an output format for this command for all platforms
  // i.e. simplify logic in either the backend or in the frontend
  let rawdata = output.split("\n")
  let entries_to_process = rawdata.slice(0, -3) // trim total line, 2x ""
  let entries = entries_to_process.map((e) => {
    let obj = {},
        data = e.split(/:/)
    obj.fname = data[1].toString()
    obj.fsize = data[0].toString()
    obj.type = data[2].toString()
    return obj
  })
  let summary = (() => {
    let data = rawdata[rawdata.length - 3].split(/:/)
        obj = {},
    obj.totalsize = data[0]
    obj.curr_dir = dir
    return obj
  })()
  console.log(entries)
  console.log(summary)
  msg.innerHTML = `${entries}`
})

function sendMsg(){
  console.log(`sending msg: ${msgInput.value}`)
  var msg = msgInput.value
  ipc.send('clientRequestListDirContents', msg)
}

function sendDu(){
  console.log(`sending msg: ${msgDu.value}`)
  var msg = msgDu.value
  ipc.send('clientRequestDiskUsageCurrDir', msg)
}
