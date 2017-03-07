/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASPluginGroup = function() {


	///------------------------------------------------------------------------------------------------------------------
	/// @name Properties
	///------------------------------------------------------------------------------------------------------------------

	/**
	*	The name of the group
	*	@member {string}
	*/
	this.groupName;

	/**
	*	The owner of the group
	*	@member {string}
	*/
	this.owner;

	/**
	*	Lists the members of the group
	*	@member {array}
	*/
	this.members;


	///------------------------------------------------------------------------------------------------------------------
	/// @name Lifecycle
	///------------------------------------------------------------------------------------------------------------------

	/**
	*	Creates a new group with the specified information
	* 	@param {function} successHandler user defined success callback
	* 	@param {function} errorHandler user defined error callback
	* 	@param {dictionary} info
	*/
	this.initWithInfo = function(successHandler, errorHandler, info) {

		return Cordova.exec(successHandler, errorHandler, "MASPluginGroup", "initWithInfo", [info]);
	};

	/**
	*	Creates a new group
	* 	@param {function} successHandler user defined success callback
	* 	@param {function} errorHandler user defined error callback
	*/
	this.newGroup = function(successHandler, errorHandler) {

		return Cordova.exec(successHandler, errorHandler, "MASPluginGroup", "newGroup", []);
	};
}

module.exports = MASPluginGroup;