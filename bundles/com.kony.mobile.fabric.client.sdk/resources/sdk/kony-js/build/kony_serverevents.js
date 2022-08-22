/**
 * kony_serverevents version 9.6.1
 */
       
//#ifdef iphone
//#define PLATFORM_NATIVE_IOS
//#endif
//#ifdef ipad
//#define PLATFORM_NATIVE_IOS
//#endif

//#ifdef android
//#define PLATFORM_NATIVE_ANDROID
//#endif
//#ifdef tabrcandroid
//#define PLATFORM_NATIVE_ANDROID
//#endif

//#ifdef winphone8
//#define PLATFORM_NATIVE_WINDOWS
//#endif
//#ifdef windows8
//#define PLATFORM_NATIVE_WINDOWS
//#endif
//#ifdef desktop_kiosk
//#define PLATFORM_NATIVE_WINDOWS
//#endif

//#ifdef spaip
//#define PLATFORM_SPA
//#endif
//#ifdef spaan
//#define PLATFORM_SPA
//#endif
//#ifdef spabb
//#define PLATFORM_SPA
//#endif
//#ifdef spabbnth
//#define PLATFORM_SPA
//#endif
//#ifdef spawinphone8
//#define PLATFORM_SPA
//#endif
//#ifdef spawindows
//#define PLATFORM_SPA
//#endif
//#ifdef spatabwindows
//#define PLATFORM_SPA
//#endif
//#ifdef spaipad
//#define PLATFORM_SPA
//#endif
//#ifdef spatabandroid
//#define PLATFORM_SPA
//#endif
//#ifdef spaplaybook
//#define PLATFORM_SPA
//#endif
//#ifdef desktopweb
//#define PLATFORM_SPA
//#endif
/**
 * Created by Inderpreet Kaur on 3/1/2020.
 * Copyright © 2020 Kony. All rights reserved.
 */

function initializeWebSocketConstants() {
    if (typeof (kony) === "undefined") {
        kony = {};
    }
    if (typeof (kony.sdk) === "undefined") {
        kony.sdk = {};
    }
    kony.sdk.websocket = kony.sdk.websocket || {};
    kony.sdk.websocket.constants = kony.sdk.websocket.constants || {};

    kony.sdk.websocket.constants = {
        BOOLEAN_TRUE: true,
        X_KONY_AUTHORIZATION: "X-Kony-Authorization",
        X_KONY_CLIENT_UUID: "clientUUID",
        EQUAL_TO: "=",

        // Callback Type Constants
        WEBSOCKET_TYPE_ONERROR: "onError",
        WEBSOCKET_TYPE_ONOPEN: "onOpen",
        WEBSOCKET_TYPE_ONCLOSE: "onClose",
        WEBSOCKET_TYPE_ONMESSAGE: "onMessage",
        WEBSOCKET_TYPE_ONPUBLISH: "onPublish",
        WEBSOCKET_TYPE_ONSUBSCRIBE: "onSubscribe",
        WEBSOCKET_TYPE_ONUNSUBSCRIBE: "onUnsubscribe",
        WEBSOCKET_TYPE_ONPUBLISH_ERROR: "onPublishError",
        WEBSOCKET_TYPE_ONSUBSCRIBE_ERROR: "onSubscribeError",
        WEBSOCKET_TYPE_ONUNSUBSCRIBE_ERROR: "onUnsubscribeError",


        WEBSOCKET_PUBLISH_EVENTS: "events",
        WEBSOCKET_SUBSCRIBE_EVENTS: "subscribe",
        WEBSOCKET_UNSUBSCRIBE_EVENTS: "unsubscribe",
        WEBSOCKET_TOPICS_EVENTS: "topics",

        //Subscribe constants
        WEBSOCKET_SUBSCRIBE_MODE: "subscribeMode",
        WEBSOCKET_MODE_PRIVATE : "private",
        WEBSOCKET_MODE_PUBLIC: "public",

        // UnSubscribe constants
        UNSUBSCRIBE_OPTION_CLOSE_CONNECTION: "closeConnection",
        WEBSOCKET_UNSUBSCRIBE_MODE: "unSubscribeMode",

        // Server Response Constants
        WEBSOCKET_RESPONSE_ACK: "ack",
        WEBSOCKET_RESPONSE_CODE: "code",
        WEBSOCKET_RESPONSE_DATA: "data",
        WEBSOCKET_RESPONSE_TOPIC: "topic",
        WEBSOCKET_RESPONSE_MESSAGE: "message",
        WEBSOCKET_RESPONSE_EVENTS_ID: "eventId",
        WEBSOCKET_RESPONSE_FAILED_EVENTS: "failedTopics",
        WEBSOCKET_RESPONSE_SUCCESSFULL_EVENTS: "successTopics",

        // Websocket log messages
        SERVER_EVENTS_NO_INTERNET_MESSAGE : "No internet available, please check device connectivity",
        SERVER_EVENTS_INITIALISING_MESSAGE : "Websocket is not initialized, initializing the socket instance",
        SERVER_EVENTS_NOT_INITIALISED_MESSAGE : "Websocket is not initialized, cannot perform unsubscribe",
        SERVER_EVENTS_CALLBACKS_ERROR_MESSAGE:"Mandatory callbacks are missing.",
        INVALID_MODE_PROVIDED_MESSAGE: "Server events mode provided is not valid.",
        INVALID_EVENT_STRING_MESSAGE: "Event string passed in event array is not valid."
    };
}
/**
 * Created by Inderpreet Kaur on 3/1/2020.
 * Copyright © 2020 Kony. All rights reserved.
 */

