# C3 Web SDK Interactive Guide

Copy and paste the code below into the editor and you will have built your first C3 web app.

```
var client1Room = {};
var client2Room = {};

client1.on('call', function(call) {
    var localMedia = new cct.DeviceSource();
    call.start();
    call.setLocalSource('id', localMedia);
    call.getRemoteSource('id').sink = client1VideoNode;
});

client1.on('invite', function(room) {
    client1Room = room;
    client1Room.join();
    client1Room.on('event:m.room.message', function(event) {
        var message = {
            authorId: event.sender.id,
            text: event.content.body,
            messageId: event.timestamp
        };
        client1Messages.push(message);
    });
});

client2.on('call', function(call) {
    var localMedia = new cct.DeviceSource();
    call.start();
    call.setLocalSource('id', localMedia);
    call.getRemoteSource('id').sink = client2VideoNode;
});

client2.createRoom().then(function(room) {
    client2Room = room;
    client2Room.invite(client1.user.id);
    client2Room.on('event:m.room.message', function(event) {
        var message = {
            authorId: event.sender.id,
            text: event.content.body,
            messageId: event.timestamp
        };
        client2Messages.push(message);
    });
});

client1SendMessage = function(message) {
    client1Room.send('m.room.message', {
        msgtype: 'm.text',
        body: message
    });
}

client2SendMessage = function(message) {
    client2Room.send('m.room.message', {
        msgtype: 'm.text',
        body: message
    });
}

client1StartCall = function() {
    var call = client1Room.startCall(client1Room.otherMembers[0]);
    var localMedia = new cct.DeviceSource();
    call.setLocalSource('id', localMedia);
    var remoteMedia = call.getRemoteSource('id');
    remoteMedia.sink = client1VideoNode;
}

client2StartCall = function() {
    var call = client2Room.startCall(client2Room.otherMembers[0]);
    var localMedia = new cct.DeviceSource();
    call.setLocalSource('id', localMedia);
    var remoteMedia = call.getRemoteSource('id');
    remoteMedia.sink = client2VideoNode;
}
```
