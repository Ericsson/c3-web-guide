// Creating a room
client.createRoom({name: 'Test room'}).then(function (room) {
    console.log('Created a room!', room);
}).catch(function (error) {
    console.error('Failed to create room :(', error);
});


// Inviting users to a room
room.invite('@foo:example.com').then(function () {
    console.log('Invited Foo');
});

// Joining a room
fooClient.on('invite', function (room) {
    console.log('Got invited to the room ' + room.name + ', joining!');
    return room.join();
}).then(function (room) {
    console.log('Joined room ' + room.name);
});
