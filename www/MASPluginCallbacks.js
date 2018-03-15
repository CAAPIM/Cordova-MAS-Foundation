/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */
 
var MASPluginConstants = require("./MASPluginConstants"),
    MASPluginUtils = require("./MASPluginUtils");
	
var MASPluginCallbacks = {


	/** Callback where it will prompt for login Credentials.
     * @param callbackResp user defined callback object containing the relevant details of callback.
     */
    MASAuthenticationCallback: function(callbackResp) {
        const error = callbackResp.error;
        // TODO : How to handle Error scenarios
        if(!MASPluginUtils.isEmpty(error)){
            console.log("Error in AuthCallback:"+JSON.stringify(error));
            return;
        }

        const result = callbackResp.result;
        const requestType = result.requestType;

        if(requestType === 'Login'){
            if(document.getElementById('popUp') !== null || document.getElementById('popup') !== null){
                return;
            }
            if(result.requestId !== 'undefined' && !MASPluginUtils.isEmpty(result.requestId)){
                MASPluginConstants.MASLoginAuthRequestId = result.requestId;
            }
            let oncloseFunc = function(){
                $('#popUp').remove();
            };

            let onLoadFunc = function(){
                document.getElementById('qr-code').src = "data:image/jpeg;base64, " + result.qrCodeImageBase64;
                const providers = result.providers;
                if(!MASPluginUtils.isEmpty(providers) && providers.length > 0) {
                    for(let i=0; i < providers.length; i++) {
                        let p = providers[i];
                        if(p !== 'qrcode') {
                            if(document.getElementById('i'+p)) {
                                document.getElementById('i'+p).src = "masui/img/"+p+"_enabled.png";
                                document.getElementById('l'+p).className = "enabled";
                                if(p === 'salesforce'){
                                    document.getElementById('i'+p).style.backgroundColor = "#1798c1";
                                }
                            }
                        }
                    }
                }
            };
            MASPluginUtils.MASPopupUI(MASPluginConstants.MASLoginPage,oncloseFunc,onLoadFunc);
        }else if(requestType == "removeQRCode"){
            document.getElementById('qr-code').style.display = 'none';
        }else if(requestType == "qrCodeAuthorizationComplete"){
            $('#popUp').remove();
        }
    },


    /**
     * Callback which is used to prompt for the OTP provided channels
     * @param callbackResp user defined callback object containing the OTP Channels as defined by MAG Server.
     */
    MASOTPChannelSelectCallback: function(callbackResp) {
        const error = callbackResp.error;
        // TODO: How to propogate error to API
        if(!MASPluginUtils.isEmpty(error)){
            console.log("Error in OTPChannelCallback:"+JSON.stringify(error));
            return;
        }
        const otpChannels = callbackResp.result.channels;
        // TODO: If channel list is empty, how to send response to calling API
        let oncloseFunc = function(){
            $('#popUp').remove();
        };
        let onLoadFunc = function() {
            if (otpChannels.length > 1){
                for (i = 0; i < otpChannels.length; i++){
                    if (document.getElementById(otpChannels[i])){
                        document.getElementById(otpChannels[i]).style.display = 'block';
                    }
                }
            }
        }
        MASPluginUtils.MASPopupUI(MASPluginConstants.MASOTPChannelsPage,oncloseFunc,onLoadFunc);
    },	


    /**
     * Callback for the OTP Listener
     * @param callbackResp user defined callback object containing the OTP failure error message. Called in case of invalid/expired OTP.
     */
    MASOTPAuthenticationCallback: function(callbackResp){
        const error = callbackResp.error;
        // TODO: How to propogate error to API
        if(!MASPluginUtils.isEmpty(error)){
            console.log("Error in OTPChannelCallback:"+JSON.stringify(error));
            return;
        }

        const isInvalidOtp = callbackResp.resp.isInvalidOtp;
        const errorMessage = callbackResp.resp.errorMessage;

        let oncloseFunc = function(){
            $('#popUp').remove();
        };

        let onLoadFunc = function() {
            if(errorMessage !== "Enter the OTP"){ // TODO: Handle all these cases where getElementById is called, code should be oblivious of Ids
                document.getElementById("CA-Title").style.color = "red";
                document.getElementById("CA-Title").innerHTML = errorMessage;
            }
        };
        MASPluginUtils.MASPopupUI(MASPluginConstants.MASOTPPage,oncloseFunc,onLoadFunc);
    }
};
module.exports = MASPluginCallbacks;