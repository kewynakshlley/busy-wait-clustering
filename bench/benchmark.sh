#!/bin/bash
HOST=$1
MIN=$2
LOGS_DIR=logs

if [ ! -d "$LOGS_DIR" ]; then
    mkdir "$LOGS_DIR"
fi

for c in {1..10}
do
	(hey -z ${MIN}m -c $c -q 1 -m GET -T “application/x-www-form-urlencoded” $HOST) > "logs/C=${c}-$(date +%r).log"
done



