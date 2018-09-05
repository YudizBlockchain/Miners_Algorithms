


const
io = require("socket.io-client"),
ioClient = io.connect("http://192.168.10.169:8000");

ioClient.on("seq-num", (msg) => console.info(msg));



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
        
        console.log();
        
        console.log('_________________ARGV-ARGUMENTS__________________');
       
       console.log();
        
        console.log(argv);
        console.log();
        console.log();
        

        console.log('__________________options__________________');
        console.log();

        var options = Object.assign({}, defaults, argv);
        console.log(options);
        console.log();

        //console.log('***************dfysgdahsdghags********************');
        
        //console.log(options);

       
       
        console.log();
        var merkle_root = $.sha256d(createTx(options));
        console.log();
        
        console.log('________________MerkelRoot________________________');
        console.log(merkle_root.toString('hex') );
       
        console.log();
        console.log();

        
        var genesisblock = createBlock(merkle_root, options);
        console.log('________________gensis block________________________');
        console.log(genesisblock.toString('hex'));
        console.log();
        console.log();

        console.log("---------------");
        console.log("algorithm: %s", options.algorithm);
        console.log("pzTimestamp: %s", options.timestamp);
        console.log("pubkey: %s", options.pubkey);
        console.log("bits: %s", options.bits);
        console.log("time: %s", options.time);
        console.log("merkle root hash: %s", $.reverseBuffer(merkle_root).toString('hex'));

         var sha1;
       PoW(genesisblock, options);
    //     console.log('&&&&&&&&&&&&&',sha1);

    //     genesisblock=createBlock($.reverseBuffer(merkle_root).toString('hex'),options);


    //    sha1=PoW(genesisblock,options);

    //    genesisblock=createBlock($.reverseBuffer(merkle_root).toString('hex'),options);

    //    sha1=PoW(genesisblock,options);

    //     //console.log("merkle root hash: %s", $.reverseBuffer(merkle_root).toString('hex'));

    })
    .argv;


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

    console.log();
    console.log('____________options________________');   
    console.log(options);
    console.log();
    console.log();

    console.log('______input_____');
    var input = createInputScript(options);
    console.log(input.toString('hex'));
    console.log();
    console.log();

    
    console.log('____________output______________');
    var out = createOutputScript(options);
    console.log(out.toString('hex'));
    console.log();
    console.log();

    
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

        console.log();
        console.log('___________txBuffer_______________');
    var tx = Buffer.alloc(size);
    console.log(tx);
    console.log();
    console.log();

    var position = 0;
    console.log('___________txBuffer 1_______________');
    tx.writeIntLE(1, position, true);
    console.log(tx);
    console.log();
    console.log();

    console.log('___________txBuffer 1+4 _______________');
    tx.writeIntLE(1, position += 4, true);
    console.log(tx);
    console.log();
    console.log();

    console.log('___________txBuffer 32 _______________');
    tx.write(new Buffer(32).toString('hex'), position += 1, 32, 'hex');
    console.log(tx);
    console.log();
    console.log();

    console.log('___________txBuffer 32 oxFF_______________');
    tx.writeInt32LE(0xFFFFFFFF, position += 32, true);
    console.log(tx);
    console.log();
    console.log();

    console.log('___________txBuffer 32 oxFF + 4_______________');
    tx.writeIntLE(input.length, position += 4, true);
    console.log(tx);
    console.log();
    console.log();

    console.log('___________txBuffer 32 oxFF + 4 + 1_______________');
    tx.write(input.toString('hex'), position += 1, input.length, "hex");
    console.log(tx);
    console.log();
    console.log();

    console.log('___________txBuffer 32 oxFF + 4 + 1_______________');
    tx.writeInt32LE(0xFFFFFFFF, position += input.length, true);
    console.log(tx);
    console.log();
    console.log();

    console.log('___________txBuffer 32 oxFF + 4 + 1 + 4_______________');
    tx.writeIntLE(1, position += 4);
    console.log(tx);
    console.log();
    console.log();

    console.log('___________txBuffer 32 oxFF + 4 + 1 + 4+ buffer_______________');
    tx.write(Buffer.from($.numToBytes(options.value)).toString('hex'), position += 1, 8, 'hex'); 
    console.log(tx);
    console.log();
    console.log();

    console.log('___________txBuffer 32 oxFF + 4 + 1 + 4+ buffer+ 0*43_______________');
    tx.writeInt32LE(0x43, position += 8);
    console.log(tx);
    console.log();
    console.log();

    console.log('___________txBuffer 32 oxFF + 4 + 1 + 4+ buffer_______________');
    tx.write(out.toString('hex'), position += 1, out.length, "hex");
    console.log(tx);
    console.log();
    console.log();

    console.log('___________txBuffer 32 oxFF + 4 + 1 + 4+ buffer+locktime_______________');
    tx.writeIntLE(options.locktime, position += out.length);
    console.log(tx);
    console.log();
    console.log();

   

    return tx;

};


