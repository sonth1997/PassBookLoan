/**
 * Created by : Inderpreet kaur
 * Copyright : Kony Pvt Ltd, 2019
 *
 **/

/*
    Interface for object model generation.
 */

var fs = require('fs');
var path = require('path');
var cprocess = require('child_process');
var objsvcFileGenerator = require("./MDAModelGenerationDriver.js");

/**
 * Generate object models by fetching Object service meta
 * from onPrem/Cloud Kony Fabric server application
 *
 * @param appConfig (on Prem) {
 *               "token : " ",
 *               "identityUrl" : " ",
 *               "consoleUrl" : " ",
 *               "appName" : "" ",
 *               "appVersion" : " ",
 *               "environmentName" : " "
 *               }.
 * @param appConfig (cloud):{
 *               "token" : " ",
 *               "accountId" : " ",
 *               "appName" : "" ",
 *               "appVersion" : " ",
 *               "environmentName" : " ",
 *               "cloudType" : "",
 *               "consoleUrl" : ""
 *               }.
 *
 * @param optionsAndParams contains  :{
 *                       "targetDirectoryForModels" : "targetDirectoryForModels",
 *                       "isCloud" : false,
 *                       "generateLegacyModels" : false,
 *                       "mfcliPath" : "mfcli.jar",
 *						 "javaCmd" : "java.exe",
 *						 "clipropfilePath" : "konyfabriccli.properties"
 *                       }
 *
 * All the parameters in appConfig are mandatory.
 * Following parameters in optionsAndParams are mandatory :
 *                                    "isCloud","mfcliPath","targetDirectoryForModels","javaCmd"
 *
 * @param successCallback response for success
 *
 * @param failureCallback response for errored scenarios
 *
 * Examples of commands to be executed for reference:
 *
 * for Kony Cloud (manage.kony.com) environment,
 * java -jar mfcli.jar object-services-meta --token <token> -t <account id> -a <app name> [-v <app version>] -e <environment name> -clurl <consoleUrl>
 *
 * for on-premise installation,
 * java -jar mfcli.jar object-services-meta --token <token> -au <Identity URL> -cu <Console URL> -a <app name> [-v <app version>] -e <environment name>
 *
 */
konyModelGenerator = function (appConfig, optionsAndParams, successCallback, failureCallback) {

    try {
        konyModelCleanUpTask();
    } catch (exception) {
        console.log("Error removing temporary files, Error : " + exception);
        failureCallback(new Error("Failed to delete temporary files : tempObjSvcMeta or tempObjSvcVerbsMeta from "
            + __dirname + " directory. Please delete them manually."));
        return;
    }

    konyModelValidateParams(appConfig, optionsAndParams, function (error) {
        console.log("Validation of parameters failed.");
        failureCallback(error);
        return;
    });

    console.log("Generating Models...");

    var metadataOperationMap = konyModelBuildCommands(appConfig, optionsAndParams);

    try {
        konyModelExecuteCommandHandler(metadataOperationMap, function (metadataMap) {
            var result = objsvcFileGenerator.konyModelGenerateModels(metadataMap, optionsAndParams["targetDirectoryForModels"]);

            if (!konyModelIsNullOrUndefinedOrEmptyObject(result) && result === true) {
                console.log("Models generated successfully.");
                successCallback({
                    "Status": 0
                });
            } else {
                console.log("Models generation failed, Error: " + result);
                failureCallback(result);
                return;
            }
        }, function (error) {
            console.log("Failed to execute command, Error: " + error);
            failureCallback(error);
            return;
        });
    } catch (exception) {
        console.log("Error in model generation.", exception);
        failureCallback(exception);
        return;
    }
};

/**
 * Check if the parameters passed are valid or not.
 *
 * @param appConfig  params to build the command for execution
 * @param optionsAndParams    additional parameters
 * @param failureCallback     called if validation fails
 */
