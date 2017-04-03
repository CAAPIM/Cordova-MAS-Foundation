/* *
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASPluginAuthProviders = function() {
    
	/**
	*	Returns a list of available providers
    *   @param {function} successHandler user defined success callback
    *   @param {function} errorHandler user defined error callback
	*/
    this.getCurrentProviders = function(successHandler, errorHandler) {
    
        return Cordova.exec(successHandler, errorHandler, "MASPluginAuthProviders", "getCurrentProviders", []);
    };

    /**
    *	Returns the proximity login providers
    *   @param {function} successHandler user defined success callback
    *   @param {function} errorHandler user defined error callback
    */
    this.retrieveAuthenticationProviderForProximityLogin = function(successHandler, errorHandler) {
    
        return Cordova.exec(successHandler, errorHandler, "MASPluginAuthProviders", "retrieveAuthenticationProviderForProximityLogin", []);
    };
}

module.exports = MASPluginAuthProviders;