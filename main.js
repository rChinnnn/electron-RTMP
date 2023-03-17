const { app, BrowserWindow } = require('electron')
const NodeMediaServer = require('node-media-server')
const { Server } = require('socket.io')
// const adapter = require('webrtc-adapter')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', function () {
  createWindow()

  const nms = new NodeMediaServer({
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 60,
      ping_timeout: 30
    },
    http: {
      port: 8000,
      allow_origin: '*'
    }
  })

  nms.run()

  const socket = new Server(8080)
  socket.on('start-stream', function () {
    console.log('Start streaming')

    // Start WebRTC stream
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    })
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(function (stream) {
        const videoTrack = stream.getVideoTracks()[0]
        const audioTrack = stream.getAudioTracks()[0]

        peerConnection.addTrack(videoTrack, stream)
        peerConnection.addTrack(audioTrack, stream)

        peerConnection.createOffer()
          .then(function (offer) {
            return peerConnection.setLocalDescription(offer)
          })
          .then(function () {
            socket.emit('offer', peerConnection.localDescription)
          })
      })
      .catch(function (err) {
        console.error('Failed to get user media', err)
      })
  })

  socket.on('answer', function (answer) {
    console.log('Received answer')
    peerConnection.setRemoteDescription(answer)
  })

  socket.on('candidate', function (candidate) {
    console.log('Received candidate')
    peerConnection.addIceCandidate(candidate)
  })

})