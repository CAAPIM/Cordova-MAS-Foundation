//
//  MASPlugin.m
//
//  Created by Kaushik Thekkekere on 2016-02-04.
//  Copyright (c) 2016 CA Technologies. All rights reserved.
//

#import "MASPlugin.h"
#import <MASFoundation/MASFoundation.h>
#import <MASUI/MASUI.h>


@interface MASPlugin()


@end

@implementation MASPlugin


- (void)pluginInitialize
{
    
}


- (void)setDeviceRegistrationType:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result;
    
    NSNumber *registrationType = [NSNumber numberWithInteger:0];
    
    MASDeviceRegistrationType deviceRegistrationType;
    
    if (command.arguments.count>0) {
        
        registrationType = [command.arguments objectAtIndex:0];
    }
    
    deviceRegistrationType = [registrationType integerValue];
    
    [MAS setDeviceRegistrationType:deviceRegistrationType];
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Device registration type is set"];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)setConfigFileName:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result;
    
    NSString *fileName = @"msso_config";
    
    if (command.arguments.count>0) {
        
        fileName = [command.arguments objectAtIndex:0];
    }
    
    [MAS setConfigurationFileName:fileName];
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Config file name is set"];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)start:(CDVInvokedUrlCommand*)command
{
    __block CDVPluginResult *result;
    
    [MAS start:^(BOOL completed, NSError *error) {
        
        if (error) {
            
            NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                        @"errorMessage":[error localizedDescription],
                                        @"errorInfo":[error userInfo]};
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
            
            return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Start complete"];
        
        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}


- (void)loginWithUsernameAndPassword:(CDVInvokedUrlCommand*)command
{
    __block CDVPluginResult *result;
    
    NSString *userName = @"";
    NSString *password = @"";
    
    if (command.arguments.count>=2) {
        
        userName = [command.arguments objectAtIndex:0];
        password = [command.arguments objectAtIndex:1];
        
        [MASUser loginWithUserName:userName password:password completion:^(BOOL completed, NSError *error) {
            
            if (error) {
                
                NSDictionary *errorInfo = @{@"errorCode": [NSNumber numberWithInteger:[error code]],
                                            @"errorMessage":[error localizedDescription],
                                            @"errorInfo":[error userInfo]};
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
                
                return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Login with username and password complete"];
            
            return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }];
    }
    else
    {
        NSDictionary *errorInfo = @{@"errorCode": [NSNumber numberWithInteger:1000],
                                    @"errorMessage":@"Invalid parameters. Please provide the valid inputs.",
                                    @"errorInfo":[NSDictionary dictionary]};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
        
        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        
    }
}


- (void)deregister:(CDVInvokedUrlCommand*)command
{
    __block CDVPluginResult *result;
    
    [[MASDevice currentDevice]deregisterWithCompletion:^(BOOL completed, NSError *error) {
        
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


- (void)logOutDeviceAndClearLocal:(CDVInvokedUrlCommand*)command
{
    __block CDVPluginResult *result;
    
    NSNumber *clearlocal = [NSNumber numberWithBool:YES];
    
    if (command.arguments.count>0) {
        clearlocal = [command.arguments objectAtIndex:0];
    }
    
    [[MASDevice currentDevice]logOutDeviceAndClearLocal:[clearlocal boolValue] completion:^(BOOL completed, NSError *error) {
        
        if (error) {
            
            NSDictionary *errorInfo = @{@"errorCode": [NSNumber numberWithInteger:[error code]],
                                        @"errorMessage":[error localizedDescription],
                                        @"errorInfo":[error userInfo]};
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
            
            return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Logout device complete"];
        
        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}


- (void)logOffUser:(CDVInvokedUrlCommand *)command
{
    __block CDVPluginResult *result;
    
    
    [MASUser logoffWithCompletion:^(BOOL completed, NSError *error) {
        
        if (error) {
            
            NSDictionary *errorInfo = @{@"errorCode": [NSNumber numberWithInteger:[error code]],
                                        @"errorMessage":[error localizedDescription],
                                        @"errorInfo":[error userInfo]};
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
            
            return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Logoff user complete"];
        
        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        
    }];
}


- (void)isDeviceRegistered:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result;
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:[[MASDevice currentDevice]isRegistered]];
    
    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)isUserAuthenticated:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result;
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:[[MASUser currentUser]isAuthenticated]];
    
    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


@end
