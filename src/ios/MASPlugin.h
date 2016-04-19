//
//  MASPlugin.h
//
//  Created by Kaushik Thekkekere on 2016-02-04.
//  Copyright (c) 2016 CA Technologies. All rights reserved.
//


#import <Cordova/CDV.h>

@interface MASPlugin : CDVPlugin

/**
 * sets the device registration type to the MASFoundation framework.
 */
- (void)setDeviceRegistrationType:(CDVInvokedUrlCommand*)command;


/**
 * sets the configuration json file name to the MASFoundation framework. This can used to set any custom name to the json config file.
 */
- (void)setConfigFileName:(CDVInvokedUrlCommand*)command;


/**
 * starts the process which includes the registration of the device and authentication of the user depending on the device registration type.
 */
- (void)start:(CDVInvokedUrlCommand*)command;

/**
 * Authenticates the user using username and password.
 */
- (void)loginWithUsernameAndPassword:(CDVInvokedUrlCommand*)command;

/**
 * Logs out the device. This mehod internally calls the logout device functionality in the MASFoundation framework. This also clears the local cache based
 *  on the option.
 */
- (void)logOutDeviceAndClearLocal:(CDVInvokedUrlCommand*)command;


/**
 * Logs off the current logged in user.
 */

- (void)logOffUser:(CDVInvokedUrlCommand*)command;

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
- (void)isUserAuthenticated:(CDVInvokedUrlCommand*)command;

@end