function initializeWebSocketHandler() {
    kony.sdk.websocket = kony.sdk.websocket || {};

    var TAG = "KonyWebSocketHandler : ";

    /**
     *    Generates and returns websocket url.
     */
    kony.sdk.websocket.generateServerEventsURL = function () {

        var url = konyRef.serverEventsUrl;
        var authToken = konyRef.currentClaimToken;
        var clientUUID = konyRef.clientUUID;

        if (!kony.sdk.util.isNullOrEmptyString(authToken) &&
            !kony.sdk.util.isNullOrEmptyString(clientUUID) &&
            !kony.sdk.util.isNullOrEmptyString(url)) {
            url = url + "?" + kony.sdk.websocket.constants.X_KONY_AUTHORIZATION + kony.sdk.websocket.constants.EQUAL_TO + authToken +
                "&" + kony.sdk.websocket.constants.X_KONY_CLIENT_UUID + kony.sdk.websocket.constants.EQUAL_TO + clientUUID;

        } else {
            kony.sdk.logsdk.error(TAG + "generateServerEventsURL:: authToken or serverEventsUrl or clientUUID is null or undefined");
            return null;
        }
        return url;
    };

//#ifdef PLATFORM_SPA

    kony.sdk.websocket.setServerEventsCallbacks = function (onMessage, onError, onClose) {
        var LOG_PREFIX = "kony.sdk.webSocket.setServerEventsCallbacks";
        kony.sdk.logsdk.trace(" Entering " + LOG_PREFIX);

        function onMessageCallback(result) {
            kony.sdk.logsdk.perf("Executing onMessageCallback");
            kony.sdk.verifyAndCallClosure(onMessage, result);
            kony.sdk.logsdk.perf("Executing Finished onMessageCallback");
        }

        function onErrorCallback(error) {
            kony.sdk.logsdk.perf("Executing onErrorCallback");
            kony.sdk.logsdk.error("subscribeServerEvents::onError Error:", error);
            kony.sdk.verifyAndCallClosure(onError, error);
            kony.sdk.logsdk.perf("Executing Finished onErrorCallback");
        }

        function onCloseCallback(result) {
            kony.sdk.logsdk.perf("Executing onCloseCallback");
            kony.sdk.verifyAndCallClosure(onClose, result);
            kony.sdk.logsdk.perf("Executing Finished onCloseCallback");
        }

        kony.sdk.websocket.util.setKonyWebsocketCallbacks({
            "onMessage": onMessageCallback,
            "onError": onErrorCallback,
            "onClose": onCloseCallback
        });

    };

    kony.sdk.websocket.publishServerEvents = function (events, onPublish, publishOptions) {
        var LOG_PREFIX = "kony.sdk.webSocket.publishServerEvents";
        kony.sdk.logsdk.trace(" Entering " + LOG_PREFIX);

        function onPublishCallback(result) {
            kony.sdk.logsdk.perf("Executing onPublishCallback");
            kony.sdk.verifyAndCallClosure(onPublish, result);
            kony.sdk.logsdk.perf("Executing Finished onPublishCallback");
        }

        kony.sdk.websocket.util.setKonyWebsocketCallback({
            "onPublish": onPublishCallback
        });

        kony.sdk.websocket.util.sendWebsocketMessage(events);
    };

    kony.sdk.websocket.subscribeServerEvents = function (url, events, onSubscribe, subscribeOptions) {
        var LOG_PREFIX = "kony.sdk.webSocket.subscribeServerEvents";
        kony.sdk.logsdk.trace(" Entering " + LOG_PREFIX);

        function onSubscribeCallback(result) {
            kony.sdk.logsdk.perf("Executing onSubscribeCallback");
            kony.sdk.verifyAndCallClosure(onSubscribe, result);
            kony.sdk.logsdk.perf("Executing Finished onSubscribeCallback");
        }

        kony.sdk.websocket.util.setKonyWebsocketCallbacks({
            "onSubscribe": onSubscribeCallback
        });

        if(kony.sdk.websocket && !kony.sdk.websocket.isWebSocketAvailable()) {
            kony.sdk.logsdk.info(LOG_PREFIX + kony.sdk.websocket.constants.SERVER_EVENTS_INITIALISING_MESSAGE);
            kony.sdk.websocket.util.openWebSocketHandler(url, events);
        } else {
            kony.sdk.websocket.util.sendWebsocketMessage(events);
        }

    };

    kony.sdk.websocket.unSubscribeServerEvents = function (events, onUnsubscribe, unSubscribeOptions) {
        var LOG_PREFIX = "kony.sdk.webSocket.unSubscribeServerEvents";
        kony.sdk.logsdk.trace(" Entering " + LOG_PREFIX);

        if (unSubscribeOptions &&
            unSubscribeOptions[kony.sdk.websocket.constants.UNSUBSCRIBE_OPTION_CLOSE_CONNECTION] &&
            unSubscribeOptions[kony.sdk.websocket.constants.UNSUBSCRIBE_OPTION_CLOSE_CONNECTION] ===
            kony.sdk.websocket.constants.BOOLEAN_TRUE) {
            kony.sdk.websocket.util.closeWebSocket();
            return;
        }

        function onUnsubscribeCallback(result) {
            kony.sdk.logsdk.perf("Executing unSubscribeServerEvents");
            kony.sdk.verifyAndCallClosure(onUnsubscribe, result);
            kony.sdk.logsdk.perf("Executing Finished unSubscribeServerEvents");
        }

        kony.sdk.websocket.util.setKonyWebsocketCallbacks({
            "onUnsubscribe": onUnsubscribeCallback
        });

        if(!kony.sdk.util.isNullOrUndefinedOrEmptyObject(events)) {
            kony.sdk.websocket.util.sendWebsocketMessage(events);
        } else{
            kony.sdk.websocket.util.raiseError(LOG_PREFIX + "events is null or undefined");
            return;
        }

    };

    kony.sdk.websocket.isWebSocketAvailable = function() {
        var LOG_PREFIX = "kony.sdk.webSocket.isWebSocketAvailable";
        kony.sdk.logsdk.trace(" Entering " + LOG_PREFIX);
        return kony.sdk.websocket.util.isInternalWebSocketAvailable();
    };
//#endif

//#ifdef PLATFORM_NATIVE_IOS
// iOS Web socket native bindings

    kony.sdk.websocket.setServerEventsCallbacks = function (onMessage, onError, onClose) {
        var LOG_PREFIX = "kony.sdk.webSocket.setServerEventsCallbacks";
        kony.sdk.logsdk.trace(" Entering " + LOG_PREFIX);

        var KonyWebSocketObj = kony.sdk.KonyWebSocketClasses.import();
        var KonyWebSocketInstance = KonyWebSocketObj.KonyWebSocket.alloc().jsinit();
        KonyWebSocketInstance.setServerEventsCallbacksOnErrorOnClose(onMessage, onError, onClose);
    };

    kony.sdk.websocket.subscribeServerEvents = function (url, events, onSubscribe, subscribeOptions) {
        var LOG_PREFIX = "kony.sdk.webSocket.subscribeServerEvents";
        kony.sdk.logsdk.trace(" Entering " + LOG_PREFIX);

        var KonyWebSocketObj = kony.sdk.KonyWebSocketClasses.import();
        var KonyWebSocketInstance = KonyWebSocketObj.KonyWebSocket.alloc().jsinit();
        KonyWebSocketInstance.subscribeServerEventsEventsOnSubscribeSubscribeOptions(url, events, onSubscribe, subscribeOptions);
    };

    kony.sdk.websocket.unSubscribeServerEvents = function (events, onUnsubscribe, unSubscribeOptions) {
        var LOG_PREFIX = "kony.sdk.webSocket.unSubscribeServerEvents";
        kony.sdk.logsdk.trace(" Entering " + LOG_PREFIX);

        var KonyWebSocket = kony.sdk.KonyWebSocketClasses.import();
        var KonyWebSocketInstance = KonyWebSocket.KonyWebSocket.alloc().jsinit();
        KonyWebSocketInstance.unSubscribeServerEventsOnUnsubscribeUnSubscribeOptions(events, onUnsubscribe, unSubscribeOptions);
    };

    kony.sdk.websocket.isWebSocketAvailable = function() {
        var LOG_PREFIX = "kony.sdk.webSocket.isWebSocketAvailable";
        kony.sdk.logsdk.trace(" Entering " + LOG_PREFIX);

        var KonyWebSocket = kony.sdk.KonyWebSocketClasses.import();
        var KonyWebSocketInstance = KonyWebSocket.KonyWebSocket.alloc().jsinit();

        return KonyWebSocketInstance.isWebSocketAvailable();
    };
//#endif

//#ifdef PLATFORM_NATIVE_ANDROID
// android Web socket native bindings

// Converts json to HashMap
    kony.sdk.KonyWebSocketClasses.createHashMapFromJSONObject = function (json, logPrefix) {
        if (!json) {
            return null;
        }

        jsonString = JSON.stringify(json);
        kony.sdk.logsdk.debug(logPrefix + " : " + jsonString);
        JavaClasses = kony.sdk.JavaClasses.import();
        return new JavaClasses.Gson().fromJson(jsonString, JavaClasses.HashMap.class);
    };

    KonyWebSocketClasses = null;
// Initialization
    kony.sdk.KonyWebSocketClasses.init = function () {
        if (KonyWebSocketClasses == null) {
            KonyWebSocketClasses = kony.sdk.KonyWebSocketClasses.import();
        }
    };

    // Creates an instance of Message Callback
    kony.sdk.KonyWebSocketClasses.createMessageCallback = function (onMessageCallback, messageLog) {
        kony.sdk.KonyWebSocketClasses.init();

        onMessageMethod = function (res) {
            kony.sdk.logsdk.debug(messageLog);
            onMessageCallback(res);
        };

        var messageCallback = new KonyWebSocketClasses.MessageCallback();
        messageCallback.onMessageCallback = onMessageMethod;
        messageCallback.onMessageLog = messageLog;

        return messageCallback;
    };

    // Creates an instance of Error Callback
    kony.sdk.KonyWebSocketClasses.createErrorCallback = function (onErrorCallback, errorLog) {
        kony.sdk.KonyWebSocketClasses.init();

        onErrorMethod = function (err) {
            kony.sdk.logsdk.debug(errorLog);
            onErrorCallback(err);
        };

        var errorCallback = new KonyWebSocketClasses.ErrorCallback();
        errorCallback.onErrorCallback = onErrorMethod;
        errorCallback.onErrorLog = errorLog;

        return errorCallback;
    };

    // Creates an instance of Close Callback
    kony.sdk.KonyWebSocketClasses.createCloseCallback = function (onCloseCallback, closeLog) {
        kony.sdk.KonyWebSocketClasses.init();

        onCloseMethod = function (res) {
            kony.sdk.logsdk.debug(closeLog);
            onCloseCallback(res);
        };

        var closeCallback = new KonyWebSocketClasses.CloseCallback();
        closeCallback.onCloseCallback = onCloseMethod;
        closeCallback.onCloseLog = closeLog;

        return closeCallback;
    };

    // Creates an instance of Subscribe Callback
    kony.sdk.KonyWebSocketClasses.createSubscribeCallback = function (onSubscribeCallback, subscribeLog) {
        kony.sdk.KonyWebSocketClasses.init();

        onSubscribeMethod = function (res) {
            kony.sdk.logsdk.debug(subscribeLog);
            onSubscribeCallback(res);
        };

        var subscribeCallback = new KonyWebSocketClasses.SubscribeCallback();
        subscribeCallback.onSubscribeCallback = onSubscribeMethod;
        subscribeCallback.onSubscribeLog = subscribeLog;

        return subscribeCallback;
    };

    // Creates an instance of UnSubscribe Callback
    kony.sdk.KonyWebSocketClasses.createUnSubscribeCallback = function (onUnSubscribeCallback, unSubscribeLog) {
        kony.sdk.KonyWebSocketClasses.init();

        onUnSubscribeMethod = function (res) {
            kony.sdk.logsdk.debug(unSubscribeLog);
            onUnSubscribeCallback(res);
        };

        var unSubscribeCallback = new KonyWebSocketClasses.UnSubscribeCallback();
        unSubscribeCallback.onUnSubscribeCallback = onUnSubscribeMethod;
        unSubscribeCallback.onUnSubscribeLog = unSubscribeLog;

        return unSubscribeCallback;
    };

    kony.sdk.websocket.setServerEventsCallbacks = function (onMessage, onError, onClose, setupOptions) {
        var LOG_PREFIX = "kony.sdk.webSocket.setServerEventsCallbacks";
        kony.sdk.logsdk.trace(" Entering " + LOG_PREFIX);

        kony.sdk.KonyWebSocketClasses.init();
        var setServerEventsCallbacks = "setServerEventsCallbacks: ";

        var messageCallback = kony.sdk.KonyWebSocketClasses.createMessageCallback(onMessage, setServerEventsCallbacks + "onMessage Callback");
        var errorCallback = kony.sdk.KonyWebSocketClasses.createErrorCallback(onError, setServerEventsCallbacks + "onError Callback");
        var closeCallback = kony.sdk.KonyWebSocketClasses.createCloseCallback(onClose, setServerEventsCallbacks + "onClose Callback");
        var setupOptionsMap = kony.sdk.KonyWebSocketClasses.createHashMapFromJSONObject(setupOptions, "setupOptions");
        KonyWebSocketClasses.KonyWebSocketInterface.setServerEventsCallbacks(messageCallback, errorCallback, closeCallback, setupOptionsMap);
    };

    kony.sdk.websocket.subscribeServerEvents = function (url, events, onSubscribe, subscribeOptions) {
        var LOG_PREFIX = "kony.sdk.webSocket.subscribeServerEvents";
        kony.sdk.logsdk.trace(" Entering " + LOG_PREFIX);

        kony.sdk.KonyWebSocketClasses.init();
        var subscribeEvents = "SubscribeServerEvents: ";

        var subscribeCallback = kony.sdk.KonyWebSocketClasses.createSubscribeCallback(onSubscribe, subscribeEvents + "onSubscribe Callback");
        var subscribeOptionsMap = kony.sdk.KonyWebSocketClasses.createHashMapFromJSONObject(subscribeOptions, "subscribeOptions");
        KonyWebSocketClasses.KonyWebSocketInterface.subscribeServerEvents(url, events, subscribeCallback, subscribeOptionsMap);
    };

    kony.sdk.websocket.unSubscribeServerEvents = function (events, onUnSubscribe, unSubscribeOptions) {
        var LOG_PREFIX = "kony.sdk.webSocket.unSubscribeServerEvents";
        kony.sdk.logsdk.trace(" Entering " + LOG_PREFIX);

        kony.sdk.KonyWebSocketClasses.init();
        var unSubscribeEvents = "UnSubscribeServerEvents: ";

        var unSubscribeCallback = kony.sdk.KonyWebSocketClasses.createUnSubscribeCallback(onUnSubscribe,
            unSubscribeEvents + "onUnSubscribe Callback");
        var unSubscribeOptionsMap = kony.sdk.KonyWebSocketClasses.createHashMapFromJSONObject(unSubscribeOptions, "unSubscribeOptions");
        KonyWebSocketClasses.KonyWebSocketInterface.unSubscribeServerEvents(events, unSubscribeCallback, unSubscribeOptionsMap);
    };

    kony.sdk.websocket.isWebSocketAvailable = function() {
        var LOG_PREFIX = "kony.sdk.webSocket.isWebSocketAvailable";
        kony.sdk.logsdk.trace(" Entering " + LOG_PREFIX);

        kony.sdk.KonyWebSocketClasses.init();
        return KonyWebSocketClasses.KonyWebSocketInterface.isWebSocketAvailable();
    };
//#endif

//#ifdef PLATFORM_NATIVE_WINDOWS
    kony.sdk.websocket.setServerEventsCallbacks = function () {
        kony.sdk.logsdk.warn("kony.sdk.websocket.setServerEventsCallbacks:: Websocket is not supported for windows");
        return null;
    };

    kony.sdk.websocket.subscribeServerEvents = function () {
        kony.sdk.logsdk.warn("kony.sdk.websocket.subscribeServerEvents:: Websocket is not supported for windows");
        return null;
    };

    kony.sdk.websocket.unSubscribeServerEvents = function () {
        kony.sdk.logsdk.warn("kony.sdk.websocket.unSubscribeServerEvents:: Websocket is not supported for windows");
        return null;
    };

    kony.sdk.websocket.isWebSocketAvailable = function() {
        kony.sdk.logsdk.warn("kony.sdk.websocket.isWebSocketAvailable:: Websocket is not supported for windows");
        return false;
    };
//#endif
}
//#ifdef PLATFORM_SPA
/**
 * Created by Inderpreet Kaur on 3/1/2020.
 * Copyright © 2020 Kony. All rights reserved.
 */
