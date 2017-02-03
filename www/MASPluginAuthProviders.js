/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASPluginAuthProviders = function() {
    

    this.getCurrentProviders = function(successHandler, errorHandler) {
    
        return Cordova.exec(successHandler, errorHandler, "MASPluginAuthProviders", "getCurrentProviders", []);
    };


    this.retrieveAuthenticationProviderForProximityLogin = function(successHandler, errorHandler) {
    
        return Cordova.exec(successHandler, errorHandler, "MASPluginAuthProviders", "retrieveAuthenticationProviderForProximityLogin", []);
    };
}

module.exports = MASPluginAuthProviders;