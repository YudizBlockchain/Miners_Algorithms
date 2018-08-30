
var AES = require("crypto-js/aes");
var sha1 = require("crypto-js/sha256");

var $ = require("./utils");
var Hash = require('multi-hashing');
var x11 = require('x11-hash-js');


class Block{
	constructor(index, data, prevHash,merkel){
	this.index = index;
    this.timestamp = Math.floor(Date.now() / 1000);
    this.data = data;
    this.prevHash = prevHash;
    this.merkel=merkel;
    this.hash = this.getHash();

    
    
    
}
    
    getHash(){
        
      let   block = Buffer.alloc(80);
     
      var position = 0;

      block.writeIntLE(1, position); 
      block.write(new Buffer(32).toString('hex'), position += 4, 32, 'hex');
      block.write(this.merkel.toString(), position += 18, 28, 'hex');
      block.writeInt32LE(this.timestamp.toString(), position += 32);
      block.writeInt32LE(this.index.toString(), position += 4);
      block.write(this.data.toString(), position += 4,  22,'hex');
      block.write(this.prevHash.toString(),position+=4,8,'hex');

      var hash = $.reverseBuffer(x11.digest(block.toString())).toString('hex');
      
      if (hash.match(/^00/)) {
     
        console.log("genesis hash: %s", hash);
        return;
    } else {

        nonce += 1;

    
    }

     console.log("block",block)
        
        return sha1(JSON.stringify(this.data) + this.prevHash + this.index + this.timestamp + this.merkel);
        
    }

     
  

    
    
}

class BlockChain{


	constructor(){
		this.chain = [];
    }
    

    addBlock(data){
        let index = this.chain.length;
        
       
        let prevHash = this.chain.length !== 0 ? this.chain[this.chain.length - 1].hash : 0;
        let merkel = this.chain.length !== 0 ? this.chain[0].hash : 0;
       
        let nounce =0;
        
        let block = new Block(index, data, prevHash,merkel);
        
        this.chain.push(block);
    }

    chainIsValid(){

        for(var i=0;i<this.chain.length;i++){
    
            if(this.chain[i].hash !== this.chain[i].getHash()) 
                return false;
    
            if(i > 0 && this.chain[i].prevHash !== this.chain[i-1].hash)
                return false;
        }
    
        return true;
    }
}


const YudizCode = new BlockChain();

YudizCode.addBlock({sender: "Bruce wayne", reciver: "Tony stark", amount: 100});
YudizCode.addBlock({sender: "Harrison wells", reciver: "Han solo", amount: 50});
YudizCode.addBlock({sender: "Tony stark", reciver: "Ned stark", amount: 75});

console.log(JSON.stringify(YudizCode, null,4));

console.log("Validity: ", YudizCode.chainIsValid());

YudizCode.chain[0].data.reciver = "Joker";

console.log("Validity: ", YudizCode.chainIsValid());


