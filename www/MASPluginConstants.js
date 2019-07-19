/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
 
/**
* @class MASPluginConstants
* @hideconstructor
* @classdesc This class contains various MAS constants.
* <table>
*	<tr bgcolor="#D3D3D3"><th>Sample constant access</th></tr>
*	<tr><td><i>var grantFlow = MASPluginConstants.MASGrantFlow.MASGrantFlowClientCredentials;</i></td></tr>
* </table>
*/
var MASPluginConstants = {
	MASLoginPage: "masui/mas-login.html",
    MASOTPPage: "masui/mas-otp.html",
    MASOTPChannelsPage: "masui/mas-otpchannel.html",
    MASEnterpriseBrowserPage: "masui/mas-enterpriseBrowser.html",

	/**
 	 * The default popup styles for UI elements in case of Authentication/OTP etc.
	 * @typedef {Object} MASPopupStyle
	 * @memberOf MASPluginConstants
	 * @property {string} MASPopupLoginStyle="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);height:100%;width:100%;overflow:auto" Default Login UI style
	 * @property {string} MASPopupOTPStyle="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);height:500px;overflow:auto" Default OTP UI style
  	 */
    MASPopupStyle: {
        MASPopupLoginStyle: "position: fixed; top: 50%; left:50%; transform: translate(-50%, -50%); height: 100%; width:100%; overflow: auto",
        MASPopupOTPStyle: "position: fixed; top: 50%; left:50%; transform: translate(-50%, -50%); height: 500px; overflow: auto"
    },

    MASLoginAuthRequestId: "",

	/**
 	 * The constant which indicates the OAuth Grant Flow type to be used for all the requests.
	 * @memberOf MASPluginConstants
	 * @typedef {Object} MASGrantFlow 
	 * @property {number} MASGrantFlowUnknown Unknown grant flow type.
	 * @property {number} MASGrantFlowClientCredentials The client credentials grant flow.
	 * @property {number} MASGrantFlowPassword The user credentials grant flow.
	 * @property {number} MASGrantFlowCount The total number of supported types.
  	 */
	MASGrantFlow: {
        MASGrantFlowUnknown: -1,
        MASGrantFlowClientCredentials: 0,
        MASGrantFlowPassword: 1,
        MASGrantFlowCount: 2
    },

    /**
 	 * The constant which indicates what data format is expected in a CRUD operation's request or a response.
	 * @memberOf MASPluginConstants
	 * @typedef {Object} MASRequestResponseType 
	 * @property {number} MASRequestResponseTypeUnknown Unknown encoding type.
	 * @property {number} MASRequestResponseTypeJson Standard JSON encoding.
	 * @property {number} MASRequestResponseTypeScimJson SCIM-specific JSON variant encoding.
	 * @property {number} MASRequestResponseTypeTextPlain Plain Text.
	 * @property {number} MASRequestResponseTypeWwwFormUrlEncoded Standard WWW Form URL encoding.
	 * @property {number} MASRequestResponseTypeXml Standard XML encoding.
	 * @property {number} MASRequestResponseTypeCount The total number of supported types.
 	 */
    MASRequestResponseType: {
     	MASRequestResponseTypeUnknown: -1,
     	MASRequestResponseTypeJson: 0,
     	MASRequestResponseTypeScimJson: 1,
     	MASRequestResponseTypeTextPlain: 2,
     	MASRequestResponseTypeWwwFormUrlEncoded: 3,
     	MASRequestResponseTypeXml: 4,
     	MASRequestResponseTypeCount: 5
    },
	
	 /**
 	 * The constant which indicates the state in which the MAS process lifecycle is
	 * @memberOf MASPluginConstants
	 * @typedef {Object} MASState 
	 * @property {number} MASStateNotConfigured States that SDK has not been initialized and does not have configuration file either in local file system based on the default configuration file name, nor in the keychain storage.
	 * @property {number} MASStateNotInitialized States that SDK has the active configuration either in the local file system but has not been initialized yet.
	 * @property {number} MASStateStarted States that SDK did start; at this state, SDK should be fully functional.
	 * @property {number} MASStateStopped States that SDK did stop; at this state, SDK is properly stopped and should be able to re-start.
 	 */
	MASState: {
		MASStateNotConfigured:1,
		MASStateNotInitialized:2,
		MASStateStarted:3,
		MASStateStopped:4
	},

	/**
    * The constant which specifies the SSL pinning mode that can be opted.
    * @memberOf MASPluginSecurityConfiguration
    * @typedef {Object} MASSecuritySSLPinningMode
    * @property {number} MASSecuritySSLPinningModePublicKeyHash SSL Pinning based on Public Key Hash
    * @property {number} MASSecuritySSLPinningModeCertificate SSL pinning based on Leaf Certificate
    * @property {number} MASSecuritySSLPinningModeIntermediateCertificate SSL pinning based on Intermediate Certificate
    */
    MASSecuritySSLPinningMode: {
       MASSecuritySSLPinningModePublicKeyHash: 0,
       MASSecuritySSLPinningModeCertificate: 1 ,
       MASSecuritySSLPinningModeIntermediateCertificate: 2
   }
};

module.exports = MASPluginConstants;