function initializeWebSocketManager() {
    if (typeof(kony) === "undefined") {
        kony = {};
    }
    if (typeof(kony.sdk) === "undefined") {
        kony.sdk = {};
    }
    kony.sdk.websocket = kony.sdk.websocket || {};
    kony.sdk.websocket.util = kony.sdk.websocket.util || {};

    kony.sdk.websocket.onMessage = null;
    kony.sdk.websocket.onError = null;
    kony.sdk.websocket.onClose = null;
    kony.sdk.websocket.onSubscribe = null;
    kony.sdk.websocket.onPublish = null;
    kony.sdk.websocket.onUnsubscribe = null;

    var konyWebSocket = null;

    /**
     *    Defines callback for onMessage, onError and onClose for websockets.
     */
    kony.sdk.websocket.util.setKonyWebsocketCallbacks = function(callback) {
        kony.sdk.logsdk.perf("Executing kony.sdk.websocket.util.setKonyWebsocketCallback");
        for (var key in callback) {
            switch (key) {
                case kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONMESSAGE:
                    kony.sdk.websocket.onMessage = callback[key];
                    break;
                case kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR:
                    kony.sdk.websocket.onError = callback[key];
                    break;
                case kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONCLOSE:
                    kony.sdk.websocket.onClose = callback[key];
                    break;
                case kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONSUBSCRIBE:
                    kony.sdk.websocket.onSubscribe = callback[key];
                    break;
                case kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONPUBLISH:
                    kony.sdk.websocket.onPublish = callback[key];
                    break;
                case kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONUNSUBSCRIBE:
                    kony.sdk.websocket.onUnsubscribe = callback[key];
                    break;
                default:
                    kony.sdk.logsdk.warn("Invalid key passed while setting websocket callback : ", key);
            }
        }
        kony.sdk.logsdk.perf("Executing Finished kony.sdk.websocket.util.setKonyWebsocketCallback");
    };

    /**
     *    Opens and handles websocket after the connection is established.
     */
    kony.sdk.websocket.util.openWebSocketHandler = function(url, events) {
        kony.sdk.logsdk.perf("Executing kony.sdk.websocket.util.openWebSocketHandler");

        if ((!kony.sdk.isNullOrUndefined(konyWebSocket) && (konyWebSocket.readyState === WebSocket.OPEN))) {
            kony.sdk.logsdk.info("Websocket is already initialized.");
            return;
        }

        if (window.WebSocket) {
            kony.sdk.logsdk.info("Websocket is supported by this browser!");
            try {
                konyWebSocket = new WebSocket(url);
            } catch (error) {
                kony.sdk.logsdk.error("openWebSocketHandler:: Error while opening websocket, Error : ", error);
                kony.sdk.websocket.util.parseMessageForTypeAndCallCommonCallback(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR,
                    "Error while opening websocket, Error : " + error);
                return;
            }

            konyWebSocket.onopen = function() {
                kony.sdk.logsdk.perf("Executing Websocket onopen eventHandler.");
                kony.sdk.logsdk.info("WebSocket is connected.");
                kony.sdk.websocket.util.parseMessageForTypeAndCallCommonCallback(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONOPEN,
                    "WebSocket connection established");
                kony.sdk.websocket.util.sendWebsocketMessage(events);
                kony.sdk.logsdk.perf("Executing Finished Websocket onopen eventHandler.");
            };

            konyWebSocket.onmessage = function(event) {
                kony.sdk.logsdk.perf("Executing Websocket onmessage eventHandler.");
                var message = event.data;
                kony.sdk.logsdk.info("Event Message Recieved.");
                kony.sdk.websocket.util.parseServerResponseAndCallLocalCallback(message);
                kony.sdk.logsdk.perf("Executing Finished Websocket onmessage eventHandler.");
            };

            konyWebSocket.onerror = function(error) {
                kony.sdk.logsdk.perf("Executing Websocket onerror eventHandler.");
                kony.sdk.logsdk.error("openWebSocketHandler:: Websocket Failed With Error :" + error);
                konyWebSocket = null;
                kony.sdk.websocket.util.parseMessageForTypeAndCallCommonCallback(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR,
                    "Websocket Failed With Error : " + error);
                kony.sdk.logsdk.perf("Executing Finished Websocket onerror eventHandler.");
            };

            konyWebSocket.onclose = function() {
                kony.sdk.logsdk.perf("Executing Websocket onclose eventHandler.");
                konyWebSocket = null;
                kony.sdk.logsdk.info("WebSocket is closed.");
                kony.sdk.websocket.util.parseMessageForTypeAndCallCommonCallback(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONCLOSE,
                    "All Topics Unsubscribed and WebSocket connection closed.");
                kony.sdk.logsdk.perf("Executing Finished Websocket onclose eventHandler.");
            };
        } else {
            kony.sdk.logsdk.error("openWebSocketHandler:: WebSocket is not supported by this browser.");
            kony.sdk.websocket.util.parseMessageForTypeAndCallCommonCallback(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR,
                "WebSocket is not supported by this browser");
        }
        kony.sdk.logsdk.perf("Executing Finished kony.sdk.websocket.util.openWebSocketHandler");
    };

    /**
     *    Sending the acknowledgement after getting the response from server.
     *    @param eventID event id from server side.
     */
    kony.sdk.websocket.util.sendAcknowledgementToServer = function(eventID){
        var ackPayLoad = {};
        var ack = {};
        ack[kony.sdk.websocket.constants.WEBSOCKET_RESPONSE_EVENTS_ID] = eventID;
        ackPayLoad[kony.sdk.websocket.constants.WEBSOCKET_RESPONSE_ACK] = ack;
        var ackString = JSON.stringify(ackPayLoad);
        kony.sdk.websocket.util.sendWebsocketMessage(ackString);
    };

    /**
     *    Sends message through the WebSocket connection using WebSocket instance.
     */
    kony.sdk.websocket.util.sendWebsocketMessage = function(events) {
        kony.sdk.logsdk.perf("Executing kony.sdk.websocket.util.sendWebsocketMessage");

        if (kony.sdk.isNullOrUndefined(konyWebSocket)) {
            kony.sdk.logsdk.error("sendWebsocketMessage:: Websocket is not initialized.");
            kony.sdk.websocket.util.parseMessageForTypeAndCallCommonCallback(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR,
                "Websocket is not initialized.");
            return;
        }

        kony.sdk.logsdk.info("Websocket ready State is " + konyWebSocket.readyState);
        if (konyWebSocket.readyState === WebSocket.OPEN) {
            kony.sdk.logsdk.info("Sending events using webSocket.");
            konyWebSocket.send(events);
        } else {
            kony.sdk.logsdk.error("sendWebsocketMessage:: Websocket is not open.");
            kony.sdk.websocket.util.parseMessageForTypeAndCallCommonCallback(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR,
                "Websocket is not open.");
            return;
        }

        kony.sdk.logsdk.perf("Executing Finished kony.sdk.websocket.util.sendWebsocketMessage");
    };

    /**
     *    Closes the WebSocket connection, if any. If the connection is already closed, this api does nothing.
     */
    kony.sdk.websocket.util.closeWebSocket = function() {
        kony.sdk.logsdk.perf("Executing Finished kony.sdk.websocket.util.ned) {closeWebSocket");

        if (kony.sdk.isNullOrUndefined(konyWebSocket)) {
            kony.sdk.logsdk.error("closeWebSocket:: Websocket is not initialized.");
            kony.sdk.websocket.util.parseMessageForTypeAndCallCommonCallback(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR,
                "Websocket is not initialized.");
            return;
        } else {
            kony.sdk.logsdk.info("Websocket ready State is " + konyWebSocket.readyState);
            if (konyWebSocket.readyState === WebSocket.OPEN) {
                kony.sdk.logsdk.info("Closing the Websocket.");
                konyWebSocket.close();
            } else {
                kony.sdk.logsdk.error("closeWebSocket:: Websocket is not open.");
                kony.sdk.websocket.util.parseMessageForTypeAndCallCommonCallback(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR,
                    "Websocket is not open.");
            }
        }

        kony.sdk.logsdk.perf("Executing Finished kony.sdk.websocket.util.closeWebSocket");
    };

    /**
     *  Checks and returns if websocket instance is available.
     */
    kony.sdk.websocket.util.isInternalWebSocketAvailable = function () {
        return !kony.sdk.isNullOrUndefined(konyWebSocket);
    };
}
//#endif
//#ifdef PLATFORM_SPA
/**
 * Created by Inderpreet Kaur on 3/1/2020.
 * Copyright © 2020 Kony. All rights reserved.
 */
