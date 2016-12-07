/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

//
//  L7SMssoSDKPlugin.h
//
//  Created by Anthony Yu on 2013-11-15.
//


#import <Cordova/CDV.h>

@interface L7SMssoSDKPlugin : CDVPlugin

@property (nonatomic, strong)  UIViewController * loginViewController;


- (void) httpCall:(CDVInvokedUrlCommand*)command;


- (void) logoutDevice:(CDVInvokedUrlCommand*)command;

- (void) deRegister:(CDVInvokedUrlCommand*)command;

- (void) logoffApp:(CDVInvokedUrlCommand*)command;


- (void) isLogin:(CDVInvokedUrlCommand*)command;

- (void) isAppLogon:(CDVInvokedUrlCommand*)command;

- (void) isDeviceRegistered:(CDVInvokedUrlCommand*)command;

- (void) registerStatusUpdate:(CDVInvokedUrlCommand*)command;

- (void) registerErrorCallback:(CDVInvokedUrlCommand*)command;

@end
