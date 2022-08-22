#!/bin/bash
export PATH=$PATH:/usr/bin
echo input.file $1
echo output.file $2
clang -cc1 -x objective-c -fblocks -v "$1" -ast-print > "$2"
