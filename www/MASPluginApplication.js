/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASPluginUtils = require("./MASPluginUtils"),
    MASPluginConstants = require("./MASPluginConstants");
 
var MASPluginApplication = function() {

    this.MASAuthenticationStatus = {
        
        /**
         *  MASAuthenticationStatusNotLoggedIn represents that the app has not been authenticated.
         */    
        MASAuthenticationStatusNotLoggedIn: -1,
        
        /**
         *  MASAuthenticationStatusLoginWithUser represents that the app has been authenticated with user.
         */
        MASAuthenticationStatusLoginWithUser: 0,

        /**
         *  MASAuthenticationStatusLoginAnonymously represents that the app has been authenticated with client credentials.
         */ 
        MASAuthenticationStatusLoginAnonymously: 1
    },
        
    /**
     this.getIdentifier = function(successHandler, errorHandler)
     {
         return Cordova.exec(successHandler, errorHandler, "MASPlugin", "getIdentifier",[]);
     };
     
     this.getName = function(successHandler, errorHandler,args)
     {
         return Cordova.exec(successHandler, errorHandler, "MASPlugin", "getName",[args]);
     };
     
     this.getIconUrl = function(successHandler, errorHandler)
     {
         return Cordova.exec(successHandler, errorHandler, "MASPlugin", "getIconUrl",[]);
     };
     
     this.getAuthUrl = function(successHandler, errorHandler)
     {
         return Cordova.exec(successHandler, errorHandler, "MASPlugin", "getAuthUrl",[]);
     };
     
     this.getNativeUri = function(successHandler, errorHandler)
     {
         return Cordova.exec(successHandler, errorHandler, "MASPlugin", "getNativeUri",[]);
     };
     
     this.getCustom = function(successHandler, errorHandler)
     {
         return Cordova.exec(successHandler, errorHandler, "MASPlugin", "getCustom",[]);
     };
     */

        this.retrieveEnterpriseApps = function(successHandler, errorHandler) {
         
            return Cordova.exec(successHandler, errorHandler, "MASPlugin", "retrieveEnterpriseApps", []);
        };

        this.launchApp = function(successHandler, errorHandler, appId) {
            
            document.addEventListener("backbutton", MASPluginUtils.onBackKeyPressEvent, false);
            
            return Cordova.exec(successHandler, errorHandler, "MASPlugin", "launchApp", [appId]);
        };
        
        this.initEnterpriseBrowser = function(successHandler, errorHandler) {
            
            var result = Cordova.exec(function(result) {
                
                MASPlugin.MASConfig.MASPopupUI(MASPlugin.MASConfig.enterpriseBrowserPage, function() {}, function() {
                    displayApps(result);
                    successHandler(true);
                });
            }, errorHandler, "MASPlugin", "retrieveEnterpriseApps", []);
            
            return result;
        };
    }

module.exports = MASPluginApplication;