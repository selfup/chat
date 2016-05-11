'use strict'

const socket = io.connect('http://idea.selfup.me:3000', {reconnect: true})

const rb = socket

const createTheMainTable = () => {
  rb.send('createTable', "lol")
}

createTheMainTable()

$('#messageField').bind("enterKey",function(e){
   let message = `${$('#messageField').val()}`
    if (message.includes("<script>")) {
      message = "DO NOT TRY TO SCRIPT TAG ME"
    }
    rb.send('newData', ['lol', {message: message}])
    $('#messageField').val("")
    displayMessages()
})

$('#messageField').keyup(function(e){
    if(e.keyCode == 13) {
      $(this).trigger("enterKey");
    }
});

$('#dropTable').on('click', (e) => {
  rb.send('updateTable', ['lol', {message: "Chat Data Was Deleted"}])
  displayMessages()
})

const displayMessages = () => {
  rb.send('getTable', 'lol')

  socket.on("foundTable", message => {
    let htmlObj = turnObjectsIntoAList(message).join('')
    $('.dataFromDb').html(htmlObj)
  })
}

const turnObjectsIntoAList = (message) => {
  let objects = []
  Object.getOwnPropertyNames(message).forEach(function(val, idx) {
    if (idx > 0) {
      objects.push(`<p>${message[idx].message}</p>`)
    }
  })
  return objects.reverse()
}

displayMessages()