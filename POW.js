function PoW(data, options) {

    console.log('Searching for genesis hash...');
    var nonce = options.nonce;

    //var target = $.numToBytes((options.bits & 0xffffff) * 2 ** (8 * ((options.bits >> 24) - 3)));
    // console.log('' + target.toString('hex'));    

    while (true) {

        var hash = $.reverseBuffer(Hash[options.algorithm](data)).toString('hex');
        // var hash2 = $.reverseBuffer(hash).toString('hex');
        // var val = parseInt(hash2, 16);

        if (hash.match(/^00007/)) {
            console.log("nonce: %s", nonce);
            console.log("genesis hash: %s", hash);
            return;
        } else {

            nonce += 1;

            //console.log('^^^^^^'+nonce+'');
            //console.log("genesis hash: %s", hash);
            
            // if (nonce % 2000 == 0) {
            //     console.log("nonce: %s | hash: %s ", nonce, hash.toString('hex'));
            // }
            data.writeInt32LE(nonce, data.length - 4);
        }

    }

}

function createBlock(merkleRoot, options) {

    var block = Buffer.alloc(80);
    var position = 0;

    block.writeIntLE(1, position); //version  
    block.write(new Buffer(32).toString('hex'), position += 4, 32, 'hex'); //previousblockhash
    block.write(merkleRoot.toString('hex'), position += 32, 32, 'hex');
    block.writeInt32LE(options.time, position += 32);
    

    block.writeInt32LE(options.bits, position += 4);
  

    block.writeIntLE(options.nonce, position += 4);

    return block;

};
