## Messaging
Rooms support text messaging through events that can contain arbitrary data (not to be confused with EventEmitter events). Every event has a `type` and `content`, and every client can choose to interpret events in any way they like. The events also have other information like the sender, timestamp, and whether it's your own event.

The standard type for message events is `'m.room.message'`, where the content should be an object with the `'body'` and `'msgtype'` keys. For text messages the `'msgtype'` should be set to `'m.text'`, and the `'body'` should be the text content of the message.

### Sending messages
To send any type of event you use the send method. It takes two arguments, the first one being the type of the event, which for a message would be `'m.room.message'`, and then the content of the event, which in out case will be an object with the `'body'` and `'msgtype'` keys.

The code in the editor on the right does two things. It starts listening for new messages, and hooks up the sendMessage functions to the `Send` buttons. Try running the code by pressing the `Run code` button, and then see what happens when you send a message.
