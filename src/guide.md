# C3 Web SDK Interactive Guide

Copy and paste the code below into the editor and you will have built your first C3 web app.

```
var serverUrl = 'https://webrtc-test.cct.ericsson.net';
var client1 = new cct.Client();
var client2 = new cct.Client();
var client1Room = {};
var client2Room = {};

cct.Auth.loginWithPassword({
    username: 'user1',
    password: 'password123',
    serverUrl: serverUrl
}).then(client1.auth).then(function() {
    client1.on('call', function(call) {
        var localMedia = new cct.DeviceSource();
        call.start();
        call.setLocalSource('foo', localMedia);
        call.getRemoteSource('foo').sink = videoNode1;
    });
    client1.on('invite', function(room) {
        client1Room = room;
        client1Room.join();
        client1Room.on('event:m.room.message', function(event) {
            var message = {
                authorId: event.sender.localId,
                text: event.content.body,
                messageId: event.timestamp
            };
            client1Messages.push(message);
        });
        console.log('client1 ready');
    });
});

cct.Auth.loginWithPassword({
    username: 'user2',
    password: 'password123',
    serverUrl: serverUrl
}).then(client2.auth).then(function() {
    client2.on('call', function(call) {
        var localMedia = new cct.DeviceSource();
        call.start();
        call.setLocalSource('foo', localMedia);
        call.getRemoteSource('foo').sink = videoNode2;
    });
    return client2.createRoom();
}).then(function(room) {
    client2Room = room;
    client2Room.invite(client1.user.id);
    client2Room.on('event:m.room.message', function(event) {
        var message = {
            authorId: event.sender.localId,
            text: event.content.body,
            messageId: event.timestamp
        };
        client2Messages.push(message);
    });
    console.log('client2 ready');
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
    call.setLocalSource('foo', localMedia);
    var remoteMedia = call.getRemoteSource('foo');
    remoteMedia.sink = videoNode1;
}

client2StartCall = function() {
    var call = client2Room.startCall(client2Room.otherMembers[0]);
    var localMedia = new cct.DeviceSource();
    call.setLocalSource('foo', localMedia);
    var remoteMedia = call.getRemoteSource('foo');
    remoteMedia.sink = videoNode2;
}
```
