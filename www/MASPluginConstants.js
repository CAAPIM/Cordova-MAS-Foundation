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

    MASPopupStyle: {
        MASPopupLoginStyle: "position: fixed; top: 50%; left:50%; transform: translate(-50%, -50%); height: 100%; width:100%; overflow: auto",
        MASPopupOTPStyle: "position: fixed; top: 50%; left:50%; transform: translate(-50%, -50%); height: 500px; overflow: auto"
    },

    MASLoginAuthRequestId: "",

	/**
 	 * The MASGrantFlow.
  	 */
	MASGrantFlow: {
        MASGrantFlowUnknown: -1,//Unknown grant flow type.
        MASGrantFlowClientCredentials: 0,//The client credentials grant flow.
        MASGrantFlowPassword: 1,//The user credentials grant flow.
        MASGrantFlowCount: 2//The total number of supported types.
    },

    /**
 	 * The MASRequestResponseTypes that can indicate what data format is expected
 	 * in a request or a response.
 	 */
    MASRequestResponseType: {
     	MASRequestResponseTypeUnknown: -1,//Unknown encoding type.
     	MASRequestResponseTypeJson: 0,//Standard JSON encoding.
     	MASRequestResponseTypeScimJson: 1,//SCIM-specific JSON variant encoding.
     	MASRequestResponseTypeTextPlain: 2,//Plain Text.
     	MASRequestResponseTypeWwwFormUrlEncoded: 3,//Standard WWW Form URL encoding.
     	MASRequestResponseTypeXml: 4,//Standard XML encoding.
     	MASRequestResponseTypeCount: 5//The total number of supported types.
    }
};

module.exports = MASPluginConstants;