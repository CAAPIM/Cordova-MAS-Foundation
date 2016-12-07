/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASPluginMAS = require("./MASPluginMAS"),
    MASPluginUser = require("./MASPluginUser"),
    MASPluginDevice = require("./MASPluginDevice"),
    MASPluginApplication = require("./MASPluginApplication"),
    MASPluginAuthProviders = require("./MASPluginAuthProviders");

var MASPluginConstants = require("./MASPluginConstants");

var MASPlugin = {

    MASGrantFlow: MASPluginConstants.MASGrantFlow,

    MASRequestResponseType: MASPluginConstants.MASRequestResponseType,

    MASAuthenticationStatus: MASPluginApplication.MASAuthenticationStatus,

    /**
     MAS which has the interfaces mapped to the native MAS class.
     */
    MAS: MASPluginMAS,

    /**
     MASUser which has the interfaces mapped to the native MASUser class.
     */
    MASUser: MASPluginUser,    

    /**
     MASDevice which has the interfaces mapped to the native MASDevice class.
     */
    MASDevice: MASPluginDevice,
    /**
     *
     * MASApplication has the interfaces mapped to the native MASApplication class.
     */
    MASApplication: MASPluginApplication,

    /**
     *
     * MASAuthenticationProviders represents all available providers
     */
    MASAuthenticationProviders: MASPluginAuthProviders
};
    
module.exports = MASPlugin;