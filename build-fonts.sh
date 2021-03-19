#!/usr/bin/env bash

set -eo pipefail


function buildPlans() {
	for p in $1; do
		echo "start building $type::$p"
		# npm run build -- $type::$p
	done
}

export PATH="$(pwd)/node_modules/.bin:$PATH"

type="${1%::*}"
plan="${1#*::}"

[ "$type" == "$plan" ] && type='ttf'

[ ! -z $plan ] && {
	plans=$(grep -E "$plan" plans-to-build.txt || true)
	if [ -z "$plans" ]; then
		echo "invalid plan $type::$plan"
		exit 1
	else
		buildPlans "$plans"
		exit 0
	fi
}

buildPlans "$(cat plans-to-build.txt | xargs)"
