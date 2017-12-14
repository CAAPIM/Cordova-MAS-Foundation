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



- (void)getAccessToken:(CDVInvokedUrlCommand*)command;



- (void)isSessionLocked:(CDVInvokedUrlCommand*)command;



///--------------------------------------
/// @name Current User
///--------------------------------------

# pragma mark - Current User

- (void)currentUser:(CDVInvokedUrlCommand*)command;

- (void)listAttributes:(CDVInvokedUrlCommand*)command;

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

/**getA
 *  Login with username and password
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)loginWithUsernameAndPassword:(CDVInvokedUrlCommand*)command;

/**
 *  Login with an ID token and its token type
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)loginWithIdTokenAndTokenType:(CDVInvokedUrlCommand*)command;

/**
 *  Login with an authorization code
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)loginWithAuthCode:(CDVInvokedUrlCommand*)command;

/**
 *  Login with an authorization code using MASAuthCredentials
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)loginWithAuthCredentialsAuthCode:(CDVInvokedUrlCommand*)command;

/**
 *  Login with an authorization code using MASAuthCredentials
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)loginWithAuthCredentialsUsernamePassword:(CDVInvokedUrlCommand*)command;

/**
 *  Login with a JSON web token and a token type
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)loginWithAuthCredentialsJWT:(CDVInvokedUrlCommand*)command;

/**
 Authenticate a user by launching a Browser which in turn loads a URL (templatized).
 
 @param completion The MASCompletionErrorBlock block that receives the results.  On a successful completion, the user
 available via [MASUser currentUser] has been updated with the new information.
 */
- (void)initializeBrowserBasedAuthentication:(CDVInvokedUrlCommand*)command;

- (void)requestUserInfo:(CDVInvokedUrlCommand*)command;

/**
 *  Logout the current user
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)logoutUser:(CDVInvokedUrlCommand*)command;


/**
 *  Returns the authorization credentials' type
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)getAuthCredentialsType:(CDVInvokedUrlCommand *)command;


@end
