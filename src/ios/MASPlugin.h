//
//  MASPlugin.h
//
//  Created by Kaushik Thekkekere on 2016-02-04.
//  Copyright (c) 2016 CA Technologies. All rights reserved.
//


#import <Cordova/CDV.h>

@interface MASPlugin : CDVPlugin

/**
 * sets the grant flow to the MASFoundation framework.
 */
- (void)setGrantFlow:(CDVInvokedUrlCommand*)command;



/**
 * sets the configuration json file name to the MASFoundation framework. This can used to set any custom name to the json config file.
 */
- (void)setConfigFileName:(CDVInvokedUrlCommand*)command;



/**
 * starts the process which includes the registration of the device and authentication of the user depending on the device registration type.
 */
- (void)start:(CDVInvokedUrlCommand*)command;



/**
 *  Request method for an HTTP GET call from the Gateway.
 */
- (void)getFromPath:(CDVInvokedUrlCommand*)command;


/**
 *  Request method for an HTTP DELETE call from the Gateway.
 */
- (void)deleteFromPath:(CDVInvokedUrlCommand*)command;



/**
 *  Request method for an HTTP POST call from the Gateway.
 */
- (void)postToPath:(CDVInvokedUrlCommand*)command;



/**
 *  Request method for an HTTP PUT call from the Gateway.
 */
- (void)putToPath:(CDVInvokedUrlCommand*)command;



/**
 *  Request method for an HTTP PATCH call from the Gateway.
 */
- (void)patchToPath:(CDVInvokedUrlCommand*)command;



/**
 * Stops the lifecycle of all MAS processes.
 */
- (void)stop:(CDVInvokedUrlCommand*)command;



/**
 * Authenticates the user using username and password.
 */
- (void)loginWithUsernameAndPassword:(CDVInvokedUrlCommand*)command;




/**
 * Logs out the current logged in user.
 */
- (void)logoutUser:(CDVInvokedUrlCommand *)command;



/**
 * Deregisters the device from the server and also cleans the informations which are stored locally.
 */
- (void)deregister:(CDVInvokedUrlCommand*)command;



/**
 * checks whether the current device is registered or not.
 */
- (void)isDeviceRegistered:(CDVInvokedUrlCommand*)command;



/**
 * checks whether the current user is authenticated or not.
 */
- (void)isAuthenticated:(CDVInvokedUrlCommand*)command;



- (void)authenticationStatus:(CDVInvokedUrlCommand*)command;



- (void)resetLocally:(CDVInvokedUrlCommand*)command;

@end
