/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */
//
//  MASPluginDevice.m
//  FoundationTest
//
//  Created by YUSSY01 on 01/02/17.
//
//

#import "MASPluginDevice.h"

#import <MASFoundation/MASFoundation.h>


@implementation MASPluginDevice


///--------------------------------------
/// @name Properties
///--------------------------------------

# pragma mark - Properties

- (void)isDeviceRegistered:(CDVInvokedUrlCommand*)command
{
    //
    // Checks if device is registered
    //
    
    CDVPluginResult *result;
    
    if ([MASDevice currentDevice])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:[[MASDevice currentDevice]isRegistered]];
    }
    else {
        
        NSDictionary *errorInfo = @{@"errorMessage":@"SDK has not properly initialized"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }
    
    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)getDeviceIdentifier:(CDVInvokedUrlCommand*)command
{
    //
    // Returns device identifier
    //
    
    CDVPluginResult *result;
    
    if ([MASDevice currentDevice])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[[MASDevice currentDevice]identifier]];
    }
    else {
        
        NSDictionary *errorInfo = @{@"errorMessage":@"SDK has not properly initialized"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }
    
    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


///--------------------------------------
/// @name Current Device
///--------------------------------------

# pragma mark - Current Device

- (void)getCurrentDevice:(CDVInvokedUrlCommand*)command
{
    //
    // Get details of the current device
    // Returns device identifier
    //
    
    CDVPluginResult *result;
    
    if ([MASDevice currentDevice])
    {
        NSDictionary *currentDevice = @{@"isRegistered": [NSNumber numberWithBool:[[MASDevice currentDevice] isRegistered]],
                                        @"identifier":[[MASDevice currentDevice] identifier]};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:currentDevice];
    }
    else {
        
        NSDictionary *errorInfo = @{@"errorMessage":@"No device found"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }
    
    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)deregister:(CDVInvokedUrlCommand*)command
{
    //
    // Deregister the device from the server
    // Returns error info if it fails
    //
    
    __block CDVPluginResult *result;
    
    if ([MASDevice currentDevice])
    {
        [[MASDevice currentDevice] deregisterWithCompletion:^(BOOL completed, NSError *error) {
            
            if (error) {
                
                NSDictionary *errorInfo = @{@"errorCode": [NSNumber numberWithInteger:[error code]],
                                            @"errorMessage":[error localizedDescription],
                                            @"errorInfo":[error userInfo]};
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
                
                return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Deregister complete"];
            
            return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }];
    }
    else {
        
        NSDictionary *errorInfo = @{@"errorMessage":@"SDK has not properly initialized"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
        
        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}


- (void)resetLocally:(CDVInvokedUrlCommand*)command
{
    //
    // Reset cached data stored locally
    //
    
    CDVPluginResult *result;
    
    if ([MASDevice currentDevice])
    {
        [[MASDevice currentDevice] resetLocally];
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
    }
    else {
        
        NSDictionary *errorInfo = @{@"errorMessage":@"SDK has not properly initialized"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }
    
    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


@end
