import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cluster from 'cluster';
import regeneratorRuntime from "regenerator-runtime";

const app = express();
let workers = [];

const configCluster = () => {
  let numCores = require('os').cpus().length;
  console.log('Master cluster setting up ' + numCores + ' workers');

  for (let i = 0; i < numCores; i++) {
    workers.push(cluster.fork());
    workers[i].on('message', function (message) {
      console.log(message);
    });
  }

  worker_online_log();
  worker_exit_log();
};


const configExpress = () => {

  app.server = http.createServer(app);

  app.use(bodyParser.json({
    limit: '2000kb',
  }));

  app.server.listen(3000, () => {
    console.log('server listening in port 3000');
  });

  app.get('/', function (req, res) {
    res.json({ health: 'UP' });
  })

  app.get('/call', async (req, res) => {
    init();
    res.statusText = 'Request completed'
    return res.status(200).send('Ok')
  });

  app.get('/busy-wait/:time', async (req, res) => {
    var time = req.params.time;
    busyWait(time);
    res.statusText = 'Request completed'
    return res.status(200).send('Ok')
  });

  app.get('/sort/:value', async (req, res) => {
    var valueToSort = req.params.value;
    var max = sort(valueToSort);
    res.statusText = 'Request completed'
    return res.json({maxValue : max});
  });

};

/**
 * Setup server either with clustering or without it
 * @param isClusterRequired
 * @constructor
 */
const setupServer = (isClusterRequired) => {

  if (isClusterRequired && cluster.isMaster) {
    configCluster();
  } else {
    configExpress();
  }
};

function worker_exit_log() {
  cluster.on('exit', function (worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    console.log('Starting a new worker');
    cluster.fork();
    workers.push(cluster.fork());
    workers[workers.length - 1].on('message', function (message) {
      console.log(message);
    });

  });
}

function busyWait(time) {
  var start = new Date();
  var now;
  while (true) {
      now = new Date();
      if (now - start >= time) {
          break;
      }
  }
}

function worker_online_log() {
  cluster.on('online', function (worker) {
    console.log('Worker ' + worker.process.pid + ' is online');
  });
}

async function init() {
  console.log(1);
  while(true){
    await sleep(500);
    break;
  }

}
function sleep(ms) {
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function sort(value) {
  var aux = value;
  let array = [];
  function getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  for (let i = 0 ; i < aux ; i++){
    array.push(getRandom(1, aux));
  }

  var len = array.length, max = -Infinity;
  while (len--) {
    if (Number(array[len]) > max) {
      max = Number(array[len]);
    }
  }
  return max;
};

setupServer(true);



export { app };

