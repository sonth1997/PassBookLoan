#!/bin/sh


platform="$1"
appID="$2"
username="$3"
windowsuserID="${4}"
jetty_ip="$5"
jetty_port="$6"
sdkVersion="$7"

##########ERROR CODES#########
LAUNCH_FAILED=175

echo "#####"
echo "platform:$platform, appID:$appID, jetty_ip:$jetty_ip, jetty_port:$jetty_port, sdkVersion:$sdkVersion"
echo "#####"

export PATH=/developer/scripts:/applications:/usr/opt/bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/developer/scripts/sbin:/sbin:$PATH
env


scriptpath="$HOME/KonyiOSWorkspace/$windowsuserID/Kony"
chmod 777 $scriptpath/waxsim
killall "iPhone Simulator" 2>/dev/null
safaripath="/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneSimulator.platform/Developer/SDKs/iPhoneSimulator$sdkVersion.sdk/Applications/MobileSafari.app"
if [ "$platform" = "iphone" ] ; then
	$scriptpath/waxsim -f 'iPhone' "$safaripath" > out.txt 2>&1 &
	if [ $? != 0 ] ; then
		exit $LAUNCH_FAILED
	fi
else 
	$scriptpath/waxsim -f 'ipad' "$safaripath" > out.txt 2>&1 &
	if [ $? != 0 ] ; then
		exit $LAUNCH_FAILED
	fi
fi

echo "------------------------------------------------------------------------------------------------------"
echo "Build Complete.  Launching Emulator in MAC.." 
echo "------------------------------------------------------------------------------------------------------"
exit 0
