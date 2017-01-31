/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASPluginDevice = function() {

    /**
    * Fetches a device's registration state and identifier as JSON string.
    */
    this.getCurrentDevice = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "getCurrentDevice", []);
    };
    
    /**
    * Deregisters a device from MAG server i.e. remove all registration info of this device on server
    */
    this.deregister = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "deregister", []);
    };

    /**
    * Resets all the local cache of the device for this app i.e. all  tokens, credentials, states are flushed.
    */
    this.resetLocally = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "resetLocally", []);
    };

    /**
    * This API returns a boolean state of device's current registration status on MAG server.
    */
    this.isDeviceRegistered = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "isDeviceRegistered", []);
    };

    /**
    *  Fetches the current devices's identifier which is registered in MAG server.
    */
    this.getDeviceIdentifier = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "getDeviceIdentifier", []);
    };
}

module.exports = MASPluginDevice;