function initializeWebSocketResponseHandler() {
    if (typeof (kony) === "undefined") {
        kony = {};
    }

    if (typeof (kony.sdk) === "undefined") {
        kony.sdk = {};
    }
    kony.sdk.websocket = kony.sdk.websocket || {};
    kony.sdk.websocket.util = kony.sdk.websocket.util || {};

    /**
     * Parse the response message from server.
     */
    kony.sdk.websocket.util.parseServerResponseAndCallLocalCallback = function(response) {
        kony.sdk.logsdk.perf("Executing kony.sdk.websocket.util.parseServerResponseAndCallLocalCallback");
        const msg = "Error while parsing response from server.";
        try {
            var parsedResponse = JSON.parse(response);
        } catch (error) {
            kony.sdk.logsdk.error("parseAndGetLocalResponse:: " + msg);
            kony.sdk.websocket.util.raiseError(msg + ": " + error);
            return;
        }

        if(kony.sdk.util.isNullOrUndefinedOrEmptyObject(parsedResponse)) {
            kony.sdk.logsdk.error("parseAndGetLocalResponse:: " + msg);
            kony.sdk.websocket.util.raiseError(msg);
            return;
        }

        kony.sdk.websocket.util.handleServerResponseAndCallbackResponse(parsedResponse);

        kony.sdk.logsdk.perf("Executing Finished kony.sdk.websocket.util.parseAndGetLocalResponse");
    };

    /**
     * Method gets response and invokes callback.
     */
    kony.sdk.websocket.util.parseMessageForTypeAndCallCommonCallback = function(type, response) {
        kony.sdk.logsdk.perf("Executing kony.sdk.websocket.util.parseMessageForTypeAndCallCommonCallback");

        const finalMessage = kony.sdk.websocket.util.getResponseMessageForType(type, response);

        if(kony.sdk.util.isNullOrUndefinedOrEmptyObject(finalMessage)) {
            const msg = "Error in creating response for parseMessageForTypeAndCallCommonCallback";
            kony.sdk.logsdk.error(msg);
            kony.sdk.websocket.util.raiseError(msg);
            return;
        }

        if(type === kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONOPEN) {
            kony.sdk.verifyAndCallClosure(kony.sdk.websocket.onMessage, finalMessage);
        }

        if(type === kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONCLOSE) {
            kony.sdk.verifyAndCallClosure(kony.sdk.websocket.onClose, finalMessage);
        }

        if(type === kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR) {
            kony.sdk.verifyAndCallClosure(kony.sdk.websocket.onError, finalMessage);
        }
    };

    /**
     * Invoke respective callback based on response received from server.
     */
    kony.sdk.websocket.util.handleServerResponseAndCallbackResponse = function(response) {
        kony.sdk.logsdk.perf("Executing kony.sdk.websocket.util.handleServerResponseAndCallbackResponse");

        const code = response[kony.sdk.websocket.constants.WEBSOCKET_RESPONSE_CODE];
        if(code === kony.sdk.websocket.util.ServerCodeType.ON_MESSAGE){
            kony.sdk.logsdk.info("OnMessage type response received.");

            kony.sdk.logsdk.info("Sending acknowledgment to the server.");
            kony.sdk.websocket.util.sendAcknowledgementToServer(response[kony.sdk.websocket.constants.WEBSOCKET_RESPONSE_EVENTS_ID]);

            const finalMessage = kony.sdk.websocket.util.getResponseMessageForOnMessage(response);
            kony.sdk.verifyAndCallClosure(kony.sdk.websocket.onMessage, finalMessage);

        } else if(code >= kony.sdk.websocket.util.ServerCodeType.SERVER_ON_ERROR_INVALID_USER &&
            code <= kony.sdk.websocket.util.ServerCodeType.SERVER_ON_ERROR_ERROR_REQUEST_PAYLOAD) {

            kony.sdk.logsdk.info("Response message type received: ON_ERROR");
            kony.sdk.logsdk.debug("Error: " + response[kony.sdk.websocket.constants.WEBSOCKET_RESPONSE_MESSAGE]);

            var errorMessage = "Please Re-Subscribe/Unsubscribe.";
            if (code === kony.sdk.websocket.util.ServerCodeType.SERVER_ON_ERROR_INVALID_USER) {
                errorMessage = "Authentication failed, " + errorMessage;
            }
            kony.sdk.websocket.util.raiseError(errorMessage);

        } else {
            const message = response[kony.sdk.websocket.constants.WEBSOCKET_RESPONSE_MESSAGE];
            const successTopics = response[kony.sdk.websocket.constants.WEBSOCKET_RESPONSE_SUCCESSFULL_EVENTS];
            const failedTopics = response[kony.sdk.websocket.constants.WEBSOCKET_RESPONSE_FAILED_EVENTS];

            const finalMessage = kony.sdk.websocket.util.getResponseMessageForCode(code, message, successTopics, failedTopics);

            if (kony.sdk.util.isNullOrUndefinedOrEmptyObject(finalMessage)) {
                const msg = "Error in creating response for handleServerResponseAndCallbackResponse";
                kony.sdk.logsdk.error(msg);
                kony.sdk.websocket.util.raiseError(msg);
                return;
            }

            switch (code) {
                case kony.sdk.websocket.util.ServerCodeType.SUBSCRIBE_SUCCESS:
                case kony.sdk.websocket.util.ServerCodeType.SUBSCRIBE_ERROR:
                case kony.sdk.websocket.util.ServerCodeType.SUBSCRIBE_PARTIAL_SUCCESS:
                    kony.sdk.logsdk.info("Response message type received: SUBSCRIBE");
                    kony.sdk.verifyAndCallClosure(kony.sdk.websocket.onSubscribe, finalMessage);
                    break;
                case kony.sdk.websocket.util.ServerCodeType.UNSUBSCRIBE_SUCCESS:
                case kony.sdk.websocket.util.ServerCodeType.UNSUBSCRIBE_ERROR:
                case kony.sdk.websocket.util.ServerCodeType.UNSUBSCRIBE_PARTIAL_SUCCESS:
                    kony.sdk.logsdk.info("Response message type received: UNSUBSCRIBE");
                    kony.sdk.verifyAndCallClosure(kony.sdk.websocket.onUnsubscribe, finalMessage);
                    break;
                case kony.sdk.websocket.util.ServerCodeType.PUBLISH_SUCCESS:
                case kony.sdk.websocket.util.ServerCodeType.PUBLISH_ERROR:
                case kony.sdk.websocket.util.ServerCodeType.PUBLISH_PARTIAL_SUCCESS:
                    kony.sdk.logsdk.info("Response message type received: PUBLISH");
                    kony.sdk.verifyAndCallClosure(kony.sdk.websocket.onPublish, finalMessage);
                    break;
                default:
                    kony.sdk.logsdk.error("Invalid code passed in response, message: ", finalMessage);
                    kony.sdk.websocket.util.raiseError("Invalid response received, response : " + finalMessage);
                    break;
            }
        }
    };

    kony.sdk.websocket.util.raiseError = function(message) {
        kony.sdk.logsdk.perf("Executing kony.sdk.websocket.util.raiseError");
        const finalErrorMessage = kony.sdk.websocket.util.getResponseMessageForType(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR, message);
        kony.sdk.verifyAndCallClosure(kony.sdk.websocket.onError,  finalErrorMessage);
    };
}
//#endif
//#ifdef PLATFORM_SPA
/**
 * Created by Inderpreet Kaur on 3/1/2020.
 * Copyright © 2020 Kony. All rights reserved.
 */
