var fs = require('fs');




var hashvalue='';


const
    io = require("socket.io"),
    server = io.listen(8000);

let
    sequenceNumberByClient = new Map();

server.on("connection", (socket) => {

    var currentSearchResult =`Miner connected [id=${socket.id}]`;
    
    socket.emit('news', { hello: 'Miner' });
    socket.on('my other event', function (data) {
      console.log(data);
      var json = JSON.stringify(['Your mining IP' + ': ', currentSearchResult,"Hash generated and nounce"+":",data]);
      fs.appendFile("/Users/yudiz/Documents/testing-folder/socket.io rtry/results.json", json , function (err) {
        if (err) throw err;
        console.log('Added!');
     });
    });

    

    console.info(`Client connected [id=${socket.id}]`);
 
    sequenceNumberByClient.set(socket, 1);

    
    socket.on("disconnect", () => {
        sequenceNumberByClient.delete(socket);
        console.info(`Miner removed [id=${socket.id}]`);
    });
});


setInterval(() => {
    for (const [client, sequenceNumber] of sequenceNumberByClient.entries()) {
        client.emit("seq-num", sequenceNumber);
        sequenceNumberByClient.set(client, sequenceNumber + 1);
    }
}, 1000);