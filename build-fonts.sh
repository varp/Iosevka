#!/usr/bin/env bash

set -eo pipefail

export PATH="$(pwd)/node_modules/.bin:$PATH"

type="${1%::*}"
plan="${1#*::}"

[ "$type" == "$plan" ] && type='ttf'

[ ! -z $plan ] && {
	echo "start building $type::$plan"
	npm run build -- $type::$plan
	exit 0
}


plans=($(cat plans-to-build.txt | tr $'\n' ' '))
for p in ${plans[*]}; do
	echo "start building $type::$p"
	npm run build -- $type::$p
done
