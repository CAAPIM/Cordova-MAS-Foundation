/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */
//
//  MASPluginAuthProviders.m
//  FoundationTest
//
//  Created by YUSSY01 on 01/02/17.
//
//

#import "MASPluginAuthProviders.h"

#import <MASFoundation/MASFoundation.h>


@implementation MASPluginAuthProviders


///--------------------------------------
/// @name Authentication Providers
///--------------------------------------

# pragma mark - Authentication Providers

- (void)getCurrentProviders:(CDVInvokedUrlCommand*)command
{
    //
    // Get a list of login providers
    //
    
    CDVPluginResult *result;
    
    NSArray *listOfProviders = [[MASAuthenticationProviders currentProviders] providers];
    NSMutableArray *providersJson = nil;
    if(listOfProviders) {
        for(id object in listOfProviders)
        {
            MASAuthenticationProvider *provider = object;
            NSMutableDictionary *entry = [[NSMutableDictionary alloc] init];
            
            [entry setObject:[provider identifier] forKey:@"identifier"];
            [entry setObject:[provider authenticationUrl] forKey:@"authUrl"];
            [entry setObject:[provider pollUrl] forKey:@"pollUrl"];
            [entry setObject:[NSNumber numberWithBool:[provider isGoogle]] forKey:@"isGoogle"];
            [entry setObject:[NSNumber numberWithBool:[provider isFacebook]] forKey:@"isFacebook"];
            [entry setObject:[NSNumber numberWithBool:[provider isLinkedIn]] forKey:@"isLinkedIn"];
            [entry setObject:[NSNumber numberWithBool:[provider isQrCode]] forKey:@"isQrCode"];
            [entry setObject:[NSNumber numberWithBool:[provider isEnterprise]] forKey:@"isEnterprise"];
            [entry setObject:[NSNumber numberWithBool:[provider isSalesforce]] forKey:@"isSalesforce"];
            [providersJson addObject:entry];
        }
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:providersJson];
    }
    else {
        NSDictionary *errorInfo = @{@"errorMessage":@"No providers found"};
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }
    
    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


///--------------------------------------
/// @name Proximity Login
///--------------------------------------

# pragma mark - Proximity Login

- (void)retrieveAuthenticationProviderForProximityLogin:(CDVInvokedUrlCommand*)command
{
    //
    // Get a list of proximity providers
    //
    
    CDVPluginResult *result;
    
    MASAuthenticationProvider *proximityProvider = [[MASAuthenticationProviders currentProviders] retrieveAuthenticationProviderForProximityLogin];
    NSMutableDictionary *entry = [[NSMutableDictionary alloc] init];
    if(proximityProvider){
        [entry setObject:[proximityProvider identifier] forKey:@"identifier"];
        [entry setObject:[proximityProvider authenticationUrl] forKey:@"authUrl"];
        [entry setObject:[proximityProvider pollUrl] forKey:@"pollUrl"];
        [entry setObject:[NSNumber numberWithBool:[proximityProvider isGoogle]] forKey:@"isGoogle"];
        [entry setObject:[NSNumber numberWithBool:[proximityProvider isFacebook]] forKey:@"isFacebook"];
        [entry setObject:[NSNumber numberWithBool:[proximityProvider isLinkedIn]] forKey:@"isLinkedIn"];
        [entry setObject:[NSNumber numberWithBool:[proximityProvider isQrCode]] forKey:@"isQrCode"];
        [entry setObject:[NSNumber numberWithBool:[proximityProvider isEnterprise]] forKey:@"isEnterprise"];
        [entry setObject:[NSNumber numberWithBool:[proximityProvider isSalesforce]] forKey:@"isSalesforce"];
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:entry];
    }
    
    else {
        NSDictionary *errorInfo = @{@"errorMessage":@"No proximity provider found"};
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }
    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


@end
