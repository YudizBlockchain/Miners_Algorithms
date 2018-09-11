var fs = require('fs');


var $ = require("./utils");
var Hash = require('multi-hashing');

const
io = require("socket.io-client"),
ioClient = io.connect("http://localhost:8000");

//ioClient.on("seq-num", (msg) => console.info(msg));



ioClient.on('prateek', function (data) {
    console.log(data);
     ioClient.emit('my-Prateek', { my:'Prateek'},function(data,options,flag){

        console.log(data);
        console.log(options);
        console.log(flag);
        console.log('Searching for genesis hash...');

        var nonce = options.nonce;
        var hash = $.reverseBuffer(Hash[options.algorithm](data)).toString('hex');
            
            
            
            console.log('__________________hash____________________');
            console.log(hash);
            console.log();
            
    
        while (true) {
    
            var hash = $.reverseBuffer(Hash[options.algorithm](data)).toString('hex');
            
            console.log(hash);
         
         console.log('flag varible ',flag);
            if (hash.match(flag)){
                console.log("nonce: %s", nonce);
                console.log("genesis hash: %s", hash);

                return;

            } else {
    
                nonce += 1;
                console.log(nonce);
                data.writeInt32LE(nonce, data.length - 4);
                
            }
    
        }


     });
    
 });

