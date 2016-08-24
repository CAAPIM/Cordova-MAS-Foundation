    //
    //  MASPlugin.js
    //
    //  Copyright (c) 2016 CA, Inc.
    //
    //  This software may be modified and distributed under the terms
    //  of the MIT license. See the LICENSE file for details.
    //



    var MASPlugin = {

        MASAuthenticationStatus: {
            MASAuthenticationStatusNotLoggedIn: -1,
            MASAuthenticationStatusLoginWithUser: 0,
            MASAuthenticationStatusLoginAnonymously: 1
        },

        MASGrantFlow: {
            MASGrantFlowUnknown: -1,
            MASGrantFlowClientCredentials: 0,
            MASGrantFlowPassword: 1,
            MASGrantFlowCount: 2
        },

        MASRequestResponseType: {
            /**
             * Unknown encoding type.
             */
            MASRequestResponseTypeUnknown: -1,

            /**
             * Standard JSON encoding.
             */
            MASRequestResponseTypeJson: 0,

            /**
             * SCIM-specific JSON variant encoding.
             */
            MASRequestResponseTypeScimJson: 1,

            /**
             * Plain Text.
             */
            MASRequestResponseTypeTextPlain: 2,

            /**
             * Standard WWW Form URL encoding.
             */
            MASRequestResponseTypeWwwFormUrlEncoded: 3,

            /**
             * Standard XML encoding.
             */
            MASRequestResponseTypeXml: 4,

            /**
             * The total number of supported types.
             */
            MASRequestResponseTypeCount: 5
        },

        /**
         MAS which has the interfaces mapped to the native MAS class.
         */
        MAS: function() {

            /**
            Initializes the MAS plugin. This includes setting of the various listeners required for authenticating the user while registeration of the application with the Gateway and accessing various protected api.
            */
            this.initialize = function(successHandler, errorHandler) {

                Cordova.exec(MASPlugin.MASConfig.MASAuthenticationCallback, errorHandler, "com.ca.apim.MASPlugin", "setAuthenticationListener", []);

                Cordova.exec(MASPlugin.MASConfig.MASOTPChannelSelectCallback, errorHandler, "com.ca.apim.MASPlugin", "setOTPChannelSelectorListener", []);

                Cordova.exec(MASPlugin.MASConfig.MASOTPAuthenticationCallback, errorHandler, "com.ca.apim.MASPlugin", "setOTPAuthenticationListener", []);

                return successHandler("Initialization success !!");
            };

            /**
             * Set the authentication UI handling page by this plugin.
             *
             * @param customLoginPage user defined page if you want the plugin to use it.
             *     "login.html" is the default page.
             */
            this.setCustomLoginPage = function(successHandler, errorHandler, customPage) {

                if (customPage) {
                    $.ajax({
                        url: customPage,
                        success: function(data) {
                            MASPlugin.MASConfig.loginPage = customPage;
                            return successHandler("Login page set to :" + MASPlugin.MASConfig.loginPage);
                        },
                        error: function(data) {
                            MASPlugin.MASConfig.loginPage = "login.html";
                            return errorHandler({
                                errorMessage: "Can't find " + customPage
                            });
                        },
                    });
                } else {
                    MASPlugin.MASConfig.loginPage = "login.html";
                    return errorHandler({
                        errorMessage: "Can't find " + customPage
                    });
                }
            };

            /**
             * Set the OTP Channels Selection UI handling page by this plugin.
             *
             * @param customPage user defined page if you want the plugin to use it.
             *     "otpchannel.html" is the default page.
             */
            this.setCustomOTPChannelsPage = function(successHandler, errorHandler, customPage) {

                if (customPage) {
                    $.ajax({
                        url: customPage,
                        success: function(data) {
                            MASPlugin.MASConfig.otpChannelsPage = customPage;
                            return successHandler("OTP Channels page set to :" + MASPlugin.MASConfig.otpChannelsPage);
                        },
                        error: function(data) {
                            MASPlugin.MASConfig.otpChannelsPage = "otpchannel.html";
                            return errorHandler({
                                errorMessage: "Can't find " + customPage
                            });
                        },
                    });
                } else {
                    MASPlugin.MASConfig.otpChannelsPage = "otpchannel.html";
                    return errorHandler({
                        errorMessage: "Can't find " + customPage
                    });
                }
            };

            /**
             * Set the OTP UI handling page by this plugin.
             *
             * @param customPage user defined page if you want the plugin to use it.
             *     "otp.html" is the default page.
             */
            this.setCustomOTPPage = function(successHandler, errorHandler, customPage) {

                if (customPage) {
                    $.ajax({
                        url: customPage,
                        success: function(data) {
                            MASPlugin.MASConfig.otpPage = customPage;
                            return successHandler("OTP page set to :" + MASPlugin.MASConfig.otpPage);
                        },
                        error: function(data) {
                            MASPlugin.MASConfig.otpPage = "otp.html";
                            return errorHandler({
                                errorMessage: "Can't find " + customPage
                            });
                        },
                    });
                } else {
                    MASPlugin.MASConfig.otpPage = "otp.html";
                    return errorHandler({
                        errorMessage: "Can't find " + customPage
                    });
                }
            };

            /**
             Sets the device registration type MASDeviceRegistrationType. This should be set before MAS start is executed.
             */
            this.grantFlow = function(successHandler, errorHandler, MASGrantFlow) {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "setGrantFlow", [MASGrantFlow]);
            };

            /**
             Set the name of the configuration file.  This gives the ability to set the file's name to a custom value.
             */
            this.configFileName = function(successHandler, errorHandler, fileName) {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "setConfigFileName", [fileName]);
            };

            /**
             Starts the lifecycle of the MAS processes. This includes the registration of the application to the Gateway, if the network is available.
             */
            this.start = function(successHandler, errorHandler) {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "start", []);
            };

            this.startWithDefaultConfiguration = function(successHandler, errorHandler, defaultConfiguration) {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "startWithDefaultConfiguration", [defaultConfiguration]);
            };

            this.startWithJSON = function(successHandler, errorHandler, jsonObject) {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "startWithJSON", [jsonObject]);
            };

            /**
             Completes the current user's authentication session validation.
            */
            this.completeAuthentication = function(successHandler, errorHandler, username, password) {

                // $.mobile.activePage.find(".messagePopup").popup("close");

                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "completeAuthentication", [username, password]);
            };

            /**
             Cancels the current user's authentication session validation.
             */
            this.cancelAuthentication = function(successHandler, errorHandler, args) {

                $.mobile.activePage.find(".messagePopup").popup("close");

                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "cancelAuthentication", [args]);
            };

            /**
             Cancels the current user's authentication session validation.
             */
            this.generateAndSendOTP = function(successHandler, errorHandler, channels) {

                $.mobile.activePage.find(".messagePopup").popup("close");

                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "generateAndSendOTP", [channels]);
            };

            /**
             Cancels the current user's authentication session validation.
             */
            this.cancelGenerateAndSendOTP = function(successHandler, errorHandler) {

                $.mobile.activePage.find(".messagePopup").popup("close");
                this.initialize(function() {});

                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "cancelGenerateAndSendOTP", []);
            };

            /**
             Completes the current user's authentication session validation.
             */
            this.validateOTP = function(successHandler, errorHandler, otp) {

                $.mobile.activePage.find(".messagePopup").popup("close");

                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "validateOTP", [otp]);
            };

            /**
             Cancels the current user's authentication session validation.
             */
            this.cancelOTPValidation = function(successHandler, errorHandler) {

                $.mobile.activePage.find(".messagePopup").popup("close");
                this.initialize(function() {});

                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "cancelOTPValidation", []);
            };

            /**
             getFromPath does the HTTP GET call from the gateway. This expects atleast three mandatry parameters as shown in the the below example. The requestType and responseType are the optional parameters. If the requestType and responseType is not present then it is set to the Default Type to JSON.
             */
            this.getFromPath = function(successHandler, errorHandler, path, parametersInfo, headersInfo, requestType, responseType) {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "getFromPath", [path, parametersInfo, headersInfo, requestType, responseType]);
            };

            /**
             deleteFromPath does the HTTP DELTE call from the gateway. This expects atleast three mandatry parameters as shown in the the below example. The requestType and responseType are the optional parameters. If the requestType and responseType is not present then it is set to the Default Type to JSON.
             */
            this.deleteFromPath = function(successHandler, errorHandler, path, parametersInfo, headersInfo, requestType, responseType) {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "deleteFromPath", [path, parametersInfo, headersInfo, requestType, responseType]);
            };

            /**
             putToPath does the HTTP PUT call from the gateway. This expects atleast three mandatry parameters as shown in the the below example. The requestType and responseType are the optional parameters. If the requestType and responseType is not present then it is set to the Default Type to JSON.
             */
            this.putToPath = function(successHandler, errorHandler, path, parametersInfo, headersInfo, requestType, responseType) {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "putToPath", [path, parametersInfo, headersInfo, requestType, responseType]);
            };

            /**
             postToPath does the HTTP POST call from the gateway. This expects atleast three mandatry parameters as shown in the the below example. The requestType and responseType are the optional parameters. If the requestType and responseType is not present then it is set to the Default Type to JSON.
             */
            this.postToPath = function(successHandler, errorHandler, path, parametersInfo, headersInfo, requestType, responseType) {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "postToPath", [path, parametersInfo, headersInfo, requestType, responseType]);
            };

            /**
             Stops the lifecycle of all MAS processes.
             */
            this.stop = function(successHandler, errorHandler) {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "stop", []);
            };
        },

        /**
         MASUser which has the interfaces mapped to the native MASUser class.
         */
        MASUser: function() {

            /**
             Authenticates the user using the username and password.
             */
            this.loginWithUsernameAndPassword = function(successHandler, errorHandler, username, password) {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "loginWithUsernameAndPassword", [username, password]);
            };

            /**
             log off user.
             */
            this.logoutUser = function(successHandler, errorHandler) {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "logoutUser", []);
            };

            this.isAuthenticated = function(successHandler, errorHandler) {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "isAuthenticated", []);
            };
        },

        /**
         MASDevice which has the interfaces mapped to the native MASDevice class.
         */
        MASDevice: function() {

            /**
             Deregister the application resources on this device.
             */
            this.deregister = function(successHandler, errorHandler) {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "deregister", []);
            };

            this.resetLocally = function(successHandler, errorHandler) {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "resetLocally", []);
            };

            this.isDeviceRegistered = function(successHandler, errorHandler) {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "isDeviceRegistered", []);
            };
        },

        MASConfig:{

         loginPage: "login.html",
         otpPage : "otp.html",
         otpChannelsPage : "otpchannel.html",
         loginAuthRequestId : "",
         MASPopupUI : function(url, popupafterclose, onload) {

                 var template = "<div id='loginDiv' data-role='popup' class='ui-content messagePopup' style='position: fixed; top: 50%; left:50%; transform: translate(-50%, -50%)'>" +
                     "<a href='#' data-role='button' data-theme='g' data-icon='delete' data-iconpos='notext' " +
                     " class='ui-btn-right closePopup'>Close</a> </div>";

                 popupafterclose = popupafterclose ? popupafterclose : function() {};

                 $.mobile.activePage.append(template).trigger("create");

                 $('#loginDiv').load(url, onload);

                 $.mobile.activePage.find(".closePopup").bind("tap", function(e) {
                     $.mobile.activePage.find(".messagePopup").popup("close");
                 });

                 $.mobile.activePage.find(".messagePopup").popup().popup("open").bind({
                     popupafterclose: function() {
                         $('body').off('touchmove');
                         $(this).unbind("popupafterclose").remove();
                         popupafterclose();
                     }
                 });

                 $(".messagePopup").on({
                     popupbeforeposition: function() {
                         $('.ui-popup-screen').off();
                         $('body').on('touchmove', false);
                     }
                 });
         },
         MASAuthenticationCallback : function(result) {
                 var pageToLoad = MASPlugin.MASConfig.loginPage;
                 // invalidOtpFlag=false;
                 if (result != null && result != undefined && result.requestId != null && result.requestId != "" && result.requestType === "Login") {
                     MASPlugin.MASConfig.loginAuthRequestId = result.requestId;
                 }

                 if (result != null && result != undefined && result.requestType != null && result.requestType != "" && result.requestType === "OTP") {
                     if (result.isInvalidOtp != undefined && result.isInvalidOtp != null && result.isInvalidOtp != "" && result.isInvalidOtp == "true") {
                         MASPlugin.MASConfig.MASOTPAuthenticationCallback(result);
                     } else {
                         if (result.channels == null) {
                             console.log("Channel list is empty");
                             return;
                         }
                         var channelsCSV = result.channels;
                         var channels = result.channels.split(',');
                         MASPlugin.MASConfig.MASOTPChannelSelectCallback(channels);
                     }
                 } else {
                     MASPlugin.MASConfig.MASPopupUI(pageToLoad, function() {
                         var MAS = new MASPlugin.MAS();
                         MAS.initialize(function() {});
                         $('#loginDiv').remove();
                     }, function() {});
                 }

         },
         MASSendCredentials : function(username, password) {

                  if (document.getElementById("errorMesg"))
                      document.getElementById("errorMesg").innerHTML = "";
                 var errorMsgToDisplay = "";

                 var MAS = new MASPlugin.MAS();
                 MAS.completeAuthentication(function() {
                     $.mobile.activePage.find(".messagePopup").popup("close");
                 }, function(error) {
                     if (error != null && error != undefined && error != "") {
                         if (error.errorCode != undefined && error.errorCode != null && !isNaN(error.errorCode)) {
                             var errorCodeLastDigits = error.errorCode % 1000;
                             var returnedError = "";
                             try {
                                 if (error.errorMessage != null && error.errorMessage != undefined && error.errorMessage != "") {
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
                             } else {
                                 $.mobile.activePage.find(".messagePopup").popup("close");
                             }
                         }
                     } else {
                         $.mobile.activePage.find(".messagePopup").popup("close");
                     }

                 }, username, password);
         },
         MASCancelLogin : function() {

                 var MAS = new MASPlugin.MAS();
                 MAS.cancelAuthentication(function() {
                     $.mobile.activePage.find(".messagePopup").popup("close");
                 }, function(error) {}, MASPlugin.MASConfig.loginAuthRequestId);
         },
         MASOTPChannelSelectCallback : function(otpChannels) {

                 MASPlugin.MASConfig.MASPopupUI(MASPlugin.MASConfig.otpChannelsPage, function() {

                     $('#loginDiv').remove();
                 }, function() {

                     if (otpChannels.length > 1)
                         for (i = 0; i < otpChannels.length; i++) {
                             if (document.getElementById(otpChannels[i]))
                                 document.getElementById(otpChannels[i]).style.display = 'block';
                         }
                 });
         },

         MASSendOTPChannels : function(otpChannels) {
                 var MAS = new MASPlugin.MAS();
                 MAS.generateAndSendOTP(
                     function(shouldValidateOTP) {
                         if ("true" == shouldValidateOTP) {
                             MASPlugin.MASConfig.MASPopupUI(MASPlugin.MASConfig.otpPage, function() {
                                 $('#loginDiv').remove();
                             }, function() {});
                         }
                     },
                     function(val) {}, otpChannels);
         },

         MASOTPAuthenticationCallback : function(error) {
                 MASPlugin.MASConfig.MASPopupUI(MASPlugin.MASConfig.otpPage, function() {
                     $('#loginDiv').remove();
                 }, function() {
                     document.getElementById("CA-Title").innerHTML = error.errorMessage;
                 });
         },

         MASSendOTPCredentials : function(otp) {

                 var MAS = new MASPlugin.MAS();
                 MAS.initialize(function() {});
                 MAS.validateOTP(function() {}, function() {}, otp);
         },
         MASSetOtpValidationPage  : function (pageName) {
             MASPlugin.MASConfig.otpPage = pageName;
         },
         MASSetOtpChannelsPage : function (pageName) {
            MASPlugin.MASConfig.otpChannelsPage = pageName;
         },
         MASSetLoginPage  : function (pageName) {
            MASPlugin.MASConfig.loginPage = pageName;
         }

        }

    };
    module.exports = MASPlugin;
