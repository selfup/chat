
'use strict';

var socket = io.connect('http://localhost:3000', { reconnect: true });

var rb = socket;

var createTheMainTable = function createTheMainTable() {
  rb.send('createTable', "lol");
};

createTheMainTable();

$('#messageField').bind("enterKey", function (e) {
  var message = '' + $('#messageField').val();
  if (message.includes("<")) {
    message = "NO TAGS";
  }
  rb.send('newData', ['lol', { message: message }]);
  $('#messageField').val("");
  displayMessages();
});

$('#messageField').keyup(function (e) {
  if (e.keyCode == 13) {
    $(this).trigger("enterKey");
  }
});

$('#dropTable').on('click', function (e) {
  rb.send('updateTable', ['lol', { message: "Chat Data Was Deleted" }]);
  displayMessages();
});

var displayMessages = function displayMessages() {
  rb.send('getTable', 'lol');

  socket.on("foundTable", function (message) {
    var htmlObj = turnObjectsIntoAList(message).join('');
    $('.dataFromDb').html(htmlObj);
  });
};

var turnObjectsIntoAList = function turnObjectsIntoAList(message) {
  var objects = [];
  Object.getOwnPropertyNames(message).forEach(function (val, idx) {
    if (idx > 0) {
      objects.push('<p>' + message[idx].message + '</p>');
    }
  });
  return objects.reverse();
};

displayMessages();