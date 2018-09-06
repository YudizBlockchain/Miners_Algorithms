const
io = require("socket.io-client"),
ioClient = io.connect("http://localhost:8000");

ioClient.on("seq-num", (msg) => console.info(msg));



ioClient.on('prateek', function (data) {
    console.log(data);
     ioClient.emit('my-Prateek', { my:'Prateek'});
    
 });


