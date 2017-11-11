/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */
//
//  MASPluginSecurityConfiguration.js
//

var MASPluginSecurityConfiguration = function(){
	this.json = {
	    host : null,
	    isPublic : false,
	    certificates : [],
	    publicKeyHashes : [],
	    trustPublicPKI : false
	},
	this.setHost = function(pHost){
		this.json.host = pHost;
	},
	this.setPublic = function(pPublic){
		this.json.isPublic = pPublic;
	},
	this.addCertificate = function(certificate){
		this.json.certificates.push(certificate);
	},
	this.addPublicKeyHash = function(publicKeyHash){
    		this.json.publicKeyHashes.push(publicKeyHash);
    },
    this.setTrustPublicPKI = function(pTrustPublicPKI){
        this.json.trustPublicPKI = pTrustPublicPKI;
    },
	this.getSecurityConfiguration = function(){
		return this.json;
	}
}
module.exports = MASPluginSecurityConfiguration;