'use strict'

const socket = io.connect('http://idea.selfup.me:3000', {reconnect: true})

const rb = socket

const createTheMainTable = () => {
  rb.send('createTable', "lol")
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
    rb.send('newData', ['lol', {message: message, name: name}])
    $('#messageField').val("") // clear message input field
    displayMessages()
})

$('#messageField').keyup(function(e){
    if(e.keyCode == 13) {
      $(this).trigger("enterKey");
    }
});

$('#dropTable').on('click', (e) => {
  rb.send('updateTable', ['lol', {message: "Chat Data Was Deleted", name: "Chat Bot"}])
  displayMessages()
})

const displayMessages = () => {
  rb.send('getTable', 'lol')

  socket.on("foundTable", message => {
    let nameAndMessage = turnObjectsIntoAList(message).join('')
    $('.dataFromDb').html(nameAndMessage)
  })
}

const turnObjectsIntoAList = (message) => {
  let objects = []
  Object.getOwnPropertyNames(message).forEach(function(val, idx) {
    if (idx > 0) {
      console.log(message[idx].name)
      objects.push(`<p>${message[idx].name}: ${message[idx].message}</p>`)
    }
  })
  return objects.reverse()
}

displayMessages()