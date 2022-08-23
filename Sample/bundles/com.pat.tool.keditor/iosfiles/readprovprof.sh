#!/bin/bash
if [ ! -f "$HOME"/provprof.txt ]; then 2> /dev/null; else rm "$HOME"/provprof.txt; fi
cd "$HOME/Library/MobileDevice/Provisioning Profiles" 2>/dev/null
if [ $? != 0 ] ; then
	echo "No provisioning profiles found";
	exit 1
fi
for f in *.mobileprovision;
do
security cms -D -i $f > t.plist
bundle_identifier=`/usr/libexec/PlistBuddy -c 'Print :Entitlements:application-identifier' t.plist`
appIDName=`/usr/libexec/PlistBuddy -c 'Print :Name' t.plist`
echo "$f ($appIDName) ($bundle_identifier)" >> "$HOME"/provprof.txt
done
