#!/bin/sh

launch_url="$1"
deviceguid="$2"


##########ERROR CODES#########
LAUNCH_FAILED=175

echo "#####"
echo "launch_url:$launch_url , deviceguid:$deviceguid"
echo "#####"

echo "------------------------------------------------------------------------------------------------------"
echo "Launching Emulator in MAC.."
echo "------------------------------------------------------------------------------------------------------"

osascript -e "tell application \"Simulator\" to quit"
open -a "Simulator" --args -CurrentDeviceUDID ${deviceguid}
sleep 10

xcrun simctl openurl ${deviceguid} ${launch_url}


echo "------------------------------------------------------------------------------------------------------"
echo "The App is now running in simulator" 
echo "------------------------------------------------------------------------------------------------------"
exit 0
