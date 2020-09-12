# slave-leech


Simple API used to receive workload from a benchmark tool. By using this API combined with [Hey](https://github.com/rakyll/hey) is possible to determine the percentage of CPU usage that you want to achieve (50%, 200%..). These technologies combined are used to test the kubernetes autoscaling features (horizontal and vertical) and analyze in which cenarios each approach is better. I pretend to launch an article about this soon. 

### Requirements

* Hey (Optional / not necessary to run the application)
* Minikube
* Kubernetes
* Docker
* Metrics-server enabled

### Usage example

Go to k8s folder and choose if you wanna the vertical or horizontal autoscaler configuration running, go to the respective folder and run:

```
kubectl apply -f .
```

To run the experiment and send worload to application you need to identify the endpoint of the application by running:

```
minikube service slave-leech-deployment
```
Then you can run the scenarios of the experiment in the folder 'bench'. If you ran the vertical pod autoscaler deployment, you need to run the scenarios in the folder vpa-experiment. Example: Go to the first-experiment folder located inside vpa-experiment folder and run:

```
 ./first_scenario.sh
```
Remember that you need to install Hey.

## Technologies used

* [Hey](https://github.com/rakyll/hey) - benchmark tool used
* [npm](https://www.npmjs.com/) - Dependency Management
* [Expressjs](https://expressjs.com/) - Nodejs web application framework
* [Nodejs](https://nodejs.org/en/) - Client-side framework used
* [Kubernetes] (https://kubernetes.io/) - Container orchestrator used
* [Minikube] (https://kubernetes.io/docs/setup/learning-environment/minikube/) - Cluster creation.




