'use strict'

const socket = io.connect('http://idea.selfup.me:3000', {reconnect: true})

const rb = socket

const createTheMainTable = () => {
  rb.send('createTable', "lol")
}

const getRoomId = () => {
  let roomId = $('#roomIdField').val()
  if (roomId === "") {
    roomId = 'lol'
  }
  return roomId
}

createTheMainTable()

$('#messageField').bind("enterKey",function(e){
  let name = `${$('#nameField').val()}`
  let message = `${$('#messageField').val()}`
  if (message.includes("<")) {
    message = "NO TAGS"
  }
  if (name.includes("<")) {
    name = "NO TAGS"
  }
  let roomId = getRoomId()
  rb.send('createTable', `${roomId}`)
  rb.send('newData', [`${roomId}`, {message: message, name: name}])
  $('#messageField').val("") // clear message input field
  displayMessages()
})

$('#messageField').keyup(function(e){
  if(e.keyCode == 13) {
    $(this).trigger("enterKey");
  }
});

$('#dropTable').on('click', (e) => {
  rb.send('updateTable', [`${getRoomId()}`, {message: "Chat Data Was Deleted", name: "Chat Bot"}])
  displayMessages()
})

const displayMessages = () => {
  rb.send('getTable', `${getRoomId()}`)

  socket.on("foundTable", message => {
    if (message["0"].table === getRoomId()) {
      let nameAndMessage = turnObjectsIntoAList(message).join('')
      $('.dataFromDb').html(nameAndMessage)
    }
  })
}

const turnObjectsIntoAList = (message) => {
  let objects = []
  Object.getOwnPropertyNames(message).forEach(function(val, idx) {
    if (idx > 0) {
      objects.push(`<p>${message[idx].name}: ${message[idx].message}</p>`)
    }
  })
  return objects.reverse()
}

displayMessages()
