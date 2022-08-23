/**
 * Created by : Inderpreet kaur
 * Copyright : Kony Pvt Ltd, 2019
 *
 **/

/*
    Utilities file for object model generation.
 */

/**
 * Check if object is null, undefined or empty.
 *
 * @param object        input object
 * @returns {boolean|*} true/false
 */
konyModelIsNullOrUndefinedOrEmptyObject = function (object) {
    return (konyModelIsNullOrUndefined(object) || konyModelIsEmptyObject(object));
};

konyModelIsEmptyObject = function (obj) {
    if (typeof (obj) === "boolean"
        || typeof (obj) === "number") {
        return false;
    } else if (typeof (obj) === "string") {
        return obj.trim().length === 0;
    }

    for (var prop in obj) {
        return false;
    }
    return true;
};

konyModelIsNullOrUndefined = function (val) {
    if (val === null || val === undefined) {
        return true;
    } else {
        return false;
    }
};

/**
 * Check if object is boolean.
 *
 * @param val input object
 * @returns {boolean}
 */
konyModelIsObjectBoolean = function (val) {
    if (typeof val === "boolean") {
        return true;
    } else {
        return false;
    }
};

/**
 * Return boolean value if value is passed as string.
 *
 * @param val input object
 * @returns {boolean}
 */
konyModelReturnBooleanValue = function (val) {
    if (val === "true" || val === true) {
        return true;
    } else {
        return false;
    }
};

module.exports = {
    konyModelIsNullOrUndefinedOrEmptyObject,
    konyModelReturnBooleanValue,
    konyModelIsObjectBoolean
}