function initializeWebSocketResponseMessage() {
    if (typeof (kony) === "undefined") {
        kony = {};
    }

    if (typeof (kony.sdk) === "undefined") {
        kony.sdk = {};
    }
    kony.sdk.websocket = kony.sdk.websocket || {};
    kony.sdk.websocket.util = kony.sdk.websocket.util || {};

    const ServerCodeType = {
        SUBSCRIBE_SUCCESS: 620001,
        SUBSCRIBE_ERROR: 620002,
        SUBSCRIBE_PARTIAL_SUCCESS: 620003,
        PUBLISH_SUCCESS: 620004,
        PUBLISH_ERROR: 620005,
        PUBLISH_PARTIAL_SUCCESS: 620006,
        UNSUBSCRIBE_SUCCESS: 620007,
        UNSUBSCRIBE_ERROR: 620008,
        UNSUBSCRIBE_PARTIAL_SUCCESS: 620009,
        ON_MESSAGE: 620010,
        SERVER_ON_ERROR_INVALID_USER: 620011,
        SERVER_ON_ERROR_MISSING_MANDATORY_PARAM: 620012,
        SERVER_ON_ERROR_UPDATING_WEBSOCKET_SESSION: 620013,
        SERVER_ON_ERROR_ERROR_REQUEST_PAYLOAD: 620014,

    };
    Object.freeze(ServerCodeType);
    kony.sdk.websocket.util.ServerCodeType = ServerCodeType;

    const ClientCodeType = {
        SUBS_SUCCESS: 6201,
        SUBS_ERROR: 6202,
        SUBS_PARTIAL_SUCCESS: 6203,
        UNSUBS_SUCCESS: 6207,
        UNSUBS_ERROR: 6208,
        UNSUBS_PARTIAL_SUCCESS: 6209,
        PUB_SUCCESS: 6204,
        PUB_ERROR: 6205,
        PUB_PARTIAL_SUCCESS: 6206,
        ON_MESSAGE: 6210,
        ON_OPEN: 7200,
        ON_ERROR: 7201,
        ON_CLOSE: 7202
    };
    Object.freeze(ClientCodeType);
    kony.sdk.websocket.util.ClientCodeType = ClientCodeType;

    /**
     Creating client and server code dictionary. Dictionary contains both  server code enum type or code type
     as string for key with respective client codes as pair.
     **/
    var responseCodeLookUp = {};

    responseCodeLookUp[ServerCodeType.SUBSCRIBE_SUCCESS]  = ClientCodeType.SUBS_SUCCESS;
    responseCodeLookUp[ServerCodeType.SUBSCRIBE_PARTIAL_SUCCESS]  = ClientCodeType.SUBS_PARTIAL_SUCCESS;
    responseCodeLookUp[ServerCodeType.SUBSCRIBE_ERROR]  = ClientCodeType.SUBS_ERROR;
    responseCodeLookUp[ServerCodeType.UNSUBSCRIBE_SUCCESS]  = ClientCodeType.UNSUBS_SUCCESS;
    responseCodeLookUp[ServerCodeType.UNSUBSCRIBE_PARTIAL_SUCCESS]  = ClientCodeType.UNSUBS_PARTIAL_SUCCESS;
    responseCodeLookUp[ServerCodeType.UNSUBSCRIBE_ERROR]  = ClientCodeType.UNSUBS_ERROR;
    responseCodeLookUp[ServerCodeType.PUBLISH_SUCCESS]  = ClientCodeType.PUB_SUCCESS;
    responseCodeLookUp[ServerCodeType.PUBLISH_PARTIAL_SUCCESS]  = ClientCodeType.PUB_PARTIAL_SUCCESS;
    responseCodeLookUp[ServerCodeType.PUBLISH_ERROR]  = ClientCodeType.PUB_ERROR;
    responseCodeLookUp[kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONOPEN] = ClientCodeType.ON_OPEN;
    responseCodeLookUp[kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONMESSAGE]  = ClientCodeType.ON_MESSAGE;
    responseCodeLookUp[kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONCLOSE]  = ClientCodeType.ON_CLOSE;
    responseCodeLookUp[kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR]  = ClientCodeType.ON_ERROR;


    kony.sdk.websocket.util.setKeyAndValueForFinalMessage = function(finalMessageJSON, message, successTopics, failedTopics) {
        kony.sdk.logsdk.perf("Executing kony.sdk.websocket.util.setKeyAndValueForFinalmessage");

        if(!kony.sdk.util.isNullOrUndefinedOrEmptyObject(message)) {
            finalMessageJSON[kony.sdk.websocket.constants.WEBSOCKET_RESPONSE_MESSAGE] = message;
        }

        if(!kony.sdk.util.isNullOrUndefinedOrEmptyObject(successTopics)) {
            finalMessageJSON[kony.sdk.websocket.constants.WEBSOCKET_RESPONSE_SUCCESSFULL_EVENTS] = successTopics;
        }
        if(!kony.sdk.util.isNullOrUndefinedOrEmptyObject(failedTopics)) {
            finalMessageJSON[kony.sdk.websocket.constants.WEBSOCKET_RESPONSE_FAILED_EVENTS] = failedTopics;
        }
    };

    kony.sdk.websocket.util.getResponseMessageForOnMessage = function(message){
        var finalMessageJSON ={};

        var clientCode = responseCodeLookUp[kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONMESSAGE];
        finalMessageJSON[kony.sdk.websocket.constants.WEBSOCKET_RESPONSE_CODE] = clientCode;
        finalMessageJSON[kony.sdk.websocket.constants.WEBSOCKET_RESPONSE_DATA] = message[kony.sdk.websocket.constants.WEBSOCKET_RESPONSE_DATA];
        finalMessageJSON[kony.sdk.websocket.constants.WEBSOCKET_RESPONSE_TOPIC] = message[kony.sdk.websocket.constants.WEBSOCKET_RESPONSE_TOPIC];

        var responseString = JSON.stringify(finalMessageJSON);
        return responseString;
    };

    /**
     * Create response message string depending on type of message.
     */
    kony.sdk.websocket.util.getResponseMessageForType = function(type, message) {
        kony.sdk.logsdk.perf("Executing kony.sdk.websocket.util.getResponseMessageForType");

        const finalMessageJSON = {};
        const clientCode = responseCodeLookUp[type];

        if(clientCode <= 0) {
            kony.sdk.logsdk.error("Invalid Code found in response for getResponseMessageForType");
            return null;
        }

        finalMessageJSON[kony.sdk.websocket.constants.WEBSOCKET_RESPONSE_CODE] = clientCode;

        if(type === kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONCLOSE ||
            type === kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONOPEN) {
            kony.sdk.logsdk.info("Message type received : " + type);
            kony.sdk.websocket.util.setKeyAndValueForFinalMessage(finalMessageJSON, message, null, null);
        } else if(type === kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR) {
            kony.sdk.logsdk.info("Message type received : " + type);
            message = "Error Occurred in Server events, Error :" + message;
            kony.sdk.websocket.util.setKeyAndValueForFinalMessage(finalMessageJSON, message, null, null);
        } else {
            kony.sdk.logsdk.debug("Invalid Callback type found");
            return null;
        }

        var responseString = JSON.stringify(finalMessageJSON)

        return responseString;
    };

    /**
     * Create response message string depending on the code.
     */
    kony.sdk.websocket.util.getResponseMessageForCode = function(code, message, successTopics, failedTopics) {
        kony.sdk.logsdk.perf("Executing kony.sdk.websocket.util.getResponseMessageForCode");

        const finalMessageJSON = {};
        const clientCode = responseCodeLookUp[code];

        if(clientCode <= 0) {
            kony.sdk.logsdk.error("Invalid Code found in response for getResponseMessageForCode");
            return null;
        }

        finalMessageJSON[kony.sdk.websocket.constants.WEBSOCKET_RESPONSE_CODE] = clientCode;

        switch(code) {
            case ServerCodeType.SUBSCRIBE_SUCCESS:
            case ServerCodeType.PUBLISH_SUCCESS:
            case ServerCodeType.UNSUBSCRIBE_SUCCESS:
                kony.sdk.logsdk.info("Message type received for : " + kony.sdk.util.getKeyByValue(ClientCodeType, clientCode));
                kony.sdk.websocket.util.setKeyAndValueForFinalMessage(finalMessageJSON, message, successTopics, null);
                break;
            case ServerCodeType.SUBSCRIBE_ERROR:
            case ServerCodeType.PUBLISH_ERROR:
            case ServerCodeType.UNSUBSCRIBE_ERROR:
                kony.sdk.logsdk.info("Message type received for : " + kony.sdk.util.getKeyByValue(ClientCodeType, clientCode));
                kony.sdk.websocket.util.setKeyAndValueForFinalMessage(finalMessageJSON, message, null, failedTopics);
                break;
            case ServerCodeType.SUBSCRIBE_PARTIAL_SUCCESS:
            case ServerCodeType.PUBLISH_PARTIAL_SUCCESS:
            case ServerCodeType.UNSUBSCRIBE_PARTIAL_SUCCESS:
                kony.sdk.logsdk.info("Message type received for partial success : " + kony.sdk.util.getKeyByValue(ClientCodeType, clientCode));
                kony.sdk.websocket.util.setKeyAndValueForFinalMessage(finalMessageJSON, message, successTopics, failedTopics);
                break;

            default:
                kony.sdk.logsdk.error("Invalid code passed in response, message: ", message);
                return null;
        }

        try {
            var responseString = JSON.stringify(finalMessageJSON)
        } catch (error) {
            kony.sdk.logsdk.error("Error in creating response message, error: " + error);
            return null;
        }
        return responseString;
    };
}
//#endif
/**
 * Created by Inderpreet Kaur on 3/1/2020.
 * Copyright © 2020 Kony. All rights reserved.
 */
