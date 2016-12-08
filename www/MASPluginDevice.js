/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASPluginDevice = function() {
    
    this.getCurrentDevice = function(successHandler, errorHandler) {
    
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "getCurrentDevice", []);
    };
    
    /**
     Deregister the application resources on this device.
     */
    this.deregister = function(successHandler, errorHandler) {
    
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "deregister", []);
    };
    
    this.resetLocally = function(successHandler, errorHandler) {
    
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "resetLocally", []);
    };
    
    this.isDeviceRegistered = function(successHandler, errorHandler) {
    
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "isDeviceRegistered", []);
    };
    
    this.getDeviceIdentifier = function(successHandler, errorHandler) {
    
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "getDeviceIdentifier", []);
    };
}

module.exports = MASPluginDevice;