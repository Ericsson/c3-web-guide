## Rooms
The communication is built around a room metaphor. Every user can participate in any number of rooms. They are the central component that connect users together, and where all direct communication takes place.

Rooms have a lot of different properties that can be set at creation and usually changed anytime afterwards as well. An example is `room.name`, which is a human-readable name of the room that doesn't have to be unique.

The most important room property is `room.id`, which is a globally unique identifier for the room that is generated when the room is created. Rooms can be accessed by id via either `client.fetchRoom` or `client.getRoom`. The difference between the two is that `client.fetchRoom` will do a roundtrip to the server to check if the room exists, while `client.getRoom` returns instantly, but subsequent actions, e.g. joining, might fail if the room doesn't exist. In general `client.getRoom` should be used when the application logic is set up in such a way that you can be sure that the room exists, while `client.fetchRoom` will be more straightforward to use when e.g. getting the room id from user input.

Rooms may also have a human-readable alias, which must be set at room creation. Unlike room names, it is possible to look up a room by it's alias using `client.fetchRoomByAlias`. The alias is chosen by the creator of the room, and has to be globally unique.

For the purpose of this guide, a room has already been created whith the two previously registered users, which will be accessible in later parts of the guide.
