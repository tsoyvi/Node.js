const { Worker } = require('worker_threads')
const os = require("os");

const numCPUs = os.cpus().length;


let workerData = { portOfSet: 0 };
const worker1 = new Worker('./chat.js',  { workerData } );
worker1.on("message", console.log);


workerData = { portOfSet: 1 };
const worker2 = new Worker('./file_reader.js', { workerData });
worker2.on("message", console.log);
