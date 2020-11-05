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

  app.get('/busy-wait/:time', async (req, res) => {
    var time = req.params.time;
    busyWait(time);
    res.statusText = 'Request completed'
    return res.status(200).send('Ok')
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

setupServer(true);



export { app };

