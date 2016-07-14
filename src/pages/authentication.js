cct.Auth.loginWithPassword({
        username: 'foo',
        password: 'password123',
        serverUrl: 'https://example.com'
    })
    .then(client.auth) // client methods are bound to the client
    .then(function (client) {
        console.log('Authenticated with user id: ' + client.user.id);
    }, function (error) {
        console.error('Failed to authenticate user: ' + error);
    });
