/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

/**
* @class MASPluginSecurityConfiguration
* @hideconstructor
* @classdesc A class to set MAS Security Configuration for a server based on the trust settings.
* <table>
*	<tr bgcolor="#D3D3D3"><th>MASPluginSecurityConfiguration Constructor</th></tr>
*	<tr><td><i>var MASSecurityConfiguration = new MASPlugin.MASSecurityConfiguration();</td></tr>
* </table>
*/
var MASPluginSecurityConfiguration = function(){
	this.json = {
	    host : null,
	    isPublic : false,
	    certificates : [],
	    publicKeyHashes : [],
	    trustPublicPKI : false,
	    pinningMode : 1
	},


	/**
	* Set the host of the server that you want to connect
	* @memberOf MASPluginSecurityConfiguration
	* @function setHost
	* @instance
	* @param {string} host Uri object containing the hostname, and port number.
	*/
	this.setHost = function(pHost){
		this.json.host = pHost;
	},
	/**
	* Sets the public/private scope of the server.
	* @memberOf MASPluginSecurityConfiguration
	* @function setPublic
	* @instance
	* @param {boolean} isPublic Boolean value that specifes whether the server is public or not.
	*/
	this.setPublic = function(pPublic){
		this.json.isPublic = pPublic;
	},
	/**
	* Set the certificate of the host server
	* @memberOf MASPluginSecurityConfiguration
	* @function addCertificate
	* @instance
	* @param {string} certificate The pinned certificate in Base64 string format
	*/
	this.addCertificate = function(certificate){
		this.json.certificates.push(certificate);
	},
	/**
	* Set the public keys of the host server
	* @function addPublicKeyHash
	* @instance
	* @memberOf MASPluginSecurityConfiguration
	* @param {string} publicKeyHash String value in Base64 of the pinned public key hash.
	*/
	this.addPublicKeyHash = function(publicKeyHash){
    		this.json.publicKeyHashes.push(publicKeyHash);
    },
	/**
	* Determines whether to trust Public PKI for the host server.
	* @memberOf MASPluginSecurityConfiguration
	* @function setTrustPublicPKI
	* @instance
	* @param {boolean} trustPublicPKI Boolean value to trust, or not to trust the public PKI. If false, provide either the certificate, or the publicKeyHash.
	*/
    this.setTrustPublicPKI = function(pTrustPublicPKI){
        this.json.trustPublicPKI = pTrustPublicPKI;
    },
    /**
    * Set the SSL Pinning mode needed.
    * @memberOf MASPluginSecurityConfiguration
    * @function setPinningMode
    * @instance
    * @param {MASSecuritySSLPinningMode} pinningMode enum value to specify the type of SSL pinning needed. 
    * The Certifcates array needs to be set accordingly with the certificates that needs to be pinned. 
    * If MASSecuritySSLPinningModeIntermediateCertifcate is chosen, then the certificates array should contain intermediate certificate.
    */
    this.setPinningMode = function(pinningMode){
    	this.json.pinningMode = pinningMode;
    },

	/**
	* Gets the final MASSecurityConfiguration as a JSON object
	* @function getSecurityConfiguration
	* @instance
	* @memberOf MASPluginSecurityConfiguration
	* @returns {Object} MASSecurityConfiguration object<br> Example output -- <br>{<br> &nbsp;&nbsp;host:gw.ca.com:443,<br>&nbsp;&nbsp;isPublic:false,<br>&nbsp;&nbsp;certificates:[Jcnjd...],<br>&nbsp;&nbsp;trustPublicPKI:true<br>}
	*/
	this.getSecurityConfiguration = function(){
		return this.json;
	}
}
module.exports = MASPluginSecurityConfiguration;