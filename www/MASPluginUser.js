/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASPluginUser = function() {

    this.isSessionLocked = function(successHandler, errorHandler) {

        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "isSessionLocked", []); 
    };

    this.lockSession = function(successHandler, errorHandler) {

        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "lockSession", []); 
    }

    this.unlockSession = function(successHandler, errorHandler) {

        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "unlockSession", []); 
    }

    this.unlockSessionWithMessage = function(successHandler, errorHandler, message) {

        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "unlockSessionWithMessage", [message]); 
    }

    this.removeSessionLock = function(successHandler, errorHandler) {

        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "removeSessionLock", []); 
    }

    /**
     Authenticates the user using the username and password.
     */
    this.loginWithUsernameAndPassword = function(successHandler, errorHandler, username, password) {
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "loginWithUsernameAndPassword", [username, password]);
    };
    /**
     * Performs an implicit login by calling an endpoint that requires authentication.
     */
    this.loginWithImplicitFlow = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "loginWithImplicitFlow", []);
    };
    /**
     log off user.
     */
    this.logoutUser = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "logoutUser", []);
    };
    /**
     *
     */
    this.getCurrentUser = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "getCurrentUser", []);
    };

    this.getUserName = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "getUserName", []);
    };
    /**
    Commented as they are related to SCIM as in Android, so Android implentation is not yet added.
   this.getName = function(successHandler, errorHandler)
    {
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "getName", []);
    }

    this.getAddressList = function(successHandler, errorHandler)
    {
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "getAddressList", []);
    }

    this.getEmailList = function(successHandler, errorHandler)
    {
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "getEmailList", []);
    }

    this.isActive = function(successHandler, errorHandler)
    {
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "isActive", []);
    }
    */

    this.isAuthenticated = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "isAuthenticated", []);
    };

}

module.exports = MASPluginUser;