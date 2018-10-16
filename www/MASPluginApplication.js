/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASPluginUtils = require("./MASPluginUtils"),
    MASPluginConstants = require("./MASPluginConstants");

/**
* @class MASPluginApplication
* @hideconstructor
* @classdesc The main class responsible for MASApplication Object Lifecycle Management.
* <table>
*	<tr bgcolor="#D3D3D3"><th>MASApplication Construtor</th></tr>
*	<tr><td><i>var MASApplication = new MASPlugin.MASApplication();</i></td></tr>
* </table>
*/
var MASPluginApplication = function() {

    this.MASAuthenticationStatus = {
        MASAuthenticationStatusNotLoggedIn: -1,//MASAuthenticationStatusNotLoggedIn represents that the app has not been authenticated
        MASAuthenticationStatusLoginWithUser: 0,//MASAuthenticationStatusLoginWithUser represents that the app has been authenticated with user
        MASAuthenticationStatusLoginAnonymously: 1//MASAuthenticationStatusLoginAnonymously represents that the app has been authenticated with client credentials
    };

    /**
    * Checks if application is authenticated.
	* @memberOf MASPluginApplication
	* @function isApplicationAuthenticated
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
    */
    this.isApplicationAuthenticated = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginApplication", "isApplicationAuthenticated", []);
    };

    /**
    * Returns the authentication status of the application
	* @memberOf MASPluginApplication
	* @function authenticationStatus
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
    */
    this.authenticationStatus  = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginApplication", "authenticationStatus", []);
    };

    /**
    * Launches the selected enterprise Application
	* @memberOf MASPluginApplication
	* @function launchApp
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
    * @param {string} appId application ID of the app that needs to be launched.
    */
    this.launchApp = function(successHandler, errorHandler, appId) {
        document.addEventListener("backbutton", MASPluginUtils.onBackKeyPressEvent, false);
        return Cordova.exec(successHandler, errorHandler, "MASPluginApplication", "launchApp", [appId]);
    };


    /**
    * Retrieves all the enterprise apps in the form of JSON from the server. It includes both native and web apps
	* @memberOf MASPluginApplication
	* @function retrieveEnterpriseApps
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
    */
    this.retrieveEnterpriseApps = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginApplication", "retrieveEnterpriseApps", []);
    };

    /**
    * Initializes the Enterprise Browser window and populates it with the native and web apps registered in the MAG server
	* @memberOf MASPluginApplication
	* @function initEnterpriseBrowser
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
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