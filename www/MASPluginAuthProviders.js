/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASPluginAuthProviders = function() {
    
    this.getCurrentProviders = function(successHandler, errorHandler) {
    
        return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "getCurrentProviders", []);
    };

    this.retrieveAuthenticationProviderForProximityLogin = function(successHandler, errorHandler) {
    
        return Cordova.exec(successHandler, errorHandler, "com.ca.apim.MASPlugin", "retrieveAuthenticationProviderForProximityLogin", []);
    };
}

module.exports = MASPluginAuthProviders;