var fs = require('fs');


var $ = require("./utils");
var Hash = require('multi-hashing');

var defaults = {
    time: Math.round((new Date()).getTime() / 1000),
    timestamp: "Yudiz make Block",
    nonce: 1,
    algorithm: 'geek',
    pubkey: '04678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf1177f',
    value: 5000000000,
    bits: 0x1e0ffff0,
    locktime: 0
}



const
    io = require("socket.io"),
    server = io.listen(8000);

let
    sequenceNumberByClient = new Map();

server.on("connection", (socket) => {

    var currentSearchResult =`Miner connected [id=${socket.id}]`;
   // var address = socket.handshake.address;
    var address = socket.request.connection.remoteAddress;


    
    socket.emit('news', { hello: 'Miner' });
    socket.on('my other event', function (data) {
    console.log(data);
    var json = JSON.stringify(['Your mining ID' + ': ', currentSearchResult," Miner IP is  "+ ":",address,"Hash generated and nounce"+":",data]);
    fs.appendFile("/Users/yudiz/Documents/testing-folder/socket-server/results.json", json , function (err) {
     if (err) throw err;
     console.log('Added!');
    });
    });



    //NEW Function called //

    socket.emit('prateek', { hello: 'Miner' });
    socket.on('my-Prateek', function (data,callback) {
 
    

            const argv = require('yargs')
            .alias('t', 'time')
            .alias('z', 'timestamp')
            .alias('n', 'nonce')
            .alias('a', 'algorithm')
            .alias('p', 'pubkey')
            .alias('v', 'value')
            .alias('b', 'bits')
            .alias('l', 'locktime')
            .alias('h', 'help')
            .help()
            .command('*', 'create genesis block', () => { }, (argv) => {
                
              
        
                var options = Object.assign({}, defaults, argv);
           
                var merkle_root = $.sha256d(createTx(options));
               
                var genesisblock = createBlock(merkle_root, options);
             
               var flag='^0000';
               
              //   console.log("---------------");
              //   console.log("algorithm: %s", options.algorithm);
              //   console.log("pzTimestamp: %s", options.timestamp);
              //   console.log("pubkey: %s", options.pubkey);
              //   console.log("bits: %s", options.bits);
              //   console.log("time: %s", options.time);
              //   console.log("merkle root hash: %s", $.reverseBuffer(merkle_root).toString('hex'));
        
                 var sha1;
                 callback(genesisblock,options,flag);

               //PoW(genesisblock, options);
               //flag = validation(genesisblock,options);

              
              
               
            })
            .argv;
              
       
      function validation(data, options){
        var nonce = options.nonce;
         var hash = $.reverseBuffer(Hash[options.algorithm](data)).toString('hex');

         if (hash.match(/^0/)){
             return true;
         }
         else{
             return false;
         }

      }
      
      function createInputScript(options) {
          var tz = options.timestamp;
          var psz_prefix = tz.length > 76 ? '4c' : '';
          var script_prefix = '04ffff001d0104' + psz_prefix + Buffer.from(String.fromCharCode(tz.length)).toString('hex');
          return Buffer.from(script_prefix + Buffer.from(tz).toString('hex'), 'hex');
      }
      
      function createOutputScript(options) {
          return Buffer.from('41' + options.pubkey + 'ac', 'hex');
      }
      
      
      function createTx(options) {
      
          var input = createInputScript(options);
         
          var out = createOutputScript(options);
        
          var size = 4    
              + 1   
              + 32  
              + 4   
              + 1   
              + input.length
              + 4   
              + 1   
              + 8   
              + 1   
              + out.length
              + 4;   
      
           
          var tx = Buffer.alloc(size);
          
      
          var position = 0;
          
          tx.writeIntLE(1, position, true);
    
          tx.writeIntLE(1, position += 4, true);
         
          tx.write(new Buffer(32).toString('hex'), position += 1, 32, 'hex');
         
          tx.writeInt32LE(0xFFFFFFFF, position += 32, true);
          
          tx.writeIntLE(input.length, position += 4, true);
          
          tx.write(input.toString('hex'), position += 1, input.length, "hex");
          
          tx.writeInt32LE(0xFFFFFFFF, position += input.length, true);
        
          tx.writeIntLE(1, position += 4);
         
          tx.write(Buffer.from($.numToBytes(options.value)).toString('hex'), position += 1, 8, 'hex'); 
        
          tx.writeInt32LE(0x43, position += 8);
        
          tx.write(out.toString('hex'), position += 1, out.length, "hex");
         
          tx.writeIntLE(options.locktime, position += out.length);
       
      
          return tx;
      
      };
      
      
      function createBlock(merkleRoot, options) {
     
          var block = Buffer.alloc(80);
          
          var position = 0;
      
          block.writeIntLE(1, position); 
         
          block.write(new Buffer(32).toString('hex'), position += 4, 32, 'hex');
    
          block.write(merkleRoot.toString('hex'), position += 32, 32, 'hex');

          
          block.writeInt32LE(options.time, position += 32);
        
          block.writeInt32LE(options.bits, position += 4);
        
          
          block.writeIntLE(options.nonce, position += 4);
        
      
          return block;
      
      };
      
      function PoW(data, options) {
      
      
          console.log('Searching for genesis hash...');
          var nonce = options.nonce;
          var hash = $.reverseBuffer(Hash[options.algorithm](data)).toString('hex');
              
              
              
              console.log('__________________hash____________________');
              console.log(hash);
              console.log();
              
        
      
          while (true) {
      
              var hash = $.reverseBuffer(Hash[options.algorithm](data)).toString('hex');
              
          
              if (hash.match(/^00/)) {
                  console.log("nonce: %s", nonce);
                  console.log("genesis hash: %s", hash);

                  var json = JSON.stringify(['Your mining ID' + ': ', currentSearchResult," Miner IP is  "+ ":",address,"Hash generated and nounce"+":",hash,nonce]);
                    fs.appendFile("/Users/yudiz/Documents/testing-folder/socket-server/results.json", json , function (err) {
                    if (err) throw err;
                        console.log('Added!');
                             });
      
                  // ioClient.on('news', function (data) {
                  //     console.log(data);
                  //     ioClient.emit('my other event', { hash: hash,nounce : nonce });
                  //   });
                  
                  return;
              } else {
      
                  nonce += 1;
      
                  data.writeInt32LE(nonce, data.length - 4);
              }
      
          }
      
          
      
      }

    
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