if (typeof(kony) === "undefined") {
    kony = {};
}
if (typeof(kony.sdk) === "undefined") {
    kony.sdk = {};
}

// kony.serverEvents is a flag to know whether KonyServerEvents.js file is loaded or not.
kony.serverEvents = true;

function initializeServerEvents() {

    var onErrorCallback = null;
    var eventCallbackFlag = false;
    var failureCallbackFlag = false;
    var TAG = "KonyServerEvents :: ";

    const ErrorCodes = {
        ON_ERROR: 7201,
        ON_UNSUBSCRIBE_ERROR: 6208,
        ON_SUBS_ERROR: 6202
    };
    Object.freeze(ErrorCodes);

    var callbackErrorInvoker = function (type, message, callback) {
        var finalMessage = {};

        switch(type) {
            case kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR :
                finalMessage.code = ErrorCodes.ON_ERROR;
                break;
            case kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONUNSUBSCRIBE_ERROR :
                finalMessage.code = ErrorCodes.ON_UNSUBSCRIBE_ERROR;
                break;
            case kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONSUBSCRIBE_ERROR :
                finalMessage.code = ErrorCodes.ON_SUBS_ERROR;
                break;
            default :
                finalMessage.code = ErrorCodes.ON_ERROR;
                break;
        }

        finalMessage.message = message;

        if((!callback || (finalMessage.code === ErrorCodes.ON_ERROR)) && onErrorCallback) {
            finalMessage.code = ErrorCodes.ON_ERROR;
            kony.sdk.verifyAndCallClosure(onErrorCallback, JSON.stringify(finalMessage));
        } else if(callback) {
            kony.sdk.verifyAndCallClosure(callback, JSON.stringify(finalMessage));
        }
    };

    /**
     * Create events string payload.
     * @param events,  the value to be used for events object
     * @param mode, value, either it may be Public or Private
     * @param type, it is the type of events- subscribe or unsubscribe
     * @returns {string}
     */
    var createEventsPayloadString = function (events, mode, type) {
        var payload = {};
        var finalPayload = {};
        var scope = {};
        if(kony.sdk.util.isValidString(events)) {

            var eventsArray = [];
            eventsArray.push(events);
            scope[mode] = eventsArray

        } else if(kony.sdk.isArray(events) && events.length >0) {
            for(var e in  events){
                if(!kony.sdk.util.isValidString(events[e])) {
                    kony.sdk.logsdk.error(TAG + "createEventsPayloadString:: " + kony.sdk.websocket.constants.INVALID_EVENT_STRING_MESSAGE);
                    return;
                }
            }

            scope[mode] = events;
        } else{
            kony.sdk.logsdk.error(TAG + "createEventsPayloadString:: " + kony.sdk.websocket.constants.INVALID_EVENT_STRING_MESSAGE);
            return;
        }

        payload[kony.sdk.websocket.constants.X_KONY_AUTHORIZATION] = konyRef.currentClaimToken;
        payload[kony.sdk.websocket.constants.X_KONY_CLIENT_UUID] = konyRef.clientUUID;
        payload[kony.sdk.websocket.constants.WEBSOCKET_TOPICS_EVENTS] = scope;

        if(type === kony.sdk.websocket.constants.WEBSOCKET_SUBSCRIBE_EVENTS) {
            finalPayload[kony.sdk.websocket.constants.WEBSOCKET_SUBSCRIBE_EVENTS] = payload;
        } else{
            finalPayload[kony.sdk.websocket.constants.WEBSOCKET_UNSUBSCRIBE_EVENTS] = payload
        }

        var eventsString = JSON.stringify(finalPayload);
        return eventsString;
    };

    /**
     * Segregating the mode from options.
     * @param options, the value to be used for events object
     * @param type, it is the type of events- subscribe or unsubscribe
     * @returns {string}
     */
    var segregateEventModes = function(options, type){
        var mode = null;

        if(type === kony.sdk.websocket.constants.WEBSOCKET_SUBSCRIBE_EVENTS) {

            mode = options[kony.sdk.websocket.constants.WEBSOCKET_SUBSCRIBE_MODE];
        } else {

            mode = options[kony.sdk.websocket.constants.WEBSOCKET_UNSUBSCRIBE_MODE];
        }

        if (kony.sdk.isNullOrUndefined(mode)) {
            return kony.sdk.websocket.constants.WEBSOCKET_MODE_PRIVATE ;

        } else if(mode.toLowerCase() === kony.sdk.websocket.constants.WEBSOCKET_MODE_PRIVATE
            || mode.toLowerCase() === kony.sdk.websocket.constants.WEBSOCKET_MODE_PUBLIC ){

            return mode;
        } else {
            kony.sdk.logsdk.error(TAG + "segregatingEventModes:: " + kony.sdk.websocket.constants.INVALID_MODE_PROVIDED_MESSAGE);
            return;
        }
    };

    /**
     * Method isServerEventsCallbackAssigned, checking the mandatory callbacks setup.
     * @returns {boolean}
     */
    var isServerEventsCallbackAssigned = function(){
        if (eventCallbackFlag === false || failureCallbackFlag === false) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * isOptionObjectValid, method to validate obj to be function.
     * @param obj
     * @returns {boolean}
     */
    var isOptionObjectValid = function(obj){
        if(kony.sdk.isNullOrUndefined(obj) || !typeof obj === 'function'){
            return false;
        } else {
            return true;
        }
    };

    /**
     * isOncloseConnectionValid, method to validate onCloseConnection key
     * @param obj
     * @returns {boolean}
     */
    var isOncloseConnectionValid = function(obj){

        if (!(obj === true || obj === false)) {
            return false;
        }
        return true;
    };

    /**
     * Method setServerEventsCallbacks, setting the common callbacks
     *
     * @param options, contains callback functions
     */
    kony.sdk.prototype.setServerEventsCallbacks = function (options) {

        if(!kony.sdk.util.isNullOrUndefinedOrEmptyObject(options)) {

            if(!isOptionObjectValid(options.onFailureCallback)) {
                kony.sdk.logsdk.error(TAG + "setServerEventsCallbacks:: onFailureCallback callback is null or undefined");
                return;
            } else {
                failureCallbackFlag = true;
                onErrorCallback = options.onFailureCallback;
            }

            if(!isOptionObjectValid(options.onEventCallback)) {
                kony.sdk.logsdk.error(TAG + "subscribeServerEvents:: onEventCallback callback is null or undefined");
                callbackErrorInvoker(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR,
                    "onEventCallback callback is null or undefined.", onErrorCallback);
                return;
            } else {
                eventCallbackFlag = true;
            }

            if(!options.onCloseCallback) {
                options.onCloseCallback = null;
            }

            kony.sdk.websocket.setServerEventsCallbacks(options.onEventCallback, options.onFailureCallback, options.onCloseCallback);

        } else {
            kony.sdk.logsdk.error(TAG + "setServerEventsCallbacks:: options are null or undefined");
            return;
        }

    };

    /**
     * Subscribe to server events.
     *
     * example : ["transaction/deposit",
     *            "transaction/withdraw"]
     * @param events            events string to be sent to the server
     * @param subscribeOptions additional options for subscribing
     */
    kony.sdk.prototype.subscribeServerEvents = function (events, subscribeOptions) {

        if(!isServerEventsCallbackAssigned()){
            kony.sdk.logsdk.error(TAG + "subscribeServerEvents:: " +
                kony.sdk.websocket.constants.SERVER_EVENTS_CALLBACKS_ERROR_MESSAGE);
            return;
        }

        if(kony.sdk.util.isNullOrUndefinedOrEmptyObject(subscribeOptions)) {
            subscribeOptions = {};
        }

        if (!kony.sdk.isNetworkAvailable()) {
            kony.sdk.logsdk.error(TAG + "subscribeServerEvents:: " + kony.sdk.websocket.constants.SERVER_EVENTS_NO_INTERNET_MESSAGE);
            callbackErrorInvoker(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR,
                kony.sdk.websocket.constants.SERVER_EVENTS_NO_INTERNET_MESSAGE, onErrorCallback);
            return;
        }

        if (kony.sdk.util.isNullOrUndefinedOrEmptyObject(events)) {
            kony.sdk.logsdk.error(TAG + "subscribeServerEvents:: Events to be subscribed for are null or undefined or empty.");
            callbackErrorInvoker(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR,
                "Events to be subscribed are null or undefined or empty.", onErrorCallback);
            return;
        }

        kony.sdk.claimsRefresh(function () {
            kony.sdk.logsdk.info(TAG + "subscribeServerEvents:: " + "Generating websocket url");

            var url = kony.sdk.websocket.generateServerEventsURL();


            if(kony.sdk.isNullOrUndefined(url)){
                kony.sdk.websocket.util.raiseError(TAG + "subscribeServerEvents:: Error in generating websocket url.");
                return;
            }

            try {

                var mode = segregateEventModes(subscribeOptions, kony.sdk.websocket.constants.WEBSOCKET_SUBSCRIBE_EVENTS);

                if(kony.sdk.isNullOrUndefined(mode)){

                    kony.sdk.logsdk.error(TAG + "subscribeServerEvents:: Event mode passed is not valid.");
                    callbackErrorInvoker(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR,
                        kony.sdk.websocket.constants.INVALID_MODE_PROVIDED_MESSAGE, onErrorCallback);
                    return;
                }

                var eventsString = createEventsPayloadString(events, mode, kony.sdk.websocket.constants.WEBSOCKET_SUBSCRIBE_EVENTS);

                if(kony.sdk.isNullOrUndefined(eventsString)){

                    kony.sdk.logsdk.error(TAG + "subscribeServerEvents:: Event string passed is not valid.");
                    callbackErrorInvoker(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR,
                        kony.sdk.websocket.constants.INVALID_EVENT_STRING_MESSAGE, onErrorCallback);
                    return;
                }

            } catch (error) {
                kony.sdk.logsdk.error(TAG + "subscribeServerEvents:: Error : ", error);
                callbackErrorInvoker(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR, error, onErrorCallback);
                return;
            }

            if(isOptionObjectValid(subscribeOptions.onSubscribeCallback)) {
                kony.sdk.websocket.subscribeServerEvents(url, eventsString, subscribeOptions.onSubscribeCallback, subscribeOptions);
            } else {
                kony.sdk.websocket.subscribeServerEvents(url, eventsString, null, subscribeOptions);
            }

        }, function (error) {
            kony.sdk.logsdk.error(TAG + "subscribeServerEvents::onFailure Error:", error);
            callbackErrorInvoker(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR, error, onErrorCallback);
        });
    };

    /**
     * Unsubscribe from server events.
     *
     * example : ["transaction/deposit",
     *            "transaction/withdraw"]
     * @param events             events string to unsubscribe
     * @param unSubscribeOptions additional options to unsubscribe
     */
    kony.sdk.prototype.unSubscribeServerEvents = function (events, unSubscribeOptions) {

        if(!isServerEventsCallbackAssigned()){
            kony.sdk.logsdk.error(TAG + "unSubscribeServerEvents:: " +
                kony.sdk.websocket.constants.SERVER_EVENTS_CALLBACKS_ERROR_MESSAGE);
            return;
        }

        if(kony.sdk.util.isNullOrUndefinedOrEmptyObject(unSubscribeOptions)) {
            unSubscribeOptions = {};
        }

        if (!kony.sdk.isNetworkAvailable()) {
            kony.sdk.logsdk.error(TAG + "unSubscribeServerEvents:: " +
                kony.sdk.websocket.constants.SERVER_EVENTS_NO_INTERNET_MESSAGE);
            callbackErrorInvoker(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR,
                kony.sdk.websocket.constants.SERVER_EVENTS_NO_INTERNET_MESSAGE, onErrorCallback);
            return;
        }

        if(kony.sdk.websocket && !kony.sdk.websocket.isWebSocketAvailable()) {
            kony.sdk.logsdk.error(TAG + "unSubscribeServerEvents:: " + kony.sdk.websocket.constants.SERVER_EVENTS_NOT_INITIALISED_MESSAGE);
            callbackErrorInvoker(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR,
                kony.sdk.websocket.constants.SERVER_EVENTS_NOT_INITIALISED_MESSAGE, onErrorCallback);
            return;
        }

        var eventsString = null;

        if(!kony.sdk.util.isNullOrUndefinedOrEmptyObject(unSubscribeOptions[kony.sdk.websocket.constants.UNSUBSCRIBE_OPTION_CLOSE_CONNECTION])){

            if(!isOncloseConnectionValid(unSubscribeOptions[kony.sdk.websocket.constants.UNSUBSCRIBE_OPTION_CLOSE_CONNECTION])){

                kony.sdk.logsdk.error(TAG + "unSubscribeServerEvents:: CloseConnection value type is invalid.");
                callbackErrorInvoker(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR,
                    "CloseConnection value type is invalid.", onErrorCallback);
                return;
            }

            if(unSubscribeOptions[kony.sdk.websocket.constants.UNSUBSCRIBE_OPTION_CLOSE_CONNECTION] === kony.sdk.websocket.constants.BOOLEAN_TRUE) {

                kony.sdk.logsdk.info(TAG + "unSubscribeServerEvents:: Closing the webSocket connection.");
                kony.sdk.websocket.unSubscribeServerEvents(eventsString, null, unSubscribeOptions);
                return;
            }

        }

        if(!kony.sdk.util.isNullOrUndefinedOrEmptyObject(events)) {

            var mode = segregateEventModes(unSubscribeOptions, kony.sdk.websocket.constants.WEBSOCKET_UNSUBSCRIBE_EVENTS);

            if (kony.sdk.isNullOrUndefined(mode)) {

                kony.sdk.logsdk.error(TAG + "unSubscribeServerEvents:: Event mode passed is not valid.");
                callbackErrorInvoker(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR,
                    kony.sdk.websocket.constants.INVALID_MODE_PROVIDED_MESSAGE, onErrorCallback);
                return;
            }

            kony.sdk.claimsRefresh(function () {

                eventsString = createEventsPayloadString(events, mode, kony.sdk.websocket.constants.WEBSOCKET_UNSUBSCRIBE_EVENTS);

                if (kony.sdk.isNullOrUndefined(eventsString)) {

                    kony.sdk.logsdk.error(TAG + "unSubscribeServerEvents:: Event string passed is not valid.");
                    callbackErrorInvoker(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR,
                        kony.sdk.websocket.constants.INVALID_EVENT_STRING_MESSAGE, onErrorCallback);
                    return;
                }

                if (isOptionObjectValid(unSubscribeOptions.onUnsubscribeCallback)) {
                    kony.sdk.websocket.unSubscribeServerEvents(eventsString, unSubscribeOptions.onUnsubscribeCallback, unSubscribeOptions);
                } else {
                    kony.sdk.websocket.unSubscribeServerEvents(eventsString, null, unSubscribeOptions);
                }

            }, function (error) {
                kony.sdk.logsdk.error(TAG + "unSubscribeServerEvents::onFailure Error:", error);
                callbackErrorInvoker(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR, error, onErrorCallback);
            });
        } else{

            kony.sdk.logsdk.error(TAG + "unSubscribeServerEvents:: Events to be unsubscribed for are null or undefined or empty.");
            callbackErrorInvoker(kony.sdk.websocket.constants.WEBSOCKET_TYPE_ONERROR,
                "Events to be Unsubscribed are null or undefined or empty.", onErrorCallback);
            return;
        }

    };

    // Initialise serverEvents
    initializeWebSocketConstants();
    initializeWebSocketHandler();

    //#ifdef PLATFORM_SPA
    initializeWebSocketManager();
    initializeWebSocketResponseMessage();
    initializeWebSocketResponseHandler();
    //#endif
}
