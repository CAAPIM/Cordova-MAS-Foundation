/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */
 
var MASPluginConstants = {
	
  MASLoginPage: "masui/mas-login.html",

  MASOTPPage: "masui/mas-otp.html",

  MASOTPChannelsPage: "masui/mas-otpchannel.html",

  MASEnterpriseBrowserPage: "masui/mas-enterpriseBrowser.html",

  //MASPopupStyle: "position: fixed; top: 50%; left:50%; transform: translate(-50%, -50%); width:47%; height: 55%; overflow: auto",
  MASPopupLoginStyle: "position: fixed; top: 50%; left:50%; transform: translate(-50%, -50%); height: 100%; width:100%; overflow: auto",

  MASPopupOTPStyle: "position: fixed; top: 50%; left:50%; transform: translate(-50%, -50%); height: 500px; overflow: auto",

  MASLoginAuthRequestId: "",

	/**
 	 * The MASGrantFlow.
  	 */
	MASGrantFlow: {
            
        /**
     	 * Unknown grant flow type.
     	 */
        MASGrantFlowUnknown: -1,
        
        /**
     	 * The client credentials grant flow.
     	 */  
        MASGrantFlowClientCredentials: 0,

        /**
     	 * The user credentials grant flow.
     	 */  
        MASGrantFlowPassword: 1,
          
        /**
     	 * The total number of supported types.
     	 */  
        MASGrantFlowCount: 2
    },

    /**
 	 * The MASRequestResponseTypes that can indicate what data format is expected
 	 * in a request or a response.
 	 */
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
    }
};

module.exports = MASPluginConstants;