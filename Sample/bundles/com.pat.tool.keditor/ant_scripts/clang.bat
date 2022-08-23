@echo on
echo input.file 	%1
echo output.file	%2
clang.exe -cc1 -x objective-c -fblocks -v "%1" -ast-print > "%2"