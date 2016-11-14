/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASPluginUtils = require("./MASPluginUtils"),
    MASPluginConstants = require("./MASPluginConstants"),
    MASPluginCallbacks = require("./MASPluginCallbacks");
    
var MASPluginMAS = function() {
    
    /**
     * Initializes the MAS plugin. This includes setting of the various listeners required
     * for authenticating the user while registration of the application with the Gateway
     * and accessing various protected api. Any further initialization related setting will go here.
     */
    this.initialize = function(successHandler, errorHandler) {
        
        Cordova.exec(MASPluginCallbacks.MASAuthenticationCallback, errorHandler, "MASPlugin", "setAuthenticationListener", []);
        
        Cordova.exec(MASPluginCallbacks.MASOTPChannelSelectCallback, errorHandler, "MASPlugin", "setOTPChannelSelectorListener", []);
        
        Cordova.exec(MASPluginCallbacks.MASOTPAuthenticationCallback, errorHandler, "MASPlugin", "setOTPAuthenticationListener", []);
        
        // TODO: Check for success or error
        return successHandler("Initialization success !!");
    };

    /**
     * Use Native MASUI
     */
    this.useNativeMASUI = function(successHandler, errorHandler) {
        
        Cordova.exec(successHandler, errorHandler, "MASPlugin", "useNativeMASUI", []);
    };

    /**
     * Set the authentication UI handling page by this plugin.
     *
     * @param successHandler user defined success callback
     * @param errorHandler user defined error callback
     * @param customPage user defined page if you want the plugin to use it.
     *     "mas-login.html" is the default page.
     */
    this.setCustomLoginPage = function(successHandler, errorHandler, customPage) {
        
        if (customPage) {
            
            MASPluginFetch(
                customPage,
                function() {

                    MASPluginConstants.MASLoginPage = customPage;
                    return successHandler("Login page set to :" + MASPluginConstants.MASLoginPage);
                },
                function() {

                    MASPluginConstants.MASLoginPage = "masui/mas-login.html";
                    return errorHandler({
                        errorMessage: "Can't find " + customPage
                }
            );                
        } 
        else 
        {
            MASPluginConstants.MASLoginPage = "masui/mas-login.html";
            return errorHandler({
                errorMessage: "Can't find " + customPage
            });
        }
    };

    /**
     * Set the OTP Channels Selection UI handling page by this plugin.
     *
     * @param successHandler user defined success callback
     * @param errorHandler user defined error callback
     * @param customPage user defined page if you want the plugin to use it.
     *     "mas-otpchannel.html" is the default page.
     */
    this.setCustomOTPChannelsPage = function(successHandler, errorHandler, customPage) {
        
        if (customPage) {
            
            MASPluginFetch(
                customPage,
                function() {

                    MASPluginConstants.MASOTPChannelsPage = customPage;
                    return successHandler("OTP Channels page set to :" + MASPluginConstants.MASOTPChannelsPage); 
                },
                function() {

                    MASPluginConstants.MASOTPChannelsPage = "mas-otpchannel.html";
                    return errorHandler({
                        errorMessage: "Can't find " + customPage
                    });
                }
            );
        } 
        else 
        {
            MASPluginConstants.MASOTPChannelsPage = "mas-otpchannel.html";
            return errorHandler({
                errorMessage: "Can't find " + customPage
            });
        }
    };

    /**
     * Set the OTP UI handling page by this plugin.
     *
     * @param successHandler user defined success callback
     * @param errorHandler user defined error callback
     * @param customPage user defined page if you want the plugin to use it.
     *     "mas-otp.html" is the default page.
     */
    this.setCustomOTPPage = function(successHandler, errorHandler, customPage) {
        
        if (customPage) {
            
            MASPluginFetch(
                customPage,
                function() {

                    MASPluginConstants.MASOTPPage = customPage;
                    return successHandler("OTP page set to :" + MASPluginConstants.MASOTPPage);
                },
                function() {

                    MASPluginConstants.MASOTPPage = "mas-otp.html";
                    return errorHandler({
                        errorMessage: "Can't find " + customPage
                    });
                }
            );
        } 
        else 
        {
            MASPluginConstants.MASOTPPage = "mas-otp.html";
            return errorHandler({
                errorMessage: "Can't find " + customPage
            });
        }
    };

    /**
     Sets the device registration type MASDeviceRegistrationType. This should be set before MAS start is executed.
     */
    this.grantFlow = function(successHandler, errorHandler, MASGrantFlow) {
    
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "setGrantFlow", [MASGrantFlow]);
    };

    /**
     Set the name of the configuration file.  This gives the ability to set the file's name to a custom value.
     */
    this.configFileName = function(successHandler, errorHandler, fileName) {
     
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "setConfigFileName", [fileName]);
    };

    /**
     Starts the lifecycle of the MAS processes. This includes the registration of the application to the Gateway, if the network is available.
     */
    this.start = function(successHandler, errorHandler) {
    
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "start", []);
    };

    this.startWithDefaultConfiguration = function(successHandler, errorHandler, defaultConfiguration) {
    
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "startWithDefaultConfiguration", [defaultConfiguration]);
    };

    this.startWithJSON = function(successHandler, errorHandler, jsonObject) {
     
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "startWithJSON", [jsonObject]);
    };

    this.authorize = function(successHandler, errorHandler, code) {
    
        Cordova.exec(successHandler, errorHandler, "MASPlugin", "authorizeQRCode", [code]);
    };

    /**
     Completes the current user's authentication session validation.
     * @param successHandler user defined success callback
     * @param errorHandler user defined error callback
     * @param username user defined username
     * @param password user defined password
    */
    this.completeAuthentication = function(successHandler, errorHandler, username, password) {
    
        if (document.getElementById("errorMesg")) 
            document.getElementById("errorMesg").innerHTML = "";

        return Cordova.exec(                
            function() {

                if (document.getElementById("CA-Username") !== null )
                    $.mobile.activePage.find(".messagePopup").popup("close");

                successHandler(true);
            }, 
            function(error) {
                
                if (typeof error !== 'undefined' && !MASPluginUtils.isEmpty(error)) {
                    
                    if (typeof error.errorCode !== 'undefined' && 
                        !MASPluginUtils.isEmpty(error.errorCode) && !isNaN(error.errorCode)) {
                    
                        var returnedError = "";
                        var errorMsgToDisplay = "";
                        var errorCodeLastDigits = error.errorCode % 1000;
                                                    
                        try {
                           
                            if (typeof error.errorMessage !== 'undefined' && 
                                !MASPluginUtils.isEmpty(error.errorMessage)) {

                                returnedError = JSON.parse(error.errorMessage);
                            }
                        } 
                        catch (e) {

                        }

                        if (errorCodeLastDigits === 103) {
                            
                            errorMsgToDisplay = "invalid request: Missing or duplicate parameters";
                            document.getElementById("errorMesg").innerHTML = errorMsgToDisplay;
                        } 
                        else if (errorCodeLastDigits === 202) {
                            
                            errorMsgToDisplay = "Username or Password invalid";
                            document.getElementById("errorMesg").innerHTML = errorMsgToDisplay;
                        }
                        else {
                            
                            $.mobile.activePage.find(".messagePopup").popup("close");
                        }
                    }
                } 
                else {
                    $.mobile.activePage.find(".messagePopup").popup("close");
                }
                
                errorHandler(error);
            }, 
            "MASPlugin", "completeAuthentication", [username, password]);
    };

    /**
     Cancels the current user's authentication session validation.
     * @param successHandler user defined success callback
     * @param errorHandler user defined error callback
     * @param args user defined variable which is request Id in Android. It is not used in iOS
     */
    this.cancelAuthentication = function(successHandler, errorHandler) {
    
        $.mobile.activePage.find(".messagePopup").popup("close");
     
        return Cordova.exec(
            function() {                    

                $.mobile.activePage.find(".messagePopup").popup("close");
                successHandler(true);                    
            }, 
            errorHandler, "MASPlugin", "cancelAuthentication", [MASPluginConstants.MASLoginAuthRequestId]);
    };

    /**
     Request Server to generate and send OTP to the channels provided.
     * @param successHandler user defined success callback
     * @param errorHandler user defined error callback
     * @channels user defined variable which is an array of channels where the OTP is to be delivered.
     */
    this.generateAndSendOTP = function(successHandler, errorHandler, channels) {

        return Cordova.exec(
            
            function(shouldValidateOTP) {
                
                $('#popUp').remove();
                
                if ("true" == shouldValidateOTP) {
                    MASPluginUtils.MASPopupUI(
                        MASPluginConstants.MASOTPPage, 
                        function() {
                            
                            $('#popUp').remove();
                        }, 
                        function() {}
                    );
                }
            },
            function(error) {

                if (document.getElementById("errorMesg")) {

                    var errorMsgToDisplay = "Internal Server Error.";
                    
                    if (typeof error !== 'undefined' && !MASPluginUtils.isEmpty(error) &&
                        typeof error.errorMessage !== 'undefined' && !MASPluginUtils.isEmpty(error.errorMessage)) 
                    {
                        errorMsgToDisplay = error.errorMessage;
                    }

                    document.getElementById("errorMesg").innerHTML = errorMsgToDisplay;
                } 
                else {

                    errorHandler(error);
                }
            }, "MASPlugin", "generateAndSendOTP", [channels]);
    };

    /**
     Cancels the current user's generating and sending OTP call.
     * @param successHandler user defined success callback
     * @param errorHandler user defined error callback
     */
    this.cancelGenerateAndSendOTP = function(successHandler, errorHandler) {
        
        $.mobile.activePage.find(".messagePopup").popup("close");
        
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "cancelGenerateAndSendOTP", []);
    };
    /**
     Validate the entered OTP.
     * @param successHandler user defined success callback
     * @param errorHandler user defined error callback
     * @param otp user defined one time password that is to be verified
     */
    this.validateOTP = function(successHandler, errorHandler, otp) {
        
        $.mobile.activePage.find(".messagePopup").popup("close");
        
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "validateOTP", [otp]);
    };
    /**
     Cancels the current user's authentication session validation.
     * @param successHandler user defined success callback
     * @param errorHandler user defined error callback
     */
    this.cancelOTPValidation = function(successHandler, errorHandler) {
        
        $.mobile.activePage.find(".messagePopup").popup("close");
        
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "cancelOTPValidation", []);
    };
    /**
     Closes an existing popup.
     * @param successHandler user defined success callback
     * @param errorHandler user defined error callback
     */
    this.closePopup = function() {
        
        $.mobile.activePage.find(".messagePopup").popup("close");
        
        return;
    };
    /**
     getFromPath does the HTTP GET call from the gateway. This expects atleast three mandatry parameters as shown in the the below example. The requestType and responseType are the optional parameters. If the requestType and responseType is not present then it is set to the Default Type to JSON.
     */
    this.getFromPath = function(successHandler, errorHandler, path, parametersInfo, headersInfo, requestType, responseType) {
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "getFromPath", [path, parametersInfo, headersInfo, requestType, responseType]);
    };
    /**
     deleteFromPath does the HTTP DELTE call from the gateway. This expects atleast three mandatry parameters as shown in the the below example. The requestType and responseType are the optional parameters. If the requestType and responseType is not present then it is set to the Default Type to JSON.
     */
    this.deleteFromPath = function(successHandler, errorHandler, path, parametersInfo, headersInfo, requestType, responseType) {
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "deleteFromPath", [path, parametersInfo, headersInfo, requestType, responseType]);
    };
    /**
     putToPath does the HTTP PUT call from the gateway. This expects atleast three mandatry parameters as shown in the the below example. The requestType and responseType are the optional parameters. If the requestType and responseType is not present then it is set to the Default Type to JSON.
     */
    this.putToPath = function(successHandler, errorHandler, path, parametersInfo, headersInfo, requestType, responseType) {
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "putToPath", [path, parametersInfo, headersInfo, requestType, responseType]);
    };
    /**
     postToPath does the HTTP POST call from the gateway. This expects atleast three mandatry parameters as shown in the the below example. The requestType and responseType are the optional parameters. If the requestType and responseType is not present then it is set to the Default Type to JSON.
     */
    this.postToPath = function(successHandler, errorHandler, path, parametersInfo, headersInfo, requestType, responseType) {
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "postToPath", [path, parametersInfo, headersInfo, requestType, responseType]);
    };
    /**
     Stops the lifecycle of all MAS processes.
     */
    this.stop = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "stop", []);
    };

    this.gatewayIsReachable = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPlugin", "gatewayIsReachable", []);
    };
}

module.exports = MASPluginMAS;