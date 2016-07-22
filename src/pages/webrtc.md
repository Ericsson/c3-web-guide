## WebRTC
WebRTC is a technology that enables realtime peer-to-peer communication directly between browsers and other clients and services. It supports both audio & video calls as well as generic data transferring.

All webrtc communication in C3 happens within a call, which are represented by the Call class. A call always takes place between two users within the context of a room. A user can have multiple calls active at the same time, and there can also be multiple simultaneous calls between different users in a single room.

The code in the editor on the right does two things. It starts listening for incoming calls on both clients, and it hooks upp the startCall functions to the buttons. Try running the code by pressing the `Run code` button, and then start a video call on one of the clients by pressing the `Video call` button.
