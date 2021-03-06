/*
*   Available items:
*   • client1 - A client
*   • client2 - Another client
*   • client1Room - A room with both the clients as members on the first client
*   • client2Room - Same as above but for the second client
*   • client1VideoNode - A <video> element for attaching the remote video on the first client
*   • client2VideoNode - Same as above but for the second client
*   • client1StartCall - The function which will be executed when the "Video call" button is clicked on the first client
*   • client2StartCall - Same as above but for the second client
*/

client1.on('call', function (call) {
    var localMedia = new cct.DeviceSource();
    call.start();
    call.getRemoteSource('id').connect(client1VideoNode);
    call.setLocalSource('id', localMedia);
});

client2.on('call', function (call) {
    var localMedia = new cct.DeviceSource();
    call.start();
    call.setLocalSource('id', localMedia);
    call.getRemoteSource('id').connect(client2VideoNode);
});

client1StartCall = function () {
    var call = client1Room.startCall(client2.user);
    var localMedia = new cct.DeviceSource();
    call.setLocalSource('id', localMedia);
    var remoteMedia = call.getRemoteSource('id');
    remoteMedia.connect(client1VideoNode);
};

client2StartCall = function () {
    var call = client2Room.startCall(client1.user);
    var localMedia = new cct.DeviceSource();
    call.setLocalSource('id', localMedia);
    var remoteMedia = call.getRemoteSource('id');
    remoteMedia.connect(client2VideoNode);
};
