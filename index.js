const {ipcRenderer: ipc}= require('electron')

var msgHolder = document.getElementById('msgHolder'),
    msgInput = document.getElementById('input_sendmsg')

ipc.on('clientRequestListDirContents', (event, arg1) => {
  msgHolder.innerHTML = `${arg1}`
  console.log(`${arg1}`)
})

function sendMsg(){
  console.log(`sending msg: ${msgInput.value}`)
  var msg = msgInput.value
  ipc.send('clientRequestListDirContents', msg)
}
