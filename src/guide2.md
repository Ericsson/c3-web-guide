## Authentication

```
var client1 = new cct.Client();
var client2 = new cct.Client();

cct.Auth.anonymous({serverUrl: 'https://localhost:8448'})
    .then(client1.auth)
    .then(function(client) {
        console.log('Authenticated with user id: ' + client.user.id);
    });

cct.Auth.anonymous({serverUrl: 'https://localhost:8448'})
    .then(client2.auth)
    .then(function(client) {
        console.log('Authenticated with user id: ' + client.user.id);
    });
```

## Something

```
client1.setName('Test name');
client2.setName('Another name');
```

