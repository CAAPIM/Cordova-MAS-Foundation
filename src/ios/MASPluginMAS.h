/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

//
//  MASPluginMAS.h
//

#import <Cordova/CDV.h>



@interface MASPluginMAS : CDVPlugin



///--------------------------------------
/// @name Properties
///--------------------------------------

# pragma mark - Properties

/**
 *  Set configuration JSON file name to MASFoundation.  File name without extention should be passed as parameter.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)setConfigFileName:(CDVInvokedUrlCommand*)command;



/**
 *  Set grant flow of MASFoundation
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)setGrantFlow:(CDVInvokedUrlCommand*)command;



/**
 *  Set whether Native MASUI should be used.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)useNativeMASUI:(CDVInvokedUrlCommand*)command;


/**
 *  Returns the current MASState
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)getMASState:(CDVInvokedUrlCommand*)command;


/**
 * Enable browser based Authentication.
 *
 * @param command @param command CDInvokedUrlCommand object
 */
- (void)enableBrowserBasedAuthentication:(CDVInvokedUrlCommand*)command;



///--------------------------------------
/// @name IdToken Validation
///--------------------------------------

# pragma mark - IdToken Validation

/**
 * Sets boolean indicator of enforcing id_token validation upon device registration/user authentication.
 * id_token is being validated as part of authentication/registration process against known signing algorithm.<br>
 * Mobile SDK currently supports following algorithm(s): - HS256<br>
 *
 * Any other signing algorithm will cause authentication/registration failure due to unknown signing algorithm.<br>
 * If the server side is configured to return a different or custom algorithm, ensure to disable id_token validation to avoid any failure on Mobile SDK.<br>
 *
 * By default, id_token validation is enabled and enforced in authentication and/or registration process; it can be opted-out.<br>
 */
- (void)enableIdTokenValidation:(CDVInvokedUrlCommand*)command;



/**
 * Gets boolean indicator of enforcing id_token validation upon device registration/user authentication.
 * id_token is being validated as part of authentication/registration process against known signing algorithm.<br>
 * Mobile SDK currently supports following algorithm(s): - HS256<br>
 *
 * Any other signing algorithm will cause authentication/registration failure due to unknown signing algorithm.<br>
 * If the server side is configured to return a different or custom algorithm, ensure to disable id_token validation to avoid any failure on Mobile SDK.<br>
 * By default, id_token validation is enabled and enforced in authentication and/or registration process; it can be opted-out.<br>
 */
- (void)isIdTokenValidationEnabled:(CDVInvokedUrlCommand*)command;



///--------------------------------------
/// @name Authentication Listeners
///--------------------------------------

# pragma mark - Authentication Listeners

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



///--------------------------------------
/// @name OTP Listeners
///--------------------------------------

# pragma mark - OTP Listeners

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


///--------------------------------------
/// @name Start & Stop
///--------------------------------------

# pragma mark - Start & Stop

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
 *  Stops the lifecycle of all MAS processes.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)stop:(CDVInvokedUrlCommand*)command;



///------------------------------------------------------------------------------------------------------------------
/// @name Security Configuration
///------------------------------------------------------------------------------------------------------------------

/**
 *  Sets the security configuration
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)setSecurityConfiguration:(CDVInvokedUrlCommand*)command;



///--------------------------------------
/// @name Gateway Monitoring
///--------------------------------------

# pragma mark - Gateway Monitoring

/**
 *  Boolean value of gateway reachability
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)gatewayIsReachable:(CDVInvokedUrlCommand*)command;



///--------------------------------------
/// @name HTTP Requests
///--------------------------------------

# pragma mark - HTTP Requests

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

///--------------------------------------
/// @name HTTP File Requests
///--------------------------------------

# pragma mark - HTTP File Requests

- (void)postMultiPartForm: (CDVInvokedUrlCommand *)command;

///--------------------------------------
/// @name Proximity Login
///--------------------------------------

# pragma mark - Proximity Login

/**
 *  Authorize the user using QR code
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)authorizeQRCode:(CDVInvokedUrlCommand *)command;

    
///--------------------------------------
/// @name Social Login
///--------------------------------------
    
# pragma mark - Social Login
    
- (void)doSocialLogin:(CDVInvokedUrlCommand *)command;
    
///--------------------------------------
/// @name JWKS Preloading.
///--------------------------------------

# pragma mark - JWKS Preloading

/**
 *  Determines whether preloading of JWKS is enabled.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)isJwksPreloadEnabled:(CDVInvokedUrlCommand *)command;

/**
 *  Enable JWKS preloading.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)enableJwksPreload:(CDVInvokedUrlCommand *)command;

///--------------------------------------
/// @name Proof Key for Code Exchange (PKCE)
///--------------------------------------

# pragma mark - Proof Key for Code Exchange

/**
 *  Checks if PKCE is enabled
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)isPKCEEnabled:(CDVInvokedUrlCommand *)command;

/**
 *  Enables PKCE
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)enablePKCE:(CDVInvokedUrlCommand *)command;

///--------------------------------------
/// @name JWT Signing
///--------------------------------------

# pragma mark - JWT Signing

/**
 *  Signs MASClaims with a default private key
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)signWithClaims:(CDVInvokedUrlCommand *)command;


@end
