// Register and authenticate a user:
cct.Auth.registerWithPassword({
    username: 'exampleName',
    password: 'examplePassword',
    serverUrl: 'https://example.domain'
})
.then(client.auth)
.then(function(client) {
    console.log('Client registered and authenticated with user id: ' + client.user.id);
})

// Log in and authenticate an existing user:
cct.Auth.loginWithPassword({
    username: 'exampleName',
    password: 'examplePassword',
    serverUrl: 'https://example.domain'
})
.then(client.auth)
.then(function (client) {
    console.log('Client logged in and authenticated with user id: ' + client.user.id);
});