konyModelValidateParams = function (appConfig, optionsAndParams, failureCallback) {
    if (konyModelIsNullOrUndefinedOrEmptyObject(appConfig) || konyModelIsNullOrUndefinedOrEmptyObject(optionsAndParams)) {
        return failureCallback(new Error("appConfig or optionsAndParams passed are null or undefined"));
    }

    if (konyModelIsNullOrUndefinedOrEmptyObject(optionsAndParams["javaCmd"])
        || konyModelIsNullOrUndefinedOrEmptyObject(optionsAndParams["mfcliPath"])
        || konyModelIsNullOrUndefinedOrEmptyObject(optionsAndParams["targetDirectoryForModels"])
        || (konyModelIsNullOrUndefinedOrEmptyObject(optionsAndParams["isCloud"]) && !(konyModelIsObjectBoolean(optionsAndParams["isCloud"])))) {
        return failureCallback(new Error("either 'mfcliPath' or 'targetDirectoryForModels' or 'isCloud' in optionsAndParams are null or undefined"));
    }

    optionsAndParams["isCloud"] = konyModelReturnBooleanValue(optionsAndParams["isCloud"]);
};

/**
 * Execute command on command line using node child process.
 *
 * @param outputFile       file to output the result of command executed
 * @param command          to be executed on terminal/cmd
 * @param successCallback  called on successful execution of command
 * @param failureCallback  called if any failure occurs
 * @returns {string} output of the command after execution
 **/
konyModelExecuteCommand = async function (outputFile, command, successCallback, failureCallback) {
    var metadata = "";
    command += " > " + "\"" + path.resolve(__dirname, outputFile) + "\"";

    cprocess.exec(command, (err, stdout, stderr) => {
        if (err) {
            failureCallback(err);
            return;
        }
        if (stderr) {
            failureCallback(stderr);
            return;
        }
        try {
            metadata = fs.readFileSync(path.resolve(__dirname, outputFile), 'utf8');
        } catch (exception) {
            console.log("Failed to read temp file at : " + path.resolve(__dirname, outputFile + ".txt"));
            throw exception;
        }

        successCallback({"metadata" : metadata, "outputFile" : outputFile});
    });
};

/**
 * Execute commands on command line using node child process.
 *
 * @param metadataOperationMap   map of command and corresponding file name to save the output
 * @param successCallback  called on successful execution of command
 * @param failureCallback  called if any failure occurs
 * @returns {array} output of the commands after execution
 **/
konyModelExecuteCommandHandler = async function (metadataOperationMap, successCallback, failureCallback) {
    var cmdOutput = [];

    for (var i = 0; i < metadataOperationMap.length; i++) {
        await konyModelExecuteCommand(metadataOperationMap[i].outputTo, metadataOperationMap[i].command, function (metadata) {
            cmdOutput.push(metadata);
            if (cmdOutput.length === metadataOperationMap.length) {
                successCallback(cmdOutput);
            }
        }, function (error) {
            failureCallback(error);
        })
    }
};

/**
 * Build commands to to fetch object service metadata and object service verbs metadata.
 *
 * @param appConfig  params to build the command for execution
 * @param optionsAndParams    additional parameters
 * @returns  *[] of command and corresponding file name to save the output
 */
konyModelBuildCommands = function(appConfig, optionsAndParams) {
    var objSvcCmd = konyModelBuildCommandForObjectServiceMetadata(appConfig, optionsAndParams);
    var objSvcVerbsCmd = konyModelBuildCommandForObjectServiceVerbsMetadata(appConfig, optionsAndParams);
    var metadataOperationMap = [{
        "command": objSvcCmd,
        "outputTo": "tempObjSvcMeta.txt"
    },
        {
            "command": objSvcVerbsCmd,
            "outputTo": "tempObjSvcVerbsMeta.txt"
        }
    ];
    return metadataOperationMap;
};

/**
 * Build command to fetch object service metadata.
 *
 * @param appConfig  params to build the command for execution
 * @param optionsAndParams    additional parameters
 * @returns {string} generated command string
 */
