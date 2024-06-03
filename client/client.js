const socket = io('http://localhost:3000');
const startAndJoinButton = document.getElementById('startAndJoinButton');
const roomNameInput = document.getElementById('roomName');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

let localStream = null;
let remoteStream = null;
let peerConnection = null;
let roomName = '';

const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }, // Google's public STUN server
  ],
};

const mediaConstraints = {
  video: true,
  audio: true,
};

startAndJoinButton.onclick = async () => {
  roomName = roomNameInput.value;
  if (!roomName) {
    alert('Please enter a room name.');
    return;
  }

  try {
    localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    localVideo.srcObject = localStream;
    console.log('Local stream initialized');

    socket.emit('join_room', roomName);
  } catch (error) {
    console.error('Error accessing media devices.', error);
  }
};

socket.on('another_person_ready', () => {
  if (localStream) {
    createPeerConnection();
    localStream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, localStream));
    peerConnection
      .createOffer()
      .then((offer) => {
        peerConnection.setLocalDescription(offer);
        socket.emit('send_connection_offer', { offer, roomName });
      })
      .catch((error) => console.error('Error creating offer', error));
  } else {
    console.error('Local stream is not initialized.');
  }
});

socket.on('send_connection_offer', async ({ offer }) => {
  if (!peerConnection) {
    createPeerConnection();
    if (localStream) {
      localStream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, localStream));
    }
  }

  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  socket.emit('answer', { answer, roomName });
});

socket.on('answer', async ({ answer }) => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on('send_candidate', async ({ candidate }) => {
  if (peerConnection) {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }
});

function createPeerConnection() {
  peerConnection = new RTCPeerConnection(iceServers);

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('send_candidate', { candidate: event.candidate, roomName });
    }
  };

  peerConnection.ontrack = (event) => {
    if (!remoteStream) {
      remoteStream = new MediaStream();
      remoteVideo.srcObject = remoteStream;
    }
    remoteStream.addTrack(event.track);
  };
}
