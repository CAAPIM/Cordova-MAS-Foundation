
/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */
var MASPluginUtils = require("./MASPluginUtils"),
    MASPluginConstants = require("./MASPluginConstants"),
    MASPluginCallbacks = require("./MASPluginCallbacks");

var MASPluginUser = require("./MASPluginUser");

var MASPluginMAS = function() {


    ///------------------------------------------------------------------------------------------------------------------
    /// @name Properties
    ///------------------------------------------------------------------------------------------------------------------

    /**
     * Initializes the MAS plugin. This includes setting of the various listeners required
     * for authenticating the user while registration of the application with the Gateway
     * and accessing various protected API. Any further initialization related setting will go here
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     */
    this.initialize = function(successHandler, errorHandler) {
        Cordova.exec(MASPluginCallbacks.MASAuthenticationCallback, errorHandler, "MASPluginMAS", "setAuthenticationListener", []);
        Cordova.exec(MASPluginCallbacks.MASOTPChannelSelectCallback, errorHandler, "MASPluginMAS", "setOTPChannelSelectorListener", []);
        Cordova.exec(MASPluginCallbacks.MASOTPAuthenticationCallback, errorHandler, "MASPluginMAS", "setOTPAuthenticationListener", []);
        // TODO: Check for success or error
        return successHandler("Initialization success !!");
    };


    /**
     * Sets the authentication UI handling page
     *
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     * @param {string} customPage user defined page if you want the plugin to use it.
     *     "mas-login.html" is the default page.
     */
    this.setCustomLoginPage = function(successHandler, errorHandler, customPage) {
        MASPluginConstants.MASLoginPage = "masui/mas-login.html";
        if (customPage) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                if (this.response) {
                    MASPluginConstants.MASLoginPage = customPage;
                    return successHandler("Login page set to :" + MASPluginConstants.MASLoginPage);
                }
            };

            xhr.onerror = function(err) {
                errorHandler(err);
            };

            xhr.open('GET', customPage, true);
            xhr.send();
        } else {
            MASPluginConstants.MASLoginPage = "masui/mas-login.html";
            return errorHandler({
                errorMessage: "Can't find " + customPage
            });
        }
    };


    /**
     * Sets the OTP Channels Selection UI handling page
     *
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     * @param {string} customPage user defined page if you want the plugin to use it.
     *     "mas-otpchannel.html" is the default page.
     */
    this.setCustomOTPChannelsPage = function(successHandler, errorHandler, customPage) {
        if (customPage) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                if (this.response) {
                    MASPluginConstants.MASOTPChannelsPage = customPage;
                    return successHandler("OTP channels page set to :" + MASPluginConstants.MASOTPChannelsPage);
                }
            };

            xhr.onerror = function(err) {
                errorHandler(err);
            };

            xhr.open('GET', customPage, true);
            xhr.send();
        } else {
            MASPluginConstants.MASOTPChannelsPage = "mas-otpchannel.html";
            return errorHandler({
                errorMessage: "Can't find " + customPage
            });
        }
    };


    /**
     * Sets the OTP UI handling page
     *
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     * @param {string} customPage user defined page if you want the plugin to use it.
     *     "mas-otp.html" is the default page.
     */
    this.setCustomOTPPage = function(successHandler, errorHandler, customPage) {
        if (customPage) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                if (this.response) {
                    MASPluginConstants.MASOTPPage = customPage;
                    return successHandler("OTP page set to :" + MASPluginConstants.MASOTPPage);
                }
            };

            xhr.onerror = function(err) {
                errorHandler(err);
            };

            xhr.open('GET', customPage, true);
            xhr.send();
        } else {
            MASPluginConstants.MASOTPPage = "mas-otp.html";
            return errorHandler({
                errorMessage: "Can't find " + customPage
            });
        }
    };


    /**
     * Use Native MASUI
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     */
    this.useNativeMASUI = function(successHandler, errorHandler) {
        Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "useNativeMASUI", []);
    };

    /**
     * Enable Browser based authentication.
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     *
     */
    this.enableBrowserBasedAuthentication = function(successHandler, errorHandler) {
        Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "enableBrowserBasedAuthentication");
    };
    
    

    /**
     Sets the name of the configuration file.  This gives the ability to set the file's name to a custom value.
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     * @param {string} fileName
     */
    this.configFileName = function(successHandler, errorHandler, fileName) {
        if (fileName) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                if (this.response) {
                    if (fileName.endsWith(".json")) {
                        fileName = fileName.slice(0, -5);
                    }
                    return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "setConfigFileName", [fileName]);
                }
            };

            xhr.onerror = function(err) {
                return errorHandler({
                    errorMessage: "Can't find " + fileName
                });
            };

            if (fileName.endsWith(".json")) {
                xhr.open('GET', "../" + fileName, true);
            } else {
                xhr.open('GET', "../" + fileName + ".json", true);
            }
            xhr.send();
        } else {
            return errorHandler({
                errorMessage: "Can't find the file"
            });
        }
    };


    /**
     Sets the device registration type as MASDeviceRegistrationType. This should be set before MAS start is called
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     * @param {MASGrantFlow} MASGrantFlow
     */
    this.grantFlow = function(successHandler, errorHandler, MASGrantFlow) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "setGrantFlow", [MASGrantFlow]);
    };


    ///------------------------------------------------------------------------------------------------------------------
    /// @name Authentication callbacks
    ///------------------------------------------------------------------------------------------------------------------

    /**
     Completes the current user's authentication session validation.
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     * @param {string} username user defined username
     * @param {string} password user defined password
    */
    this.completeAuthentication = function(successHandler, errorHandler, username, password) {
        if (document.getElementById("errorMesg"))
            document.getElementById("errorMesg").innerHTML = "";

        return Cordova.exec(
            function() {
                if (document.getElementById("CA-Username") !== null) {
                    if (typeof jQuery !== 'undefined' && typeof $.mobile !== 'undefined') {
                        $.mobile.activePage.find(".messagePopup").popup("close");
                    } else {
                        window.MASPopupUI.close();
                            document.getElementById('popup').remove();
                    }
                }
                successHandler(true);
            },
            function(error) {
                if (typeof error !== 'undefined' && !MASPluginUtils.isEmpty(error)) {
                    if (typeof error.errorCode !== 'undefined' &&
                        !MASPluginUtils.isEmpty(error.errorCode) &&
                        !isNaN(error.errorCode)) {

                        var returnedError = "";
                        var errorMsgToDisplay = "";
                        var errorCodeLastDigits = error.errorCode % 1000;

                        try {
                            if (typeof error.errorMessage !== 'undefined' && !MASPluginUtils.isEmpty(error.errorMessage)) {
                                returnedError = JSON.parse(error.errorMessage);
                            }
                        } catch (e) {

                        }

                        if (errorCodeLastDigits === 103) {
                            errorMsgToDisplay = "invalid request: Missing or duplicate parameters";
                            document.getElementById("errorMesg").innerHTML = errorMsgToDisplay;
                        } else if (errorCodeLastDigits === 202) {
                            errorMsgToDisplay = "Username or Password invalid";
                            document.getElementById("errorMesg").innerHTML = errorMsgToDisplay;
                        } else if (errorCodeLastDigits === 105) {
                            errorMsgToDisplay = "Device registration error. The device has already been registered.";
                            document.getElementById("errorMesg").innerHTML = errorMsgToDisplay;
                        } else if (errorCodeLastDigits === 107) {
                            errorMsgToDisplay = "The given mag-identifier is either invalid or points to an unknown device.";
                            document.getElementById("errorMesg").innerHTML = errorMsgToDisplay;
                        } else {
                            if (typeof jQuery !== 'undefined' && typeof $.mobile !== 'undefined') {
                                $.mobile.activePage.find(".messagePopup").popup("close");
                            } else {
                                window.MASPopupUI.close();
                                    document.getElementById('popup').remove();
                            }
                        }
                    }
                } else {

                    if (typeof jQuery !== 'undefined' &&
                        typeof $.mobile !== 'undefined') {
                        $.mobile.activePage.find(".messagePopup").popup("close");
                    } else {
                        window.MASPopupUI.close();
                            document.getElementById('popup').remove();
                    }
                }
                errorHandler(error);
            },
            "MASPluginMAS", "completeAuthentication", [username, password]);
    };

    /**
     * Perform social login
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     * @param args social login provider
     */

    this.doSocialLogin = function(successHandler, errorHandler, provider) {
        return Cordova.exec(function() {
            if (typeof jQuery !== 'undefined' && typeof $.mobile !== 'undefined') {
                $.mobile.activePage.find(".messagePopup").popup("close");
            } else {
                window.MASPopupUI.close();
                    document.getElementById('popup').remove();
            }
            successHandler(true);
        }, function(errorInfo) {
            if (typeof jQuery !== 'undefined' && typeof $.mobile !== 'undefined') {
                $.mobile.activePage.find(".messagePopup").popup("close");
            } else {
                window.MASPopupUI.close();
                    document.getElementById('popup').remove();
            }
            errorHandler(errorInfo);
        }, "MASPluginMAS", "doSocialLogin", [provider]);
    }


    /**
     Cancels the current user's authentication session validation.
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     * @param args user defined variable which is request ID in Android. It is not used in iOS
     */
    this.cancelAuthentication = function(successHandler, errorHandler) {
        if (typeof jQuery !== 'undefined' && typeof $.mobile !== 'undefined') {
            $.mobile.activePage.find(".messagePopup").popup("close");
        } else {
            window.MASPopupUI.close();
                document.getElementById('popup').remove();
        }

		return Cordova.exec(
            function() {
                if (typeof jQuery !== 'undefined' && typeof $.mobile !== 'undefined') {
                    $.mobile.activePage.find(".messagePopup").popup("close");
                } else {
                    window.MASPopupUI.close();
                        document.getElementById('popup').remove();
                }
                successHandler(true);
            },
            errorHandler, "MASPluginMAS", "cancelAuthentication", [MASPluginConstants.MASLoginAuthRequestId]);
    };


    ///------------------------------------------------------------------------------------------------------------------
    /// @name One Time Password callbacks
    ///------------------------------------------------------------------------------------------------------------------

    /**
     Requests server to generate and send OTP to the channels provided.
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     * @param {array} channels user defined variable which is an array of channels where the OTP is to be delivered.
     */
    this.generateAndSendOTP = function(successHandler, errorHandler, channels) {
        return Cordova.exec(
            function(shouldValidateOTP) {
                if (typeof jQuery !== 'undefined' && typeof $.mobile !== 'undefined') {
                    $('#popUp').remove();
                } else {
                    window.MASPopupUI.close();
                        document.getElementById('popup').remove();
                }

                if ("true" == shouldValidateOTP) {
                    MASPluginUtils.MASPopupUI(
                        MASPluginConstants.MASOTPPage,
                        function() {
                            if (typeof jQuery !== 'undefined' && typeof $.mobile !== 'undefined') {
                                $('#popUp').remove();
                            } else {
                                window.MASPopupUI.close();
                                    document.getElementById('popup').remove();
                            }
                        },
                        function() {}
                    );
                }
            },
            function(error) {
                if (document.getElementById("errorMesg")) {
                    var errorMsgToDisplay = "Internal Server Error.";
                    if (typeof error !== 'undefined' && !MASPluginUtils.isEmpty(error) &&
                       typeof error.errorMessage !== 'undefined' && !MASPluginUtils.isEmpty(error.errorMessage)) {
                       errorMsgToDisplay = error.errorMessage;
                    }
                    document.getElementById("errorMesg").innerHTML = errorMsgToDisplay;
                } else {
                    errorHandler(error);
                }
            }, "MASPluginMAS", "generateAndSendOTP", [channels]);
    };


    /**
     Cancels the current user's generating and sending OTP call.
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     */
    this.cancelGenerateAndSendOTP = function(successHandler, errorHandler) {
        if (typeof jQuery !== 'undefined' && typeof $.mobile !== 'undefined') {
            $.mobile.activePage.find(".messagePopup").popup("close");
        } else {
            window.MASPopupUI.close();
                document.getElementById('popup').remove();
        }
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "cancelGenerateAndSendOTP", []);
    };


    /**
     Validates the entered OTP.
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     * @param {string} otp user defined one-time password that is to be verified
     */
    this.validateOTP = function(successHandler, errorHandler, otp) {
        if (typeof jQuery !== 'undefined' && typeof $.mobile !== 'undefined') {
            $.mobile.activePage.find(".messagePopup").popup("close");
        } else {
            window.MASPopupUI.close();
                document.getElementById('popup').remove();
        }
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "validateOTP", [otp]);
    };


    /**
     Cancels the authentication validation session of the user
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     */
    this.cancelOTPValidation = function(successHandler, errorHandler) {
        if (typeof jQuery !== 'undefined' && typeof $.mobile !== 'undefined') {
            $.mobile.activePage.find(".messagePopup").popup("close");
        } else {
            window.MASPopupUI.close();
                document.getElementById('popup').remove();
        }
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "cancelOTPValidation", []);
    };

    ///------------------------------------------------------------------------------------------------------------------
    /// @name Start & Stop
    ///------------------------------------------------------------------------------------------------------------------

    /**
     Starts the lifecycle of the MAS processes. This includes the registration of the application on the Gateway, if the network is available.
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     */
    this.start = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "start", []);
    };

    /**
     Starts the lifecycle of the MAS processes with a specified default configuration. This includes the registration of the application on the Gateway, if the network is available.
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     * @param {array} defaultConfiguration
     */
    this.startWithDefaultConfiguration = function(successHandler, errorHandler, defaultConfiguration) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "startWithDefaultConfiguration", [defaultConfiguration]);
    };

    /**
     Starts the lifecycle of the MAS processes with a specified msso_config.json. This includes the registration of the application on the Gateway, if the network is available.
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     * @param {jsonObject} jsonObject
     */
    this.startWithJSON = function(successHandler, errorHandler, jsonObject) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "startWithJSON", [jsonObject]);
    };

    /**
     Starts the lifecycle of the MAS processes with given JSON configuration file path or URL. This method will (if it is different) overwrite the JSON configuration that was stored.
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     * @param {String}   url URL of the JSON configuration file path
     */
    this.startWithURL = function(successHandler, errorHandler, url) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "startWithURL", [url]);
    };

    /**
     Enable PKCE extension to OAuth.
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     *@param {boolean}   enable True to enable PKCE extension, False to disable PKCE Extension. Default to true.
     */
    this.enablePKCE = function(successHandler, errorHandler, enable) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "enablePKCE", [enable]);
    };

    /**
     Determines whether PKCE extension is enabled.
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     */
    this.isPKCEEnabled = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "isPKCEEnabled", []);
    };


    /**
     Stops the lifecycle of all MAS processes.
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     */
    this.stop = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "stop", []);
    };


    ///------------------------------------------------------------------------------------------------------------------
    /// @name Gateway monitoring
    ///------------------------------------------------------------------------------------------------------------------
    /**
     Checks whether the Gateway is reachable
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     */
    this.gatewayIsReachable = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "gatewayIsReachable", []);
    };

	/**
     Sets the Security Configurations for External Servers. This API should be invoked before making calls to External Server
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     * @param {jsonObject} jsonObject as a representation of MASSecurityConfiguration
     */
	this.setSecurityConfiguration = function(successHandler,errorHandler,masSecurityConfiguration){
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "setSecurityConfiguration", [masSecurityConfiguration]);
    }


    ///------------------------------------------------------------------------------------------------------------------
    /// @name HTTP Requests
    ///------------------------------------------------------------------------------------------------------------------

    /**
     Calls the HTTP GET method from the gateway. This requires at least three mandatory parameters as shown in the below example. The requestType and responseType are the optional parameters. If the requestType and responseType are not present, then it is set to the default JSON type.
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     * @param {string} path URL path
     * @param {string} parametersInfo parameters to be passed along with the request
     * @param {string} headersInfo headers of the request
     * @param {string} requestType specifies the request type of the request
     * @param {string} responseType specifies the response type of the request
     * @param {string} isPublic specifies if the API being called is public or not
     */
    this.getFromPath = function(successHandler, errorHandler, path, parametersInfo, headersInfo, requestType, responseType, isPublic) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "getFromPath", [path, parametersInfo, headersInfo, requestType, responseType, isPublic]);
    };


    /**
     Calls the HTTP DELTE method from the Gateway. It requires at least three mandatory parameters as shown in the below example. The requestType and responseType are the optional parameters. If the requestType and responseType are not present, then it is set to the default JSON type.
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     * @param {string} path URL path
     * @param {string} parametersInfo parameters to be passed along with the request
     * @param {string} headersInfo headers of the request
     * @param {string} requestType specifies the request type of the request
     * @param {string} responseType specifies the response type of the request
     * @param {string} isPublic specifies if the API being called is public or not
     */
    this.deleteFromPath = function(successHandler, errorHandler, path, parametersInfo, headersInfo, requestType, responseType, isPublic) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "deleteFromPath", [path, parametersInfo, headersInfo, requestType, responseType, isPublic]);
    };


    /**
     Calls the HTTP POST method from the Gateway. This expects at least three mandatory parameters as shown in the below example. The requestType and responseType are the optional parameters. If the requestType and responseType are not present, then it is set to the default JSON type
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     * @param {string} path path to the url
     * @param {string} parametersInfo parameters to be passed along with the request
     * @param {string} headersInfo headers of the request
     * @param {string} requestType specifies the request type of the request
     * @param {string} responseType specifies the response type of the request
     * @param {string} isPublic specifies if the API being called is public or not
     */
    this.putToPath = function(successHandler, errorHandler, path, parametersInfo, headersInfo, requestType, responseType, isPublic) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "putToPath", [path, parametersInfo, headersInfo, requestType, responseType, isPublic]);
    };


    /**
     postToPath does the HTTP POST call from the gateway. This expects atleast three mandatry parameters as shown in the the below example. The requestType and responseType are the optional parameters. If the requestType and responseType is not present then it is set to the Default Type to JSON.
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     * @param {string} path path to the url
     * @param {string} parametersInfo parameters to be passed along with the request
     * @param {string} headersInfo headers of the request
     * @param {string} requestType specifies the request type of the request
     * @param {string} responseType specifies the response type of the request
     * @param {string} isPublic specifies if the API being called is public or not
     */
    this.postToPath = function(successHandler, errorHandler, path, parametersInfo, headersInfo, requestType, responseType, isPublic) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "postToPath", [path, parametersInfo, headersInfo, requestType, responseType, isPublic]);
    };


    /**
     Returns current MASState value.  The value can be used to determine which state SDK is currently at.
     * @param {function} successHandler user defined success callback
     * @param {function} errorHandler user defined error callback
     */
    this.getMASState = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "getMASState", []);
    };

    ///------------------------------------------------------------------------------------------------------------------
    /// @name Proximity Login
    ///------------------------------------------------------------------------------------------------------------------
    /**
     *   Authorizes with a QR code
     *   @param {function} successHandler user defined success callback
     *   @param {function} errorHandler user defined error callback
     *   @param {string} code code extracted by the QR code scanner
     */
    this.authorize = function(successHandler, errorHandler, code) {
        Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "authorizeQRCode", [code]);
    };

    /**
     *   Signs MASClaims object with default private key.
     *   @param {function} successHandler user defined success callback
     *   @param {function} errorHandler user defined error callback
     *   @param {string} claims claims JSON object
     */
    this.signWithClaims = function(successHandler, errorHandler, claims) {
        Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "signWithClaims", [claims]);
    };

    /**
     *   Signs MASClaims object with custom private key.
     *   @param {function} successHandler user defined success callback
     *   @param {function} errorHandler user defined error callback
     *   @param {string} claims claims JSON object
     *   @param {string} privateKey private key as a base64 encoded string
     */
    this.signWithClaimsPrivateKey = function(successHandler, errorHandler, claims, privateKey) {
        Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "signWithClaims", [claims, privateKey]);
    };

    ///------------------------------------------------------------------------------------------------------------------
    /// @name Utility
    ///------------------------------------------------------------------------------------------------------------------

    /**
     Closes an existing popup.
     */
    this.closePopup = function() {
        if (typeof jQuery !== 'undefined' && typeof $.mobile !== 'undefined') {
            $.mobile.activePage.find(".messagePopup").popup("close");
        } else {
            window.MASPopupUI.close();
                document.getElementById('popup').remove();
        }
        return;
    };
};

module.exports = MASPluginMAS;
