    //
    //  MASPlugin.js
    //
    //  Copyright (c) 2016 CA, Inc.
    //
    //  This software may be modified and distributed under the terms
    //  of the MIT license. See the LICENSE file for details.
    //
    var MASPlugin = {
        MASAuthenticationStatus:
        {
            MASAuthenticationStatusNotLoggedIn: -1,
            MASAuthenticationStatusLoginWithUser: 0,
            MASAuthenticationStatusLoginAnonymously: 1
        },
        MASGrantFlow:
        {
            MASGrantFlowUnknown: -1,
            MASGrantFlowClientCredentials: 0,
            MASGrantFlowPassword: 1,
            MASGrantFlowCount: 2
        },
        MASRequestResponseType:
        {
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
        MAS: function()
        {
            /**
            Initializes the MAS plugin. This includes setting of the various listeners required
            for authenticating the user while registration of the application with the Gateway
            and accessing various protected api. Any further initialization related setting will go here.
            */
            this.initialize = function(successHandler, errorHandler)
            {
                Cordova.exec(MASPlugin.MASConfig.MASAuthenticationCallback, errorHandler, "com.ca.apim.MASPlugin", "setAuthenticationListener", []);
                Cordova.exec(MASPlugin.MASConfig.MASOTPChannelSelectCallback, errorHandler, "com.ca.apim.MASPlugin", "setOTPChannelSelectorListener", []);
                Cordova.exec(MASPlugin.MASConfig.MASOTPAuthenticationCallback, errorHandler, "com.ca.apim.MASPlugin", "setOTPAuthenticationListener", []);
                return successHandler("Initialization success !!");
            };
            /**
             * Set the authentication UI handling page by this plugin.
             *
             * @param successHandler user defined success callback
             * @param errorHandler user defined error callback
             * @param customPage user defined page if you want the plugin to use it.
             *     "mas-login.html" is the default page.
             */
            this.setCustomLoginPage = function(successHandler, errorHandler, customPage)
            {
                if (customPage)
                {
                    $.ajax(
                    {
                        url: customPage,
                        success: function(data)
                        {
                            MASPlugin.MASConfig.loginPage = customPage;
                            return successHandler("Login page set to :" + MASPlugin.MASConfig.loginPage);
                        },
                        error: function(data)
                        {
                            MASPlugin.MASConfig.loginPage = "masui/mas-login.html";
                            return errorHandler(
                            {
                                errorMessage: "Can't find " + customPage
                            });
                        },
                    });
                }
                else
                {
                    MASPlugin.MASConfig.loginPage = "masui/mas-login.html";
                    return errorHandler(
                    {
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
            this.setCustomOTPChannelsPage = function(successHandler, errorHandler, customPage)
            {
                if (customPage)
                {
                    $.ajax(
                    {
                        url: customPage,
                        success: function(data)
                        {
                            MASPlugin.MASConfig.otpChannelsPage = customPage;
                            return successHandler("OTP Channels page set to :" + MASPlugin.MASConfig.otpChannelsPage);
                        },
                        error: function(data)
                        {
                            MASPlugin.MASConfig.otpChannelsPage = "mas-otpchannel.html";
                            return errorHandler(
                            {
                                errorMessage: "Can't find " + customPage
                            });
                        },
                    });
                }
                else
                {
                    MASPlugin.MASConfig.otpChannelsPage = "mas-otpchannel.html";
                    return errorHandler(
                    {
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
            this.setCustomOTPPage = function(successHandler, errorHandler, customPage)
            {
                if (customPage)
                {
                    $.ajax(
                    {
                        url: customPage,
                        success: function(data)
                        {
                            MASPlugin.MASConfig.otpPage = customPage;
                            return successHandler("OTP page set to :" + MASPlugin.MASConfig.otpPage);
                        },
                        error: function(data)
                        {
                            MASPlugin.MASConfig.otpPage = "mas-otp.html";
                            return errorHandler(
                            {
                                errorMessage: "Can't find " + customPage
                            });
                        },
                    });
                }
                else
                {
                    MASPlugin.MASConfig.otpPage = "mas-otp.html";
                    return errorHandler(
                    {
                        errorMessage: "Can't find " + customPage
                    });
                }
            };
            /**
             Sets the device registration type MASDeviceRegistrationType. This should be set before MAS start is executed.
             */
            this.grantFlow = function(successHandler, errorHandler, MASGrantFlow)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "setGrantFlow", [MASGrantFlow]);
            };
            /**
             Set the name of the configuration file.  This gives the ability to set the file's name to a custom value.
             */
            this.configFileName = function(successHandler, errorHandler, fileName)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "setConfigFileName", [fileName]);
            };
            /**
             Starts the lifecycle of the MAS processes. This includes the registration of the application to the Gateway, if the network is available.
             */
            this.start = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "start", []);
            };
            this.startWithDefaultConfiguration = function(successHandler, errorHandler, defaultConfiguration)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "startWithDefaultConfiguration", [defaultConfiguration]);
            };
            this.startWithJSON = function(successHandler, errorHandler, jsonObject)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "startWithJSON", [jsonObject]);
            };
            /**
             Completes the current user's authentication session validation.
             * @param successHandler user defined success callback
             * @param errorHandler user defined error callback
             * @param username user defined username
             * @param password user defined password
            */
            this.completeAuthentication = function(successHandler, errorHandler, username, password)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "completeAuthentication", [username, password]);
            };
            /**
             Cancels the current user's authentication session validation.
             * @param successHandler user defined success callback
             * @param errorHandler user defined error callback
             * @param args user defined variable which is request Id in Android. It is not used in iOS
             */
            this.cancelAuthentication = function(successHandler, errorHandler, args)
            {
                $.mobile.activePage.find(".messagePopup").popup("close");
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "cancelAuthentication", [args]);
            };
            /**
             Request Server to generate and send OTP to the channels provided.
             * @param successHandler user defined success callback
             * @param errorHandler user defined error callback
             * @channels user defined variable which is an array of channels where the OTP is to be delivered.
             */
            this.generateAndSendOTP = function(successHandler, errorHandler, channels)
            {
                $.mobile.activePage.find(".messagePopup").popup("close");
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "generateAndSendOTP", [channels]);
            };
            /**
             Cancels the current user's generating and sending OTP call.
             * @param successHandler user defined success callback
             * @param errorHandler user defined error callback
             */
            this.cancelGenerateAndSendOTP = function(successHandler, errorHandler)
            {
                $.mobile.activePage.find(".messagePopup").popup("close");
                this.initialize(function() {});
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "cancelGenerateAndSendOTP", []);
            };
            /**
             Validate the entered OTP.
             * @param successHandler user defined success callback
             * @param errorHandler user defined error callback
             * @param otp user defined one time password that is to be verified
             */
            this.validateOTP = function(successHandler, errorHandler, otp)
            {
                $.mobile.activePage.find(".messagePopup").popup("close");
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "validateOTP", [otp]);
            };
            /**
             Cancels the current user's authentication session validation.
             * @param successHandler user defined success callback
             * @param errorHandler user defined error callback
             */
            this.cancelOTPValidation = function(successHandler, errorHandler)
            {
                $.mobile.activePage.find(".messagePopup").popup("close");
                this.initialize(function() {});
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "cancelOTPValidation", []);
            };
            /**
             getFromPath does the HTTP GET call from the gateway. This expects atleast three mandatry parameters as shown in the the below example. The requestType and responseType are the optional parameters. If the requestType and responseType is not present then it is set to the Default Type to JSON.
             */
            this.getFromPath = function(successHandler, errorHandler, path, parametersInfo, headersInfo, requestType, responseType)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "getFromPath", [path, parametersInfo, headersInfo, requestType, responseType]);
            };
            /**
             deleteFromPath does the HTTP DELTE call from the gateway. This expects atleast three mandatry parameters as shown in the the below example. The requestType and responseType are the optional parameters. If the requestType and responseType is not present then it is set to the Default Type to JSON.
             */
            this.deleteFromPath = function(successHandler, errorHandler, path, parametersInfo, headersInfo, requestType, responseType)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "deleteFromPath", [path, parametersInfo, headersInfo, requestType, responseType]);
            };
            /**
             putToPath does the HTTP PUT call from the gateway. This expects atleast three mandatry parameters as shown in the the below example. The requestType and responseType are the optional parameters. If the requestType and responseType is not present then it is set to the Default Type to JSON.
             */
            this.putToPath = function(successHandler, errorHandler, path, parametersInfo, headersInfo, requestType, responseType)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "putToPath", [path, parametersInfo, headersInfo, requestType, responseType]);
            };
            /**
             postToPath does the HTTP POST call from the gateway. This expects atleast three mandatry parameters as shown in the the below example. The requestType and responseType are the optional parameters. If the requestType and responseType is not present then it is set to the Default Type to JSON.
             */
            this.postToPath = function(successHandler, errorHandler, path, parametersInfo, headersInfo, requestType, responseType)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "postToPath", [path, parametersInfo, headersInfo, requestType, responseType]);
            };
            /**
             Stops the lifecycle of all MAS processes.
             */
            this.stop = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "stop", []);
            };

            this.gatewayIsReachable = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "gatewayIsReachable", []);
            }
        },
        /**
         MASUser which has the interfaces mapped to the native MASUser class.
         */
        MASUser: function()
        {
            /**
             Authenticates the user using the username and password.
             */
            this.loginWithUsernameAndPassword = function(successHandler, errorHandler, username, password)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "loginWithUsernameAndPassword", [username, password]);
            };
            /**
            * Performs an implicit login by calling an endpoint that requires authentication.
            */
             this.loginWithImplicitFlow = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "loginWithImplicitFlow", []);
            };
            /**
             log off user.
             */
            this.logoutUser = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "logoutUser", []);
            };
            /**
            *
            */
            this.getCurrentUser = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "getCurrentUser", []);
            };

            this.getName = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "isActive", []);
            }

            this.getUserName = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "getUserName", []);
            }

            this.getAddressList = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "getAddressList", []);
            }

            this.getEmailList = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "getEmailList", []);
            }

            this.isActive = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "isActive", []);
            }

            this.isAuthenticated = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "isAuthenticated", []);
            };

        },
        /**
         MASDevice which has the interfaces mapped to the native MASDevice class.
         */
        MASDevice: function()
        {
            /**
             Deregister the application resources on this device.
             */
            this.getCurrentDevice = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "getCurrentDevice", []);
            }
            this.deregister = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "deregister", []);
            };
            this.resetLocally = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "resetLocally", []);
            };
            this.isDeviceRegistered = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "isDeviceRegistered", []);
            };
            this.getDeviceIdentifier = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "getDeviceIdentifier", []);
            };
        },
        /**
        *  Commented as of now, as these would be required when Enterprise Browser is implemented
        *
        * MASApplication has the interfaces mapped to the native MASApplication class.

        MASApplication: function()
        {
            /**
            * @return The application identifier.

            this.getIdentifier = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "getIdentifier",[]);
            };
            this.getName = function(successHandler, errorHandler,args)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "getName",[args]);
            };
            this.getIconUrl = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "getIconUrl",[]);
            };
            this.getAuthUrl = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "getAuthUrl",[]);
            };
            this.getNativeUri = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "getNativeUri",[]);
            };
            this.getCustom = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "getCustom",[]);
            };
            this.retrieveEnterpriseApps = function(successHandler, errorHandler)
            {
                return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "retrieveEnterpriseApps",[]);
            };
        },
        */

        /**
        MASConfig which is a singleton class used to store the state of the properties required.
        */
        MASConfig:
        {
            loginPage: "masui/mas-login.html",
            otpPage: "masui/mas-otp.html",
            otpChannelsPage: "masui/mas-otpchannel.html",
            loginAuthRequestId: "",
            MASPopupUI: function(url, popupafterclose, onload)
            {
                var template = "<div id='loginDiv' data-role='popup' class='ui-content messagePopup' style='position: fixed; top: 50%; left:50%; transform: translate(-50%, -50%)'>" + "</div>";
                popupafterclose = popupafterclose ? popupafterclose : function() {};
                $.mobile.activePage.append(template).trigger("create");
                $('#loginDiv').load(url, onload);
                $.mobile.activePage.find(".closePopup").bind("tap", function(e)
                {
                    $.mobile.activePage.find(".messagePopup").popup("close");
                });
                $.mobile.activePage.find(".messagePopup").popup().popup("open").bind(
                {
                    popupafterclose: function()
                    {
                        $('body').off('touchmove');
                        $(this).unbind("popupafterclose").remove();
                        popupafterclose();
                    }
                });
                $(".messagePopup").on(
                {
                    popupbeforeposition: function()
                    {
                        $('.ui-popup-screen').off();
                        $('body').on('touchmove', false);
                    }
                });
            },

            /** Callback where it will prompt for login Credentials. It will also prompt for OTP channels in Android flow.
            * @param result user defined variable which has requestId and channels for the OTP in android. It is not used in iOS.
            */            
            MASAuthenticationCallback: function(result)
            {
                var pageToLoad = MASPlugin.MASConfig.loginPage;
                if (result != null && result != undefined && result.requestId != null && result.requestId != "" && result.requestType === "Login")
                {
                    MASPlugin.MASConfig.loginAuthRequestId = result.requestId;
                }
                if (result != null && result != undefined && result.requestType != null && result.requestType != "" && result.requestType === "OTP")
                {
                    if (result.isInvalidOtp != undefined && result.isInvalidOtp != null && result.isInvalidOtp != "" && result.isInvalidOtp == "true")
                    {
                        MASPlugin.MASConfig.MASOTPAuthenticationCallback(result);
                    }
                    else
                    {
                        if (result.channels == null)
                        {
                            console.log("Channel list is empty");
                            return;
                        }
                        var channelsCSV = result.channels;
                        var channels = result.channels.split(',');
                        MASPlugin.MASConfig.MASOTPChannelSelectCallback(channels);
                    }
                }
                else
                {
                    MASPlugin.MASConfig.MASPopupUI(pageToLoad, function()
                    {
                        var MAS = new MASPlugin.MAS();
                        MAS.initialize(function() {});
                        $('#loginDiv').remove();
                    }, function() {});
                }
            },
            /** Used to send the username and password to the server and setting div with id "errorMesg" with error message if error occurs.
            * @param username user defined username
             * @param password user defined password
            */
            MASSendCredentials: function(username, password)
            {
                if (document.getElementById("errorMesg")) document.getElementById("errorMesg").innerHTML = "";
                var errorMsgToDisplay = "";
                var MAS = new MASPlugin.MAS();
                MAS.completeAuthentication(function()
                {
                    $.mobile.activePage.find(".messagePopup").popup("close");
                }, function(error)
                {
                    if (error != null && error != undefined && error != "")
                    {
                        if (error.errorCode != undefined && error.errorCode != null && !isNaN(error.errorCode))
                        {
                            var errorCodeLastDigits = error.errorCode % 1000;
                            var returnedError = "";
                            try
                            {
                                if (error.errorMessage != null && error.errorMessage != undefined && error.errorMessage != "")
                                {
                                    returnedError = JSON.parse(error.errorMessage);
                                }
                            }
                            catch (e)
                            {}
                            if (errorCodeLastDigits === 103)
                            {
                                errorMsgToDisplay = "invalid request: Missing or duplicate parameters";
                                document.getElementById("errorMesg").innerHTML = errorMsgToDisplay;
                            }
                            else if (errorCodeLastDigits === 202)
                            {
                                errorMsgToDisplay = "Username or Password invalid";
                                document.getElementById("errorMesg").innerHTML = errorMsgToDisplay;
                            }
                            else
                            {
                                $.mobile.activePage.find(".messagePopup").popup("close");
                            }
                        }
                    }
                    else
                    {
                        $.mobile.activePage.find(".messagePopup").popup("close");
                    }
                }, username, password);
            },
            /**
            * Cancels the login reqest already made   
            */
            MASCancelLogin: function()
            {
                var MAS = new MASPlugin.MAS();
                MAS.cancelAuthentication(function()
                {
                    $.mobile.activePage.find(".messagePopup").popup("close");
                }, function(error) {}, MASPlugin.MASConfig.loginAuthRequestId);
            },
            /**
            * Callback which is used to prompt for the OTP provided channels
            * @param otpChannels available channels array that will be recieved from server
            * Note: In case of android this function has to be called from Authentication Callback where OTP request with channels will come back.
            */

            MASOTPChannelSelectCallback: function(otpChannels)
            {
                MASPlugin.MASConfig.MASPopupUI(MASPlugin.MASConfig.otpChannelsPage, function()
                {
                    $('#loginDiv').remove();
                }, function()
                {
                    if (otpChannels.length > 1)
                        for (i = 0; i < otpChannels.length; i++)
                        {
                            if (document.getElementById(otpChannels[i])) document.getElementById(otpChannels[i]).style.display = 'block';
                        }
                });
            },
            /**
            * Used to send the OTP channels to the server
            * @param otpChannels user defined channels array that will be passed to server
            */
            MASSendOTPChannels: function(otpChannels)
            {
                var MAS = new MASPlugin.MAS();
                MAS.generateAndSendOTP(function(shouldValidateOTP)
                {
                    if ("true" == shouldValidateOTP)
                    {
                        MASPlugin.MASConfig.MASPopupUI(MASPlugin.MASConfig.otpPage, function()
                        {
                            $('#loginDiv').remove();
                        }, function() {});
                    }
                }, function(val) {}, otpChannels);
            },
             /**
            * Callback for the OTP Listener
            * @param error message that is recieved from server for invalid attempt
            * Note: This has to be called from android if otp is invalid.
            */
            MASOTPAuthenticationCallback: function(error)
            {
                MASPlugin.MASConfig.MASPopupUI(MASPlugin.MASConfig.otpPage, function()
                {
                    $('#loginDiv').remove();
                }, function()
                {
                    document.getElementById("CA-Title").innerHTML = error.errorMessage;
                });
            },
            /**
            * Used to send OTP for validation to the server
            @param otp user defined one time password that is passed to the server
            */
            MASSendOTPCredentials: function(otp)
            {
                var MAS = new MASPlugin.MAS();
                MAS.initialize(function() {});
                MAS.validateOTP(function() {}, function() {}, otp);
            }
        }
    };
    module.exports = MASPlugin;
