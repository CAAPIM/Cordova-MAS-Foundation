/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

//
//  MASPluginUser.h
//

#import <Cordova/CDV.h>



@interface MASPluginUser : CDVPlugin



///--------------------------------------
/// @name Properties
///--------------------------------------

# pragma mark - Properties

- (void)isCurrentUser:(CDVInvokedUrlCommand*)command;



- (void)isAuthenticated:(CDVInvokedUrlCommand*)command;



- (void)isSessionLocked:(CDVInvokedUrlCommand*)command;



///--------------------------------------
/// @name Current User
///--------------------------------------

# pragma mark - Current User

- (void)currentUser:(CDVInvokedUrlCommand*)command;



///--------------------------------------
/// @name Current User - Lock/Unlock Session
///--------------------------------------

# pragma mark - Current User - Lock/Unlock Session

/**
 *  Lock current session
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)lockSession:(CDVInvokedUrlCommand*)command;



/**
 *  Unlock current session
 *
 *  @param command CDInvokedUrlCommand object
 */

- (void)unlockSession:(CDVInvokedUrlCommand*)command;



/**
 *  Unlock current session with a custom message
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)unlockSessionWithMessage:(CDVInvokedUrlCommand*)command;



/**
 *  Remove current session lock,
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)removeSessionLock:(CDVInvokedUrlCommand*)command;


//--------------------------------------
/// @name Authentication
///--------------------------------------

# pragma mark - Authentication


- (void)loginWithUsernameAndPassword:(CDVInvokedUrlCommand*)command;


- (void)loginWithAuthorizationCode:(CDVInvokedUrlCommand*)command;


- (void)requestUserInfo:(CDVInvokedUrlCommand*)command;


- (void)logoutUser:(CDVInvokedUrlCommand *)command;


@end
