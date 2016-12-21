/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

//
//  MASPlugin.h
//

#import <Cordova/CDV.h>



@interface MASPlugin : CDVPlugin


/**
 *  Set whether Native MASUI should be used.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)useNativeMASUI:(CDVInvokedUrlCommand*)command;

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



/**
 *  Set a user login block to handle the case where the type set in 'setDeviceRegistrationType:(MASDeviceRegistrationType)'
 *  is 'MASDeviceRegistrationTypeUserCredentials'.  If it set to 'MASDeviceRegistrationTypeClientCredentials' this
 *  is not called.
 */
- (void)setAuthenticationListener:(CDVInvokedUrlCommand*)command;



/**
 *  Complete the user login block with user provided credentials to handle the case where the type set in
 *  'setDeviceRegistrationType:(MASDeviceRegistrationType)' is 'MASDeviceRegistrationTypeUserCredentials'.
 */
- (void)completeAuthentication:(CDVInvokedUrlCommand*)command;



/**
 *  Cancel the user login block to handle the case where the type set in
 *  'setDeviceRegistrationType:(MASDeviceRegistrationType)' is 'MASDeviceRegistrationTypeUserCredentials'.
 */
- (void)cancelAuthentication:(CDVInvokedUrlCommand*)command;

/**
 *  Authorize the user using QR code
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)authorizeQRCode:(CDVInvokedUrlCommand *)command;

/**
 *  Set the OTP channel selection listener
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)setOTPChannelSelectorListener:(CDVInvokedUrlCommand*)command;

/**
 *  Generate a new OTP and send it to the selected channels
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)generateAndSendOTP:(CDVInvokedUrlCommand*)command;

/**
 *  Cancel the generate OTP request
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)cancelGenerateAndSendOTP:(CDVInvokedUrlCommand*)command;

/**
 *  Set the OTP authentication listener
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)setOTPAuthenticationListener:(CDVInvokedUrlCommand*)command;

/**
 *  Validate the OTP
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)validateOTP:(CDVInvokedUrlCommand*)command;

/**
 *  Cancel the OTP validation request
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)cancelOTPValidation:(CDVInvokedUrlCommand*)command;

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
  *  Gets current device information
  *
  *  @param command CDInvokedUrlCommand object
  */
- (void)getCurrentDevice:(CDVInvokedUrlCommand*)command;

/**
 *  De-register the currently registered device and clears out all keychain information from local and shared keychain storage.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)deregister:(CDVInvokedUrlCommand*)command;

/**
 *
 *  Returns the authentication provider for proximity login
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)retrieveAuthenticationProviderForProximityLogin:(CDVInvokedUrlCommand*)command;

/**
 *
 *  Returns the list of current providers
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)getCurrentProviders:(CDVInvokedUrlCommand*)command;

/**
 *  Boolean property of device registration status
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)isDeviceRegistered:(CDVInvokedUrlCommand*)command;

/**
 *  Returns the device identifier
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)getDeviceIdentifier:(CDVInvokedUrlCommand*)command;

/**
 *  Boolean property of the application authentication status (primarily for client credential authentication.)
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)isApplicationAuthenticated:(CDVInvokedUrlCommand*)command;

/**
 *  Launches a native app with a given URI
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)launchApp:(CDVInvokedUrlCommand*)command;

/**
 *  Enumeration value of authentication status.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)authenticationStatus:(CDVInvokedUrlCommand*)command;

/**
  *  Boolean value of gateway reachability
  *
  *  @param command CDInvokedUrlCommand object
  */
- (void)gatewayIsReachable:(CDVInvokedUrlCommand*)command;

/**
  *  Retrieves the list of enterprise apps
  *
  *  @param command CDVInvokedUrlCommand object
  *
*/
- (void)retrieveEnterpriseApps:(CDVInvokedUrlCommand*)command;

/**
 *  Reset local keychain storage
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)resetLocally:(CDVInvokedUrlCommand*)command;

@end
