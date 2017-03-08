/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */
//
//  MASPluginDevice.h
//  FoundationTest
//
//  Created by YUSSY01 on 01/02/17.
//
//

#import <Cordova/CDV.h>



@interface MASPluginDevice : CDVPlugin



///--------------------------------------
/// @name Properties
///--------------------------------------

# pragma mark - Properties

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



///--------------------------------------
/// @name Current Device
///--------------------------------------

# pragma mark - Current Device

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
 *  Reset local keychain storage
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)resetLocally:(CDVInvokedUrlCommand*)command;



@end
