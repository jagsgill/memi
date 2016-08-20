const {ipcRenderer: ipc}= require('electron')

var msgHolder = document.getElementById('msgHolder'),
    msgInput = document.getElementById('input_sendmsg')

ipc.on('echoMain', (event, arg1) => {
  msgHolder.innerHTML = arg1
})

function sendMsg(){
  console.log(`sending msg: ${msgInput.value}`)
  var msg = msgInput.value
  ipc.send('clientSendFormMsg', msg)
}
