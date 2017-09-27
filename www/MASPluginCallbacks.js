/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */
 
var MASPluginConstants = require("./MASPluginConstants"),
    MASPluginUtils = require("./MASPluginUtils");
	
var MASPluginCallbacks = {


	/** Callback where it will prompt for login Credentials. It will also prompt for OTP channels in Android flow.
     * @param result user defined variable which has requestId and channels for the OTP in android. It is not used in iOS.
     */
    MASAuthenticationCallback: function(result) {
        
        var pageToLoad = MASPluginConstants.MASLoginPage;

        if (typeof result !== 'undefined' && !MASPluginUtils.isEmpty(result) &&
            typeof result.requestId !== 'undefined' && !MASPluginUtils.isEmpty(result.requestId) &&
            result.requestType === "Login") 
        {
            MASPluginConstants.MASLoginAuthRequestId = result.requestId;
        }

        /*if (typeof result !== 'undefined' && !isEmpty(result) &&
            typeof result.requestType !== 'undefined' && !isEmpty(result.requestType) &&
            result.requestType === "OTP") {
            if (typeof result.isInvalidOtp !== 'undefined' && !isEmpty(result.isInvalidOtp) && result.isInvalidOtp == "true") {
                MASPlugin.MASConfig.MASOTPAuthenticationCallback(result);
            } else {
                if (result.channels == null) {
                    console.log("Channel list is empty");
                    return;
                }
                var channelsCSV = result.channels;
                var channels = channelsCSV.split(',');
                MASPlugin.MASConfig.MASOTPChannelSelectCallback(channels);
            }
        } else */

        if (result === "removeQRCode") 
        {
            document.getElementById('qr-code').style.display = 'none';
        } 
        else if (result === "qrCodeAuthorizationComplete") 
        {
            $('#popUp').remove();
        } 
        else
        {
            if(pageToLoad === MASPluginConstants.MASLoginPage && 
            	document.getElementById('popUp') === null && document.getElementById('popup') === null)
            {
                MASPluginUtils.MASPopupUI(
                	pageToLoad, 
                	function() { 

                		$('#popUp').remove(); 
                	}, 
                	function() {
                		document.getElementById('qr-code').src = "data:image/jpeg;base64, " + result["qrCodeImageBase64"];

                		var providers = result["providers"];
                		if(typeof providers !== 'undefined' & !MASPluginUtils.isEmpty(providers)) {
                            
                            for(var i=0; i < providers.length; i++) {
                                
                                var p = providers[i];
                                if(p !== 'qrcode') {
                                    
                                    if(document.getElementById('i'+p)) {
                                        
                                        document.getElementById('i'+p).src = "masui/img/"+p+"_enabled.png";
                                        document.getElementById('l'+p).className = "enabled";
                                          
                                        if(p === 'salesforce')
                                          document.getElementById('i'+p).style.backgroundColor = "#1798c1";
                                    }
                                }
                            }
                	    }
                	}
                );
            }
        }
    },


    /**
     * Callback which is used to prompt for the OTP provided channels
     * @param otpChannels available channels array that will be recieved from server
     * Note: In case of android this function has to be called from Authentication Callback where OTP request with channels will come back.
     */
    MASOTPChannelSelectCallback: function(otpChannels) 
    {
        MASPluginUtils.MASPopupUI(
        	MASPluginConstants.MASOTPChannelsPage, 
        	function() { $('#popUp').remove(); }, 
        	function() {
            
            	if (otpChannels.length > 1) 
            	{              
                	for (i = 0; i < otpChannels.length; i++) 
                	{                 
                    	if (document.getElementById(otpChannels[i])) 
                    	{
                        	document.getElementById(otpChannels[i]).style.display = 'block';
                    	}
                	}
            	}
        	}
        );
    },	


    /**
     * Callback for the OTP Listener
     * @param error message that is recieved from server for invalid attempt
     * Note: This has to be called from android if otp is invalid.
     */
    MASOTPAuthenticationCallback: function(error) 
    {
        MASPluginUtils.MASPopupUI(MASPluginConstants.MASOTPPage, 
       	function() {

            $('#popUp').remove();
        }, 
        function() {

            if(error.errorMessage !== "Enter the OTP")
                document.getElementById("CA-Title").style.color = "red";
            document.getElementById("CA-Title").innerHTML = error.errorMessage;			
        });
    }
};

module.exports = MASPluginCallbacks;