function createBlock(merkleRoot, options) {


    console.log('____________merkleRoot_________');
    console.log();
    console.log(merkleRoot);
    console.log();
    console.log();




console.log('____________BUffer _______________');
    var block = Buffer.alloc(80);
    console.log(block);
    console.log();
    console.log();

    var position = 0;

    console.log('____________BUffer _______________');
    block.writeIntLE(1, position); 
    console.log(block.toString('hex'));
    console.log();
    console.log();

    console.log('____________BUffer32_______________');
    block.write(new Buffer(32).toString('hex'), position += 4, 32, 'hex');
    console.log(block.toString('hex'));
    console.log();
    console.log();

    console.log('____________BUffer32 merkle tree_______________');
    block.write(merkleRoot.toString('hex'), position += 32, 32, 'hex');
    console.log(block.toString('hex'));
    console.log();
    console.log();
    
    //console.log('merkelroot-tree',merkleRoot.toString('hex'),'position=',position);
    console.log('____________BUffer32 merkle tree +32 _______________');
    block.writeInt32LE(options.time, position += 32);
    console.log(block.toString('hex'));
    console.log();
    console.log();
    
    //console.log('optional.time',options.time,'position=',position);
    
    console.log('____________BUffer32 merkle tree +32 _______________');
    block.writeInt32LE(options.bits, position += 4);
    console.log(block.toString('hex'));
    console.log();
    console.log();
    
    console.log('____________BUffer32 merkle tree +32 + nonces _______________');
    block.writeIntLE(options.nonce, position += 4);
    console.log(block.toString('hex'));
    console.log();
    console.log();
    
    
   // console.log('created block',block.toString('hex'));
    

    return block;

};

function PoW(data, options) {


   console.log('____________________________data______________________');
   console.log(data.toString('hex'));
   console.log();



   console.log();
   console.log('_____________________options_______________');
   console.log(options);
   console.log(); 
   console.log();

    console.log('Searching for genesis hash...');
    var nonce = options.nonce;
    var hash = $.reverseBuffer(Hash[options.algorithm](data)).toString('hex');
        
        
        
        console.log('__________________hash____________________');
        console.log(hash);
        console.log();
        

    while (true) {

        var hash = $.reverseBuffer(Hash[options.algorithm](data)).toString('hex');
        
        
      
        


        if (hash.match(/^0000/)) {
            console.log("nonce: %s", nonce);
            console.log("genesis hash: %s", hash);

            ioClient.on('news', function (data) {
                console.log(data);
                ioClient.emit('my other event', { hash: hash,nounce : nonce });
              });
            
            return;
        } else {

            nonce += 1;

            console.log('hash reached by you :',hash);
            console.log('nonce = ',nonce);

    

            data.writeInt32LE(nonce, data.length - 4);
        }

    }

    

}






// ioClient.on('news', function (data) {
//     console.log(data);
//     ioClient.emit('my other event', { hash: hash,nounce : nonce });
//   });



