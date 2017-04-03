/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */
//
//  MASPluginApplication.m
//  FoundationTest
//
//  Created by YUSSY01 on 01/02/17.
//
//

#import "MASPluginApplication.h"

#import <MASFoundation/MASFoundation.h>

#import "MASPluginAuthenticationController.h"

#import "WebViewController.h"


@interface MASPluginApplication ()


@property (nonatomic, copy) NSArray* currentEnterpriseApps;


@end


@implementation MASPluginApplication


///--------------------------------------
/// @name Properties
///--------------------------------------

# pragma mark - Properties

- (void)isApplicationAuthenticated:(CDVInvokedUrlCommand*)command
{
    //
    // Checks if application is authenticated
    //
    
    CDVPluginResult *result;
    
    if ([MASApplication currentApplication])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:[[MASApplication currentApplication] isAuthenticated]];
    }
    else {
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsBool:NO];
    }
    
    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)authenticationStatus:(CDVInvokedUrlCommand*)command
{
    //
    // Returns the authentication status
    //
    
    CDVPluginResult *result;
    
    if ([MASApplication currentApplication])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:[[MASApplication currentApplication] authenticationStatus]];
    }
    else {
        
        NSDictionary *errorInfo = @{@"errorMessage":@"SDK has not properly initialized"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }
    
    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


///--------------------------------------
/// @name Enterprise App
///--------------------------------------

# pragma mark - Enterprise App

- (void)launchApp:(CDVInvokedUrlCommand*)command
{
    //
    // Launches an enterprise app
    //
    
    CDVPluginResult *result;
    
    NSString *appId = [command.arguments objectAtIndex:0];
    NSString *appUrl = nil;
    MASApplication *app = nil;
    MASApplication *currentApp = nil;
    for(app in _currentEnterpriseApps){
        if([app.identifier isEqualToString:appId]){
            currentApp = app;
        }
    }
    if([currentApp.nativeUrl length]) {
        
        appUrl = currentApp.nativeUrl;
        BOOL canOpenUrl = [[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:appUrl]];
        if (canOpenUrl)
        {
            [[UIApplication sharedApplication] openURL:[NSURL URLWithString:appUrl]];
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
        }
        else {
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsBool:NO];
        }
    }
    else if ([currentApp.authUrl length]) {
        
        if (![[MAS gatewayMonitoringStatusAsString] isEqualToString:@"Not Reachable"]) {
            
            UIStoryboard*  sb = [UIStoryboard storyboardWithName:@"EnterpriseBrowser"
                                                          bundle:nil];
            WebViewController* vc = [sb instantiateViewControllerWithIdentifier:@"EBViewController"];
            vc.app = currentApp;
            
            UINavigationController *nc = [[UINavigationController alloc] initWithRootViewController:vc];
            
            [self.viewController presentViewController:nc animated:YES completion:nil];
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
        }
        else {
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Host is currently not reachable"];
        }
    }
    else {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsBool:NO];
    }
    
    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)retrieveEnterpriseApps:(CDVInvokedUrlCommand*)command
{
    //
    // Get the list of enterprise apps
    //
    
    __block CDVPluginResult *result;
    __block NSMutableArray *enterpriseApps = [[NSMutableArray alloc] init];

    if ([MAS MASState] == MASStateNotInitialized || [MAS MASState] == MASStateDidStop) {
     
        NSDictionary *errorInfo = @{@"errorMessage":@"SDK Not Initialized !!"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
        
        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
    
    if(![[MAS gatewayMonitoringStatusAsString] isEqualToString:@"Not Reachable"] && [MASApplication currentApplication])
    {
        [[MASApplication currentApplication] retrieveEnterpriseApps:^(NSArray *objects, NSError * error){
            _currentEnterpriseApps = objects;
            if(error){
                
                NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                            @"errorMessage":[error localizedDescription],
                                            @"errorInfo":[error userInfo]};
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
            }
            else{
                //[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:objects];
                for(id object in _currentEnterpriseApps){
                    MASApplication *application = object;
                    NSMutableDictionary *app = [[NSMutableDictionary alloc] init];
                    [app setObject:application.name forKey:@"appName"];
                    [app setObject:application.identifier forKey:@"identifier"];
                    [app setObject:application.nativeUrl forKey:@"nativeUrl"];
                    [app setObject:application.authUrl forKey:@"authUrl"];
                    [app setObject:application.iconUrl forKey:@"iconUrl"];
                    [enterpriseApps addObject:app];
                }
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:enterpriseApps];
            }
            
            [result setKeepCallbackAsBool:YES];
            
            return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }];
    }
    else {
        
        NSDictionary *errorInfo = nil;
        if ([[MAS gatewayMonitoringStatusAsString] isEqualToString:@"Not Reachable"])
            errorInfo = @{@"errorMessage":@"Host is currently not reachable"};
        else if (![MASApplication currentApplication])
            errorInfo = @{@"errorMessage":@"Application not initialized"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
        
        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}


@end
