/**
 * Created by : Inderpreet kaur
 * Copyright : Kony Pvt Ltd, 2019
 *
 **/

/*
    Generates data for each file using templates and views.
 */

var fs = require('fs');
var Mustache = require('mustache');
var utils = require("./MDAModelUtils");

var templateDataMap = {};

/**
 * Create a mapping with template name and its data read from file for reusing it with different objects.
 *
 * @param templateFileName name of template file
 * @returns {string}   template data
 */
konyModelCreateTemplateDataMap = function(templateFileName) {
    if(konyModelIsNullOrUndefinedOrEmptyObject(templateDataMap[templateFileName])) {
        try {
            templateDataMap[templateFileName] = fs.readFileSync(templateFileName, 'utf8');
        } catch (exception) {
            throw exception
        }
    }
    return templateDataMap[templateFileName];
};

/**
 * Use mustache to render template with view data.
 *
 * @param templateData data for generating template
 * @param tableView    parsed JSON data for file generation
 * @returns {string}   rendered data
 */
konyModelRenderModelFromTemplateAndData = function (templateData, tableView) {
    return Mustache.render(templateData, tableView);
};

/**
 * Get model data for a table view parsed from object metadata.
 *
 * @param templateFileName   name of the template
 * @param tableView   parsed JSON data for file generation
 * @returns {string}  generated model to be read for file generation
 */
konyModelfetchRenderedData = function (templateFileName, tableView) {
    try {
        var templateData = konyModelCreateTemplateDataMap(templateFileName);
    } catch (exception) {
        throw exception
    }

    return konyModelRenderModelFromTemplateAndData(templateData, tableView);
};

module.exports = konyModelfetchRenderedData;