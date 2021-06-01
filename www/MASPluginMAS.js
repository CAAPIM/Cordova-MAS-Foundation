/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
var MASPluginUtils = require("./MASPluginUtils"),
    MASPluginConstants = require("./MASPluginConstants"),
    MASPluginCallbacks = require("./MASPluginCallbacks");

var MASPluginUser = require("./MASPluginUser");

/**
* @class MASPluginMAS
* @hideconstructor
* @classdesc This main class contains the functions for MAS Lifecycle Management.
* <table>
*	<tr bgcolor="#D3D3D3"><th>MASPluginMAS Construtor</th></tr>
*	<tr><td><i>var MAS = new MASPlugin.MAS();</i></td></tr>
* </table>
*/
var MASPluginMAS = function() {


    ///------------------------------------------------------------------------------------------------------------------
    /// @name Properties
    ///------------------------------------------------------------------------------------------------------------------

    /**
     * Initializes the MAS plugin. This includes setting of the various listeners that are required for authenticating the user while registration of the application with the Gateway
     * and accessing various protected API. All other initialization related setting must be done in this method.
	 * @memberOf MASPluginMAS
	 * @function initialize
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     */
    this.initialize = function(successHandler, errorHandler) {
        Cordova.exec(MASPluginCallbacks.MASAuthenticationCallback, errorHandler, "MASPluginMAS", "setAuthenticationListener", []);
        Cordova.exec(MASPluginCallbacks.MASOTPChannelSelectCallback, errorHandler, "MASPluginMAS", "setOTPChannelSelectorListener", []);
        Cordova.exec(MASPluginCallbacks.MASOTPAuthenticationCallback, errorHandler, "MASPluginMAS", "setOTPAuthenticationListener", []);
        // TODO: Check for success or error
        return successHandler("Initialization success !!");
    };

    /**
     * Enables the developer to set its own Authentication Listener or callback handling
     * mechanism, which overrides the one that the CA Mobile Cordova Plugin sets. The developer needs to set their
     * business logic such as auditing etc. inside the authHandler function. The developer must call the 
     * MAS.completeAuthentication or MAS.cancelAuthentication API from this function to unblock the original API call.
	 * @memberOf MASPluginMAS
	 * @function setAuthCallbackHandler
	 * @instance
     * @param {function} authHandler user defined authentication callback handling function
	 * @example 
	 * <caption>How the authHandler structure should look like</caption>
function(result){
	let requestType = result.requestType;
	console.log(JSON.stringify(result));
	if(requestType !== null && requestType === 'Login'){
		mas.completeAuthentication(
			function () {
				console.log("Login successful");
			},
			function (error) {
				let returnedError = "Internal Server Error";
				if (error!=null && error.errorMessage != null) {
					returnedError = JSON.stringify(error.errorMessage);
				}
				console.log("Error in Login::"+returnedError);
			}, "username", "password");
			// Or you can choose to cancel this request as below
			// mas.cancelAuthentication(function() {},function (){});
		}
}
     */
    this.setAuthCallbackHandler = function(authHandler){
        this.initialize(function(){},function(){});
        MASPluginCallbacks.setCustomAuthHandler(authHandler);
    };

    /**
     * Removes the authentication listener set by developer. This would fallback to the
     * default mechanism of Authentication that the CA Mobile Cordova Plugin handles.
	 * @memberOf MASPluginMAS
	 * @function removeAuthCallbackHandler
	 * @instance
     */
    this.removeAuthCallbackHandler = function(){
        MASPluginCallbacks.removeCustomAuthHandler();
    };


    /**
     * Sets the authentication UI handling page i.e. developer can override the default Authentication UI HTML using this API.
	 * @memberOf MASPluginMAS
	 * @function setCustomLoginPage
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
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
     * Sets the OTP Channels Selection UI handling page i.e. developer can override the default OTP Channel Selection UI HTML using this API.
	 * @memberOf MASPluginMAS
	 * @function setCustomOTPChannelsPage
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
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
     * Sets the OTP UI handling page i.e. developer can override the default OTP handling UI HTML using this API.
	 * @memberOf MASPluginMAS
	 * @function setCustomOTPPage
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
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
     * Use Native MASUI. By default, CA Mobile Cordova plugin uses the HTML login screen. This API overrides to use the native Mobile SDK UI.
	 * @memberOf MASPluginMAS
	 * @function useNativeMASUI
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     */
    this.useNativeMASUI = function(successHandler, errorHandler) {
        Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "useNativeMASUI", []);
    };

    /**
     * Enables Browser-based authentication i.e. instead of the default login UI, it would redirect to the browser-based UI that is developed and stored on MAG server.
	 * @memberOf MASPluginMAS
	 * @function enableBrowserBasedAuthentication
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     */
    this.enableBrowserBasedAuthentication = function(successHandler, errorHandler) {
        Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "enableBrowserBasedAuthentication");
    };



    /**
     * Sets the name of the mobile configuration file.  This gives the ability to set the file's name to a custom value.
	 * @memberOf MASPluginMAS
	 * @function configFileName
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     * @param {string} fileName. Must be a JSON file similar to the msso_config.json file.
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
     * Sets the OAuth grant type property. This should be set before MAS start is called
	 * @memberOf MASPluginMAS
	 * @function grantFlow
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     * @param {MASPluginConstants.MASGrantFlow} MASGrantFlow The desired OAuth Flow to be set for this session.
     */
    this.grantFlow = function(successHandler, errorHandler, MASGrantFlow) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "setGrantFlow", [MASGrantFlow]);
    };


    ///------------------------------------------------------------------------------------------------------------------
    /// @name Authentication callbacks
    ///------------------------------------------------------------------------------------------------------------------

    /**
     * Completes the current user's authentication session validation. Similar to the loginWithUsernameAndPassword API but used in case when login is pending due to a previous request in queue.
	 * @memberOf MASPluginMAS
	 * @function completeAuthentication
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     * @param {string} username username of the user.
     * @param {string} password password of the user.
    */
    this.completeAuthentication = function(successHandler, errorHandler, username, password) {
        return Cordova.exec(
            function() {
                successHandler(true);
            },errorHandler,"MASPluginMAS", "completeAuthentication", [username, password]);
    };

    /**
     * The API to perform social login. Based on the provider being selected, it redirects to the login provider's oauth flow and performs Authorization and Authentication for the user.
	 * @memberOf MASPluginMAS
	 * @function doSocialLogin
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     * @param {string} provider An identifier of the social login provider that is defined on MAG server. Values : `google`, `facebook` etc.
     */

    this.doSocialLogin = function(successHandler, errorHandler, provider) {
        return Cordova.exec(
            function() {
                successHandler(true);
            },errorHandler, "MASPluginMAS", "doSocialLogin", [provider]);
    }


    /**
     * Cancels the current user's authentication session process. Generally called when Cancel button is clicked on Authentication UI.
	 * @memberOf MASPluginMAS
	 * @function cancelAuthentication
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     */
    this.cancelAuthentication = function(successHandler, errorHandler) {
		return Cordova.exec(
            function(result) {
                MASPluginUtils.closePopup();
                successHandler(result);
            },errorHandler, "MASPluginMAS", "cancelAuthentication", [MASPluginConstants.MASLoginAuthRequestId]);
    };

    /**
     * Requests server to generate and send OTP to the channels provided.
	 * @memberOf MASPluginMAS
	 * @function generateAndSendOTP
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     * @param {string[]} channels user defined variable that is an array of channels where the OTP is to be delivered. For example, ['sms','email']
     */
    this.generateAndSendOTP = function(successHandler, errorHandler, channels) {
        return Cordova.exec(
            function(shouldValidateOTP) {
                if ("true" == shouldValidateOTP) {
                    MASPluginUtils.setPopUpStyle(MASPluginConstants.MASPopupStyle.MASPopupOTPStyle);
                    MASPluginUtils.MASPopupUI(
                        MASPluginConstants.MASOTPPage,null,
                        function() {
                            MASPluginUtils.closePopup();
                        },
                        function() {}
                    );
                }
            },errorHandler, "MASPluginMAS", "generateAndSendOTP", [channels]);
    };


    /**
     * Cancels the current session of OTP Generation process. To be called in scenario when Cancel button is clicked on the OTP Channel Selection screen.
	 * @memberOf MASPluginMAS
	 * @function cancelGenerateAndSendOTP
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     */
    this.cancelGenerateAndSendOTP = function(successHandler, errorHandler) {
        return Cordova.exec(
            function(result){
                MASPluginUtils.closePopup();
                successHandler(result)
            },errorHandler, "MASPluginMAS", "cancelGenerateAndSendOTP", []);
    };


    /**
     * Validates the OTP i.e. User needs to validate the OTP via MAG server using this API.
	 * @memberOf MASPluginMAS
	 * @function validateOTP
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     * @param {string} otp one-time password that the user receives for validation.
     */
    this.validateOTP = function(successHandler, errorHandler, otp) {
        return Cordova.exec(
            function(result){
                MASPluginUtils.closePopup();
                successHandler(result)
            },errorHandler, "MASPluginMAS", "validateOTP", [otp]);
    };


    /**
     * Cancels the current OTP validation process of the user. To be called in scenario when Cancel button is clicked on the OTP validation screen.
	 * @memberOf MASPluginMAS
	 * @function cancelOTPValidation
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     */
    this.cancelOTPValidation = function(successHandler, errorHandler) {
        return Cordova.exec(
            function(result){
                MASPluginUtils.closePopup();
                successHandler(result)
            },errorHandler, "MASPluginMAS", "cancelOTPValidation", []);
    };

    /**
     * Starts the lifecycle of the MAS processes i.e. Configuration loading, Listeners loading etc.
	 * @memberOf MASPluginMAS
	 * @function start
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     */
    this.start = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "start", []);
    };

    /**
     * Starts the lifecycle of the MAS processes. This will load the default JSON configuration rather than from the storage.If the SDK is already initialized, this method stops and restarts the SDK.
	 * The default JSON configuration file should be msso_config.json. This will ignore the JSON configuration in the keychain storage and replace it with the default configuration.
	 * @memberOf MASPluginMAS
	 * @function startWithDefaultConfiguration
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     * @param {boolean} defaultConfiguration The behaviour of SDK start would be
	 * <table>
	 * <tr bgcolor="#D3D3D3"><th>Value</th><th>Description</th>
	 * <tr><td>true</td><td>The SDK load the default JSON configuration from msso_config.json packed in the app</td>
	 * <tr><td>false</td><td>The SDK load the stored JSON configuration from local device storage from last run</td></tr>
	 * </table>
     */
    this.startWithDefaultConfiguration = function(successHandler, errorHandler, defaultConfiguration) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "startWithDefaultConfiguration", [defaultConfiguration]);
    };

    /**
     * Starts the lifecycle of the MAS processes with a specified JSON.
	 * @memberOf MASPluginMAS
	 * @function startWithJSON
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     * @param {Object} jsonObject The JSON object similar to msso_config.json content to be used to initialize the MAS SDK.
     */
    this.startWithJSON = function(successHandler, errorHandler, jsonObject) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "startWithJSON", [jsonObject]);
    };

    /**
     * Starts the lifecycle of the MAS processes with given JSON configuration file path or URL.
	 * @memberOf MASPluginMAS
	 * @function startWithURL
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     * @param {string} url URL of the JSON configuration file path
     */
    this.startWithURL = function(successHandler, errorHandler, url) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "startWithURL", [url]);
    };

    /**
     * Enable PKCE extension to OAuth.
	 * @memberOf MASPluginMAS
	 * @function enablePKCE
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     * @param {boolean} enable The behaviour of this flag would be
	 * <table>
	 * <tr bgcolor="#D3D3D3"><th>Value</th><th>Description</th>
	 * <tr><td>true</td><td>Enable PKCE extension i.e. while authorizing enable PKCE based validation</td>
	 * <tr><td>false</td><td>Disable PKCE extension</td></tr>
	 * </table>
     */
    this.enablePKCE = function(successHandler, errorHandler, enable) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "enablePKCE", [enable]);
    };

    /**
     * Determines whether PKCE extension is enabled.
	 * @memberOf MASPluginMAS
	 * @function isPKCEEnabled
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     */
    this.isPKCEEnabled = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "isPKCEEnabled", []);
    };

    /**
     * Enable SSL Pinning.
	 * @memberOf MASPluginMAS
	 * @function enableSSLPinning
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     * @param {boolean} enable The behaviour of this flag would be
	 * <table>
	 * <tr bgcolor="#D3D3D3"><th>Value</th><th>Description</th>
	 * <tr><td>true</td><td>Enable SSL Pinning i.e. Evaluate Server Trust with pinned Server Certificates.</td>
	 * <tr><td>false</td><td>Disable SSL Pinning</td></tr>
	 * </table>
     */
    this.enableSSLPinning = function(successHandler, errorHandler, enable) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "enableSSLPinning", [enable]);
    };

    /**
     * Determines whether SSL Pinning is enabled.
	 * @memberOf MASPluginMAS
	 * @function isSSLPinningEnabled
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     */
    this.isSSLPinningEnabled = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "isSSLPinningEnabled", []);
    };

     /**
     * Enable JWKS preloading.
     * @memberOf MASPluginMAS
	 * @function enableJwksPreload
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     * @param {boolean} enable True to enable JWKS preloading. False to disable JWKS preloading. Default value is 'false'
     */
    this.enableJwksPreload = function(successHandler, errorHandler, enable) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "enableJwksPreload", [enable]);
    };

    /**
     * Determines whether preloading of JWKS is enabled.
     * @memberOf MASPluginMAS
	 * @function isJwksPreloadEnabled
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     */
    this.isJwksPreloadEnabled = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "isJwksPreloadEnabled", []);
    };

    /**
     * Stops the lifecycle of all MAS processes.
	 * @memberOf MASPluginMAS
	 * @function stop
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     */
    this.stop = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "stop", []);
    };

    /**
     * Checks whether the Gateway is reachable or not.
	 * @memberOf MASPluginMAS
	 * @function gatewayIsReachable
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     */
    this.gatewayIsReachable = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "gatewayIsReachable", []);
    };

	/**
     * Sets the Security Configurations for External Servers. Invoke this API before making calls to external server.
	 * @memberOf MASPluginMAS
	 * @function setSecurityConfiguration
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     * @param {Object} masSecurityConfiguration A JSON representing the MASSecurityConfiguration struct.
	 * @example
	 * <caption>Populates and set the MASSecurityConfiguration object to the MAS Lifecycle</caption>
	 * var MAS = new MASPlugin.MAS();
	 * var config = new MASPlugin.MASSecurityConfiguration();
	 * var publicKeyHash = publicKeyHash; 
	 * config.setHost("mygw.ca.com");
	 * config.setPublic("true");
     * config.setAllowSSLPinning("false");
	 * config.addPublicKeyHash("jjHshjkslsk....sjsjjsjs");//server’s public key hash
	 * MAS.setSecurityConfiguration(successHandler, errorHandler, config.getSecurityConfiguration());
     */
	this.setSecurityConfiguration = function(successHandler,errorHandler,masSecurityConfiguration){
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "setSecurityConfiguration", [masSecurityConfiguration]);
    }

    /**
     * Invokes an API on the Gateway using the HTTP GET method.
	 * @memberOf MASPluginMAS
	 * @function getFromPath
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     * @param {string} path The API path which the user wants to access. For example, /protected/endpoint/score
     * @param {Object} parametersInfo Query Parameters that is passed along with the request. <table><tr><th>Example</th></tr><tr><td>{<br>&nbsp;&nbsp;"x-otp":"2345",<br>&nbsp;&nbsp;"empName":"Jon"<br>}</td></tr></table>
     * @param {Object} headersInfo The HTTP Headers that is passed along with the request.<table><tr><th>Example</th></tr><tr><td>{<br>&nbsp;&nbsp;"Content-Type":"application/xml",<br>&nbsp;&nbsp;"reload-cache":"true"<br>}</td></tr></table>
     * @param {MASPluginConstants.MASRequestResponseType} requestType specifies the request type of the request.<br>
     * @param {MASPluginConstants.MASRequestResponseType} responseType specifies the response type of the request
     * @param {boolean} isPublic specifies if the API being called is public or not
     */
    this.getFromPath = function(successHandler, errorHandler, path, parametersInfo, headersInfo, requestType, responseType, isPublic) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "getFromPath", [path, parametersInfo, headersInfo, requestType, responseType, isPublic]);
    };


    /**
     * Invokes an API on the Gateway using the HTTP DELETE method.
	 * @memberOf MASPluginMAS
	 * @function deleteFromPath
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     * @param {string} path The API path which the user wants to access. For example, /protected/endpoint/score
     * @param {Object} parametersInfo Query Parameters to be passed along with the request. <table><tr><th>Example</th></tr><tr><td>{<br>&nbsp;&nbsp;"x-otp":"2345",<br>&nbsp;&nbsp;"empName":"Jon"<br>}</td></tr></table>
     * @param {Object} headersInfo The HTTP Headers to be passed along with the request.<table><tr><th>Example</th></tr><tr><td>{<br>&nbsp;&nbsp;"Content-Type":"application/xml",<br>&nbsp;&nbsp;"reload-cache":"true"<br>}</td></tr></table>
     * @param {MASPluginConstants.MASRequestResponseType} requestType specifies the request type of the request.<br>
     * @param {MASPluginConstants.MASRequestResponseType} responseType specifies the response type of the request
     * @param {boolean} isPublic specifies if the API being called is public or not
     */
    this.deleteFromPath = function(successHandler, errorHandler, path, parametersInfo, headersInfo, requestType, responseType, isPublic) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "deleteFromPath", [path, parametersInfo, headersInfo, requestType, responseType, isPublic]);
    };


    /**
     * Invokes an API on the Gateway using the HTTP PUT method.
	 * @memberOf MASPluginMAS
	 * @function putToPath
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     * @param {string} path The API path which the user wants to access. For example, /protected/endpoint/score
     * @param {Object} parametersInfo Query Parameters to be passed along with the request. <table><tr><th>Example</th></tr><tr><td>{<br>&nbsp;&nbsp;"x-otp":"2345",<br>&nbsp;&nbsp;"empName":"Jon"<br>}</td></tr></table>
     * @param {Object} headersInfo The HTTP Headers to be passed along with the request.<table><tr><th>Example</th></tr><tr><td>{<br>&nbsp;&nbsp;"Content-Type":"application/xml",<br>&nbsp;&nbsp;"reload-cache":"true"<br>}</td></tr></table>
     * @param {MASPluginConstants.MASRequestResponseType} requestType specifies the request type of the request.<br>
     * @param {MASPluginConstants.MASRequestResponseType} responseType specifies the response type of the request
     * @param {boolean} isPublic specifies if the API being called is public or not
     */
    this.putToPath = function(successHandler, errorHandler, path, parametersInfo, headersInfo, requestType, responseType, isPublic) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "putToPath", [path, parametersInfo, headersInfo, requestType, responseType, isPublic]);
    };


    /**
     * postToPath does the HTTP POST call to the Gateway. This expects at least three mandatory parameters as shown in the below example. The requestType and responseType are the optional parameters. If the requestType and responseType is not present, then it is set to the Default Type to JSON.
	 * @memberOf MASPluginMAS
	 * @function postToPath
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     * @param {string} path path to the url. For example, "/protected/resource/*"
     * @param {Object} parametersInfo Query Parameters to be passed along with the request. <table><tr><th>Example</th></tr><tr><td>{<br>&nbsp;&nbsp;"x-otp":"2345",<br>&nbsp;&nbsp;"empName":"Jon"<br>}</td></tr></table>
     * @param {Object} headersInfo The HTTP Headers to be passed along with the request.<table><tr><th>Example</th></tr><tr><td>{<br>&nbsp;&nbsp;"Content-Type":"application/xml",<br>&nbsp;&nbsp;"reload-cache":"true"<br>}</td></tr></table>
     * @param {MASPluginConstants.MASRequestResponseType} requestType specifies the request type of the request.<br>
     * @param {MASPluginConstants.MASRequestResponseType} responseType specifies the response type of the request
     * @param {boolean} isPublic specifies if the API being called is public or not
     */

    this.postToPath = function(successHandler, errorHandler, path, parametersInfo, headersInfo, requestType, responseType, isPublic) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "postToPath", [path, parametersInfo, headersInfo, requestType, responseType, isPublic]);
    };

     /**
     * PostMultiPartForm adds the capability to upload multipart forms over HTTP(s) POST to the backend services via Layer7 Gateway.
     * The requestType and responseType are the optional parameters. If the requestType and responseType is not present,
	 * then it is set to the Default Type to requestType as "multipart/form-data" and responseType as JSON.<br>
	 * `multipartForm` is the mandatory parameter along with `path`
	 * @memberOf MASPluginMAS
	 * @function postMultiPartForm
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     * @param {string} path path to the url. For example, "/protected/resource/*"
     * @param {Object} parametersInfo Query Parameters to be passed along with the request. <table><tr><th>Example</th></tr><tr><td>{<br>&nbsp;&nbsp;"x-otp":"2345",<br>&nbsp;&nbsp;"empName":"Jon"<br>}</td></tr></table>
     * @param {Object} headersInfo The HTTP Headers to be passed along with the request.<table><tr><th>Example</th></tr><tr><td>{<br>&nbsp;&nbsp;"Content-Type":"application/xml",<br>&nbsp;&nbsp;"reload-cache":"true"<br>}</td></tr></table>
     * @param {MASPluginConstants.MASRequestResponseType} requestType specifies the request type of the request.<br>
     * @param {MASPluginConstants.MASRequestResponseType} responseType specifies the response type of the request
     * @param {boolean} isPublic specifies if the API being called is public or not
     * @param {MASPluginMultipartForm} multipartForm Representation of a multipart form. For usage see {MASPluginMultipartForm}
     * @param {function} progressListener A function to listen to form upload progress.
	 * @example
	 * <caption>The progressListener struct should have the below facade.</caption>
	function(progress){// This function will be invoked with the progress percent of the data uploaded.
       if(progress == -1){
           // Close the progress bar
       }
       if(progress > 0){
           Update the HTML/jQuery progress bar with the progress percent
       }
    });
     */

    this.postMultiPartForm = function(successHandler, errorHandler, path, parametersInfo, headersInfo, requestType, responseType, isPublic,multipartForm,progressListener) {
        let modifiedSuccessCallback = function(result){
            if(typeof result.iAmProgress != 'undefined'){
                if(result.state != 'undefined' && result.state == 0){
                    progressListener(result.progress);
                }else if(result.state != 'undefined' && result.state == 1){
                    progressListener(-1);
                }
            }else{
                successHandler(result);
            }
        };
        let modifiedErrorCallback = function(error){
            if(typeof error.iAmProgress !== 'undefined'){
                progressListener(-1);
            }else{
                errorHandler(error);
            }
        };

        return Cordova.exec(modifiedSuccessCallback, modifiedErrorCallback, "MASPluginMAS", "postMultiPartForm", [path, parametersInfo, headersInfo, requestType, responseType, isPublic,multipartForm]);
    };



    /**
     * Returns current value of the {@link MASPluginConstants.MASState}.  The value can be used to determine the current state of the SDK.
	 * @memberOf MASPluginMAS
	 * @function getMASState
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     */
    this.getMASState = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "getMASState", []);
    };

    /**
     * This method is used to authorize the application and user via QRCode session transfer. The user scans and fetches the auth_code from a QRCode
	 * on another device/application and uses this API to send the code to MAG server to authorize the session on another device.
	 * @memberOf MASPluginMAS
	 * @function authorize
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     * @param {string} code The code extracted by the QRCode scanner
     */
    this.authorize = function(successHandler, errorHandler, code) {
        Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "authorizeQRCode", [code]);
    };

    /**
     * Signs MASClaims object with the default private key.
	 * @memberOf MASPluginMAS
	 * @function signWithClaims
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     * @param {Object} claims claims in the form JSON object
     */
    this.signWithClaims = function(successHandler, errorHandler, claims) {
        Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "signWithClaims", [claims]);
    };

    /**
     * Signs MASClaims object with a custom private key.
	 * @memberOf MASPluginMAS
	 * @function signWithClaimsPrivateKey
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     * @param {Object} claims claims in the form JSON object
     * @param {string} privateKey private key as a base64 encoded string
     */
    this.signWithClaimsPrivateKey = function(successHandler, errorHandler, claims, privateKey) {
        Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "signWithClaims", [claims, privateKey]);
    };

    /**
     * Sets boolean indicator of enforcing id_token validation upon device registration/user authentication.
     * id_token is being validated as part of authentication/registration process against known signing algorithm.<br>
     * Mobile SDK currently supports following algorithm(s): - HS256<br>
     *
     * Any other signing algorithm will cause authentication/registration failure due to unknown signing algorithm.<br>
     * If the server side is configured to return a different or custom algorithm, ensure to disable id_token validation to avoid any failure on Mobile SDK.<br>
     *
     * By default, id_token validation is enabled and enforced in authentication and/or registration process; it can be opted-out.
	 * @memberOf MASPluginMAS
	 * @function enableIdTokenValidation
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     * @param {boolean} enableValidation BOOLEAN value that indicates whether id_token validation is enabled or not.
     */
    this.enableIdTokenValidation = function(successHandler,errorHandler,enableValidation){
        Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "enableIdTokenValidation", [enableValidation]);
    };

    /**
     * Gets boolean indicator of enforcing id_token validation upon device registration/user authentication.
     * id_token is being validated as part of authentication/registration process against known signing algorithm.<br>
     * Mobile SDK currently supports the <b>HS256</b> algorithm<br>
	 * 
     * Any other signing algorithm will cause authentication/registration failure due to unknown signing algorithm.<br>
     * If the server side is configured to return a different or custom algorithm, ensure to disable id_token validation to avoid any failure on Mobile SDK.<br>
     * By default, id_token validation is enabled and enforced in authentication and/or registration process; it can be opted-out.
	 * @memberOf MASPluginMAS
	 * @function isIdTokenValidationEnabled
	 * @instance
     * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
     * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
     */
    this.isIdTokenValidationEnabled = function(successHandler,errorHandler){
        return Cordova.exec(successHandler, errorHandler, "MASPluginMAS", "isIdTokenValidationEnabled",[]);
    };
};

module.exports = MASPluginMAS;