//
//  MASPlugin.h
//
//  Copyright (c) 2016 CA, Inc.
//
//  This software may be modified and distributed under the terms
//  of the MIT license. See the LICENSE file for details.
//

#import <Cordova/CDV.h>

@interface MASPlugin : CDVPlugin

/**
 *  Set grant flow of MASFoundation
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)setGrantFlow:(CDVInvokedUrlCommand*)command;



/**
 *  Set configuration JSON file name to MASFoundation.  File name without extention should be passed as parameter.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)setConfigFileName:(CDVInvokedUrlCommand*)command;


- (void)setAuthenticationListener:(CDVInvokedUrlCommand*)command;

- (void)completeAuthentication:(CDVInvokedUrlCommand*)command;

- (void)cancelAuthentication:(CDVInvokedUrlCommand*)command;


/**
 *  Starts the lifecycle of the MAS processes.
 *
 *  This will load the last used JSON configuration from keychain storage.  If there was none,
 *  it will load from default JSON configuration file (msso_config.json)
 *  or JSON file with file name set through setConfigFileName:.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)start:(CDVInvokedUrlCommand*)command;



/**
 *  Starts the lifecycle of the MAS processes.
 *
 *  This will load the default JSON configuration rather than from keychain storage; if the SDK was already initialized, this method will fully stop and re-start the SDK.
 *  The default JSON configuration file should be msso_config.json or file name defined through setConfigurationFileName:.
 *  This will ignore the JSON configuration in keychain storage and replace with the default configuration.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)startWithDefaultConfiguration:(CDVInvokedUrlCommand*)command;



/**
 *  Starts the lifecycle of the MAS processes with given JSON configuration data.
 *  This method will overwrite JSON configuration (if they are different) that was stored in keychain.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)startWithJSON:(CDVInvokedUrlCommand*)command;



/**
 *  Starts the lifecycle of the MAS processes with given JSON configuration file path.
 *  This method will overwrite JSON configuration (if they are different) that was stored in keychain.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)startWithURL:(CDVInvokedUrlCommand*)command;



/**
 *  TBD
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)setUserLoginBlock:(CDVInvokedUrlCommand*)command;



/**
 *  Request method for an HTTP GET call to the Gateway.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)getFromPath:(CDVInvokedUrlCommand*)command;



/**
 *  Request method for an HTTP DELETE call to the Gateway.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)deleteFromPath:(CDVInvokedUrlCommand*)command;



/**
 *  Request method for an HTTP POST call to the Gateway.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)postToPath:(CDVInvokedUrlCommand*)command;



/**
 *  Request method for an HTTP GET call to the Gateway.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)putToPath:(CDVInvokedUrlCommand*)command;



/**
 *  Request method for an HTTP PATCH call to the Gateway.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)patchToPath:(CDVInvokedUrlCommand*)command;



/**
 *  Stops the lifecycle of all MAS processes.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)stop:(CDVInvokedUrlCommand*)command;



/**
 *  Authenticates a user with given username and password.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)loginWithUsernameAndPassword:(CDVInvokedUrlCommand*)command;




/**
 *  Logs out currently authenticated user.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)logoutUser:(CDVInvokedUrlCommand *)command;



/**
 *  De-register the currently registered device and clears out all keychain information from local and shared keychain storage.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)deregister:(CDVInvokedUrlCommand*)command;



/**
 *  Boolean property of device registration status
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)isDeviceRegistered:(CDVInvokedUrlCommand*)command;



/**
 *  Boolean property of user authentication status
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)isAuthenticated:(CDVInvokedUrlCommand*)command;



/**
 *  Boolean property of the application authentication status (primarily for client credential authentication.)
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)isApplicationAuthenticated:(CDVInvokedUrlCommand*)command;



/**
 *  Enumeration value of authentication status.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)authenticationStatus:(CDVInvokedUrlCommand*)command;



/**
 *  Reset local keychain storage
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)resetLocally:(CDVInvokedUrlCommand*)command;

@end
