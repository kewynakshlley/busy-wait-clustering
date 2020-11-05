# slave-leech


Simple API used to receive workload from a benchmark tool. By using this API combined with [Hey](https://github.com/rakyll/hey) is possible to determine the percentage of CPU usage that you want to achieve (50%, 200%..). These technologies combined are used to test the kubernetes autoscaling features (horizontal and vertical) and analyze in which cenarios each approach is better. I pretend to launch an article about this soon. 

### Requirements

* Hey (Optional / not necessary to run the application)
* Docker

### Usage example

Remember that you need to install Hey.

run the application using node start.js or docker run

use: hey -z 300s -c 20 -q 1 -m GET -T “application/x-www-form-urlencoded” localhost:300/busy-wait/100

It will generate a traffic intensity of 200% for 5 minutes and u  will need at least 2 servers to deal with this workload.

## Technologies used

* [npm](https://www.npmjs.com/) - Dependency Management
* [Expressjs](https://expressjs.com/) - Nodejs web application framework
* [Nodejs](https://nodejs.org/en/) - Client-side framework used





