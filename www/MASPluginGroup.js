/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASPluginGroup = function() {
	this.groupName;
	this.owner;
	this.members;

	this.initWithInfo = function(successHandler, errorHandler, info) {
		return Cordova.exec(successHandler, errorHandler, "MASPluginGroup", "initWithInfo", [info]);
	};

	this.newGroup = function(successHandler, errorHandler) {
		return Cordova.exec(successHandler, errorHandler, "MASPluginGroup", "newGroup", []);
	};
}

module.exports = MASPluginGroup;