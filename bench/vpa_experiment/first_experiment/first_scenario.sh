#!/bin/bash
HOST=$1
SERVICE_TIME=100
DURATIONS=(300 300 300 300)
REQUEST_RATE=(5 10 20 5)
LOGS_DIR=logs
LOG_SUBDIR=""

function create_dir(){
    if [ ! -d "$LOGS_DIR" ]; then
        mkdir "$LOGS_DIR"
    fi
    mkdir "logs/$1"
    mkdir "logs/${1}/node"
    mkdir "logs/${1}/vpa"
}

function cpu_usage_requests(){
    for value in {1..30}
    do
        echo "Saving vertical pod autoscaler recommendations.."
        (kubectl describe vpa my-vpa | tail -n 16) > "logs/${LOG_SUBDIR}/vpa/vpa=${value}-$(date +%r).log"
        echo "Done"

        echo "Saving information about node usage.."
        (kubectl top nodes) > "logs/${LOG_SUBDIR}/node/node=${value}-$(date +%r).log"
        echo "Done"
        sleep 10;
    done
}

function generate_workload(){
    for value in {0..3}
    do
        LOG_SUBDIR="bench_$value"
        create_dir $LOG_SUBDIR

        echo "Starting benchmark with duration = ${DURATIONS[value]} and request rate = ${REQUEST_RATE[value]}"
        cpu_usage_requests &
        (hey -z ${DURATIONS[value]}s -c ${REQUEST_RATE[value]} -q 1 -m GET -T “application/x-www-form-urlencoded” ${HOST}${SERVICE_TIME}) > "logs/${LOG_SUBDIR}/hey=${value}-$(date +%r).log"
        echo "Benchmark number $value finished."
    done
    echo "Experiment finished."
}

generate_workload

