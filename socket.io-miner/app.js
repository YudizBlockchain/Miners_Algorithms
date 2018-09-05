var shell = require('shelljs');


//npm  i shelljs
 
// Run external tool synchronously

// 

if (shell.exec('npm i socket.io-client').code !== 0) {
  shell.echo('Error: Failed Command :  npm init -y ');
  shell.exit(1);
}

if (shell.exec('npm i x11-hash-js ').code !== 0) {
  shell.echo('Error: Failed Command  npm install nan node-gyp --save ');
  shell.exit(1);
}

if (shell.exec('npm i multi-hashing').code !== 0) {
  shell.echo('Error:Failed Command node-gyp rebuild ');
  shell.exit(1);
}

if (shell.exec('npm i yargs').code !== 0) {
  shell.echo('Error: Failed command :node x11-call.js ');
  shell.exit(1);
}

if (shell.exec('node client.js').code !== 0) {
    shell.echo('Error: Failed command :node x11-call.js ');
    shell.exit(1);
  }
  
  