konyModelBuildCommandForObjectServiceMetadata = function (appConfig, optionsAndParams) {
    var buildCommand = "";

    let tokenParam = ` --token "${appConfig.token}"`,
        usernameParam = ` -u "${appConfig.username}" -p '${appConfig.password}'`,
        tokenString = appConfig.token ? tokenParam : usernameParam;

    if (optionsAndParams.isCloud) {
        buildCommand = "\"" + optionsAndParams.javaCmd + "\"" + " -DKONY_MFCLI_PROPERTIES_FILE=" + "\"" + optionsAndParams.clipropfilePath + "\"" + " -jar " + "\"" + optionsAndParams.mfcliPath + "\""
            + " object-services-meta" + tokenString
            + " -t " + "\"" + appConfig.accountId + "\""
            + " -a " + "\"" + appConfig.appName + "\""
            + " -v " + "\"" + appConfig.appVersion + "\""
            + " -e " + "\"" + appConfig.environmentName + "\""
			+ " -clurl " + "\"" + appConfig.consoleUrl + "\"";

        if (!konyModelIsNullOrUndefinedOrEmptyObject(appConfig.cloudType)) {
            buildCommand += " --cloud-type " + "\"" + appConfig.cloudType + "\"";
        }
    } else {
        buildCommand = "\"" + optionsAndParams.javaCmd + "\"" + " -jar " + "\"" + optionsAndParams.mfcliPath + "\""
            + " object-services-meta" + tokenString
            + " -au " + "\"" + appConfig.identityUrl + "\""
            + " -cu " + "\"" + appConfig.consoleUrl + "\""
            + " -a " + "\"" + appConfig.appName + "\""
            + " -v " + "\"" + appConfig.appVersion + "\""
            + " -e " + "\"" + appConfig.environmentName + "\"";
    }

    return buildCommand;
};

/**
 * Build command to fetch object service verbs metadata.
 *
 * @param appConfig  params to build the command for execution
 * @param optionsAndParams  additional parameters
 * @returns {string} generated command string
 */
konyModelBuildCommandForObjectServiceVerbsMetadata = function (appConfig, optionsAndParams) {
    var buildCommand = "";

    let tokenParam = ` --token "${appConfig.token}"`,
        usernameParam = ` -u "${appConfig.username}" -p '${appConfig.password}'`,
        tokenString = appConfig.token ? tokenParam : usernameParam;

    if (optionsAndParams.isCloud) {
        buildCommand = "\"" + optionsAndParams.javaCmd + "\"" + " -DKONY_MFCLI_PROPERTIES_FILE=" + "\"" + optionsAndParams.clipropfilePath + "\"" + " -jar " + "\"" + optionsAndParams.mfcliPath + "\""
            + " object-service-verbs-meta" + tokenString
            + " -t " + "\"" + appConfig.accountId + "\""
            + " -a " + "\"" + appConfig.appName + "\""
            + " -v " + "\"" + appConfig.appVersion + "\""
			+ " -clurl " + "\"" + appConfig.consoleUrl + "\"";

        if (!konyModelIsNullOrUndefinedOrEmptyObject(appConfig.cloudType)) {
            buildCommand += " --cloud-type " + "\"" + appConfig.cloudType + "\"";
        }
    } else {
        buildCommand = "\"" + optionsAndParams.javaCmd + "\"" + " -jar " + "\"" + optionsAndParams.mfcliPath + "\""
            + " object-service-verbs-meta" + tokenString
            + " -au " + "\"" + appConfig.identityUrl + "\""
            + " -cu " + "\"" + appConfig.consoleUrl + "\""
            + " -a " + "\"" + appConfig.appName + "\""
            + " -v " + "\"" + appConfig.appVersion + "\"";
    }

    return buildCommand;
};

/**
 * Clean temporary files.
 */
konyModelCleanUpTask = function () {
    var tempFiles = ["tempObjSvcMeta.txt", "tempObjSvcVerbsMeta.txt"];

    for (var i = 0; i < tempFiles.length; i++) {
        filePath = path.resolve(__dirname, tempFiles[i]);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("Deleting file at path :" + filePath);
        }
    }
};

/**
 * Build Master RepoManager for a Composite App
 *
 * @param sources         Array list addresses of all micro apps
 * @param destination     Address of the Composite App
 * @param successCallback response for success
 * @param failureCallback response for errored scenarios
 */
konyModelRMAccumulator = function(sources, destination, successCallback, failureCallback) {

    if (konyModelIsNullOrUndefinedOrEmptyObject(sources) ||
        konyModelIsNullOrUndefinedOrEmptyObject(destination)) {
        return failureCallback(new Error("Mandatory params(sources/destination) not found."));
    }

    var result = objsvcFileGenerator.konyModelMasterRepoManagerGenerator(sources, destination);

    if (!konyModelIsNullOrUndefinedOrEmptyObject(result) && result === true) {
        console.log("Master RepoManager generated");
        successCallback({
            "Status": 0
        });
    } else {
        console.log("Master RepoManager generation failed, Error: " + result);
        failureCallback(result);
        return;
    }
};

module.exports = {
    konyModelGenerator,
    konyModelRMAccumulator
};