/*
*   Available items:
*   • client1Room - A room with both the clients as members on the first client
*   • client2Room - Same as above but for the second client
*   • client1SendMessage - The function which will be executed when the "send" button is clicked on the first client
*   • client2SendMessage - Same as above but for the second client
*   • client1Messages - An array with all the messages on the first client
*   • client2Messages - Same as above but for the second client
*/

client1Room.on('event:m.room.message', function(event) {
    var message = {
        authorId: event.sender.id,
        text: event.content.body,
        messageId: event.timestamp
    };
    client1Messages.push(message);
});

client2Room.on('event:m.room.message', function(event) {
    var message = {
        authorId: event.sender.id,
        text: event.content.body,
        messageId: event.timestamp
    };
    client2Messages.push(message);
});

client1SendMessage = function(message) {
    client1Room.send('m.room.message', {
        msgtype: 'm.text',
        body: message
    });
};

client2SendMessage = function(message) {
    client2Room.send('m.room.message', {
        msgtype: 'm.text',
        body: message
    });
};
