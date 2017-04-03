/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */
//
//  MASPluginAuthProviders.h
//  FoundationTest
//
//  Created by YUSSY01 on 01/02/17.
//
//

#import <Cordova/CDV.h>



@interface MASPluginAuthProviders : CDVPlugin



///--------------------------------------
/// @name Authentication Providers
///--------------------------------------

# pragma mark - Authentication Providers

/**
 *
 *  Returns the list of current providers
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)getCurrentProviders:(CDVInvokedUrlCommand*)command;



///--------------------------------------
/// @name Proximity Login
///--------------------------------------

# pragma mark - Proximity Login

/**
 *
 *  Returns the authentication provider for proximity login
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)retrieveAuthenticationProviderForProximityLogin:(CDVInvokedUrlCommand*)command;



@end
