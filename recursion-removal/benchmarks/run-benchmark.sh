#!/bin/sh

node --expose-gc benchmark-recursive.mts
node --expose-gc benchmark-iterative.mts