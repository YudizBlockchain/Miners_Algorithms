

const x11 = require('./build/Release/x11hash.node');

const data = new Buffer('02000000b67a40f3cd5804437a108f105533739c37e6229bc1adcab385140b59fd0f0000a71c1aade44bf8425bec0deb611c20b16da3442818ef20489ca1e2512be43eef814cdb52f0ff0f1edbf70100', 'hex');
var hashed = x11.digest(data);

console.log('algorithm',hashed);
