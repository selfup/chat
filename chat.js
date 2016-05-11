'use strict'

const socket = io.connect('http://localhost:3000', {reconnect: true})

const rb = socket

rb.send('createTable', "lol")

$('#newData').on('click', (e) => {
  let message = $('#messageField').val()
  rb.send('newData', ['lol', {message: message}])
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