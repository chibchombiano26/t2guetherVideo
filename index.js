(function () {

    var peer = null
    var peerId = null
    var conn = null
    var opponent = {
        peerId: null
    }

    new ClipboardJS('.btn');

    function begin() {
        conn.on('data', function (data) {})
        conn.on('close', function () {

        })
        peer.on('error', function (err) {
            alert('' + err)
        })
    }

    function initialize() {
        peer = new Peer('', {
            host: 'hefesoftartegee.herokuapp.com',
            port: 443,
            path: '/peerjs',
            debug: 3,
            config: {
                'iceServers': [{
                    url: 'stun:stun.l.google.com:19302'
                }, ]
            }
        })
        peer.on('open', function (id) {
            peerId = id
        })
        peer.on('error', function (err) {
            alert('' + err)
        })

        // Heroku HTTP routing timeout rule (https://devcenter.heroku.com/articles/websockets#timeouts) workaround
        function ping() {
            console.log(peer)
            peer.socket.send({
                type: 'ping'
            })
            setTimeout(ping, 16000)
        }
        ping()
    }

    function start() {
        initialize()
        peer.on('open', function () {
            document.getElementById('value').value = peerId;
        })
        peer.on('connection', function (c) {
            if (conn) {
                c.close()
                return
            }
            conn = c
            turn = true
        })

        peer.on('call', function (call) {
            // Answer the call, providing our mediaStream
            call.answer();
            call.on('stream', function (remoteStream) {
                var video = document.getElementById('player');
                video.srcObject = remoteStream;
                video.play();
            });
        });
    }
    start();
})()