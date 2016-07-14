## WebRTC
WebRTC is a technology that enables realtime peer-to-peer communication directly between browsers and other clients and services. It supports both audio & video calls as well as generic data transferring.

All webrtc communication in libcct happens within a call, which are represented by the Call class. A call always takes place between two users within the context of a room. A user can have multiple calls active at the same time, and there can also be multiple simultaneous calls between different users in a single room.
