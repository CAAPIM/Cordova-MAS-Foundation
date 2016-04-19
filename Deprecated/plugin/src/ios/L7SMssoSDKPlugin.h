//
//  L7SMssoSDKPlugin.h
//
//  Created by Anthony Yu on 2013-11-15.
//  Copyright (c) 2013 CA Technologies. All rights reserved.
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
