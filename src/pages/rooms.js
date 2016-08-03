// Create a room with the name "Example room":
client.createRoom({name: 'Example room'}).then(function (room) {
    console.log('Created a room with name: ' + room.name + ', and ID: ' + room.id);
}).catch(function(error) {
    console.error('Something went wrong', error);
});

// Invite users to a room:
room.invite('@foo:example.com').then(function () {
    console.log('Invited Foo');
}).catch(function(error) {
    console.error('Something went wrong', error);
});

// Join a room:
client.on('invite', function (room) {
    console.log('Got invited to the room ' + room.name + ', joining!');
    return room.join();
}).then(function (room) {
    console.log('Joined room ' + room.name);
}).catch(function (error) {
    console.error('Something went wrong', error);
});
