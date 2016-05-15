'use strict'

const socket = io.connect('http://localhost:3000', {reconnect: true})

const rb = socket

const createTheMainTable = () => {
  rb.send('createTable', "lol")
}

createTheMainTable()

const getRoomId = () => {
  if ($('#roomIdField').val() === "") { $('#roomIdField').val("lol") }
  let roomId = $('#roomIdField').val()
  return roomId
}

const sanitize = (message, name) => {
  if (message.includes("<")) { message = "NO TAGS" }
  if (name.includes("<")) { name = "NO TAGS" }
  if (name === "") { name = "anon" }
  return [message, name]
}

const newMessages = (roomId, sanitized) => {
  rb.send('createTable', `${roomId}`)
  rb.send('newData', [`${roomId}`, {message: sanitized[0], name: sanitized[1]}])
}

const resetAndDisplay = () => {
  $('#messageField').val("") // clear message input field
  displayMessages()
}

$('#messageField').bind("enterKey",function(e){
  let name = `${$('#nameField').val()}`
  let message = `${$('#messageField').val()}`
  let roomId = getRoomId()
  const sanitized = sanitize(message, name)
  newMessages(roomId, sanitized)
  resetAndDisplay()
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

displayMessages()

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
