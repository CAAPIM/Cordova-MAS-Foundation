/* *
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */
/**
* @class MASPluginAuthProviders
* @hideconstructor
* @classdesc This class contains the functions for MAS Authentication Providers details. Only for Cordova-iOS platform.
* <table>
*	<tr bgcolor="#D3D3D3"><th>MASPluginAuthProviders Construtor</th></tr>
*	<tr><td><i>var MASAuthenticationProviders = new MASPlugin.MASAuthenticationProviders();</i></td></tr>
* </table>
*/
var MASPluginAuthProviders = function() {
    
	/**
	* Returns a list of available authentication providers as enabled on the MAG server.
	* @memberOf MASPluginAuthProviders
	* @function getCurrentProviders
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario. The result object containing the provider list
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
	*/
    this.getCurrentProviders = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginAuthProviders", "getCurrentProviders", []);
    };

    /**
    * Returns all the proximity login providers
	* @memberOf MASPluginAuthProviders
	* @function retrieveAuthenticationProviderForProximityLogin
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
    */
    this.retrieveAuthenticationProviderForProximityLogin = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginAuthProviders", "retrieveAuthenticationProviderForProximityLogin", []);
    };
}

module.exports = MASPluginAuthProviders;