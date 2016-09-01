const {ipcRenderer: ipc}= require('electron')

var msgHolder = document.getElementById('msgHolder'),
    msgInput = document.getElementById('input_sendmsg'),
    msgDu = document.getElementById('input_senddu')

ipc.on('clientRequestListDirContents', (event, arg1) => {
  msgHolder.innerHTML = `${arg1}`
  console.log(`${arg1}`)
})

ipc.on('clientRequestDiskUsageAll', (event, arg1) => {
  msgDu.innerHTML = `${arg1}`
  console.log(`${arg1}`)
})

function sendMsg(){
  console.log(`sending msg: ${msgInput.value}`)
  var msg = msgInput.value
  ipc.send('clientRequestListDirContents', msg)
}

function sendDu(){
  console.log(`sending msg: ${msgDu.value}`)
  var msg = msgDu.value
  ipc.send('clientRequestDiskUsageAll', msg)
}
