/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASPluginUtils = require("./MASPluginUtils"),
    MASPluginConstants = require("./MASPluginConstants");

var MASPluginApplication = function() {
    ///------------------------------------------------------------------------------------------------------------------
    /// @name Constants
    ///------------------------------------------------------------------------------------------------------------------

    this.MASAuthenticationStatus = {
        MASAuthenticationStatusNotLoggedIn: -1,//MASAuthenticationStatusNotLoggedIn represents that the app has not been authenticated
        MASAuthenticationStatusLoginWithUser: 0,//MASAuthenticationStatusLoginWithUser represents that the app has been authenticated with user
        MASAuthenticationStatusLoginAnonymously: 1//MASAuthenticationStatusLoginAnonymously represents that the app has been authenticated with client credentials
    };

    /**
    *   Checks if application is authenticated
    *   @param {function} successHandler user defined success callback
    *   @param {function} errorHandler user defined error callback
    */
    this.isApplicationAuthenticated = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginApplication", "isApplicationAuthenticated", []);
    };

    /**
    *   Returns the authentication status of the application
    *   @param {function} successHandler user defined success callback
    *   @param {function} errorHandler user defined error callback
    */
    this.authenticationStatus  = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginApplication", "authenticationStatus", []);
    };

    /**
    *   Launches the selected enterprise App
    *   @param {function} successHandler user defined success callback
    *   @param {function} errorHandler user defined error callback
    *   @param {string} appId app ID of the app that needs to be launched
    */
    this.launchApp = function(successHandler, errorHandler, appId) {
        document.addEventListener("backbutton", MASPluginUtils.onBackKeyPressEvent, false);
        return Cordova.exec(successHandler, errorHandler, "MASPluginApplication", "launchApp", [appId]);
    };


    /**
    *   Retrieves all the enterprise apps in the form of JSON from the server. It includes both native and web apps
    *   @param {function} successHandler user defined success callback
    *   @param {function} errorHandler user defined error callback
    */
    this.retrieveEnterpriseApps = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginApplication", "retrieveEnterpriseApps", []);
    };

    /**
    *   Initializes the Enterprise Browser window and populates it with the native and web apps registered in the MAG server
    *   @param {function} successHandler user defined success callback
    *   @param {function} errorHandler user defined error callback
    */
    this.initEnterpriseBrowser = function(successHandler, errorHandler) {
            return Cordova.exec(function(result) {
                MASPluginUtils.MASPopupUI(MASPluginConstants.MASEnterpriseBrowserPage, result, function() {}, function() {
                    window.localStorage.removeItem("masCallbackResult");
                });
                successHandler(true);
            }, errorHandler, "MASPluginApplication", "retrieveEnterpriseApps", []);
    };
}
module.exports = MASPluginApplication;