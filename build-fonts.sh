#!/usr/bin/env bash

set -exo pipefail

for p in $(cat plans-to-build.txt | tr $'\n' ' '); do
	echo "start building $p"
	npm run build -- ttf::$p
done
