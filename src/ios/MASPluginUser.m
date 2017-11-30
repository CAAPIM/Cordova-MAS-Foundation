/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

//
//  MASPluginUser.m
//


#import "MASPluginUser.h"

#import <MASFoundation/MASFoundation.h>

#if defined(__has_include)
#if __has_include(<MASUI/MASUI.h>)
#import <MASUI/MASUI.h>
#endif
#endif


@implementation MASPluginUser


///--------------------------------------
/// @name Properties
///--------------------------------------

# pragma mark - Properties

- (void)isCurrentUser:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result;
    
    if([MASUser currentUser])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                     messageAsBool:[[MASUser currentUser] isCurrentUser]];
    }
    else
    {
        NSDictionary *errorInfo = @{@"errorMessage":@"No authenticated user available"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                               messageAsDictionary:errorInfo];
    }
    
    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)isAuthenticated:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result;
    
    if([MASUser currentUser])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                     messageAsBool:[[MASUser currentUser] isAuthenticated]];
    }
    else
    {
        NSDictionary *errorInfo = @{@"errorMessage":@"No authenticated user available"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                               messageAsDictionary:errorInfo];
    }
    
    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)getAccessToken:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result;
    
    if([MASUser currentUser])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                     messageAsString:[[MASUser currentUser] accessToken]];
    }
    else
    {
        NSDictionary *errorInfo = @{@"errorMessage":@"No authenticated user available"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                               messageAsDictionary:errorInfo];
    }
    
    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)isSessionLocked:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result;
    
    if([MASUser currentUser])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                     messageAsBool:[[MASUser currentUser] isSessionLocked]];
    }
    else
    {
        NSDictionary *errorInfo = @{@"errorMessage":@"No authenticated user available"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                               messageAsDictionary:errorInfo];
    }
    
    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


///--------------------------------------
/// @name Current User
///--------------------------------------

# pragma mark - Current User

- (void)currentUser:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result;
    
    if([MASUser currentUser])
    {
        NSDictionary *currentUser =
        @{@"isCurrentUser":[NSNumber numberWithBool:[[MASUser currentUser] isCurrentUser]],
          @"isAuthenticated":[NSNumber numberWithBool:[[MASUser currentUser] isAuthenticated]],
          @"isSessionLocked":[NSNumber numberWithBool:[[MASUser currentUser] isSessionLocked]],
          @"userName":
              ([[MASUser currentUser] userName] ? [[MASUser currentUser] userName] : @""),
          @"familyName":
              ([[MASUser currentUser] familyName] ? [[MASUser currentUser] familyName] : @""),
          @"givenName":
              ([[MASUser currentUser] givenName] ? [[MASUser currentUser] givenName] : @""),
          @"formattedName":
              ([[MASUser currentUser] formattedName] ? [[MASUser currentUser] formattedName] : @""),
          @"emailAddresses":
              ([[MASUser currentUser] emailAddresses] ?
               [[MASUser currentUser] emailAddresses] : [NSDictionary dictionary]),
          @"phoneNumbers":
              ([[MASUser currentUser] phoneNumbers] ?
               [[MASUser currentUser] phoneNumbers] : [NSDictionary dictionary]),
          @"addresses":
              ([[MASUser currentUser] addresses] ?
               [[MASUser currentUser] addresses] : [NSDictionary dictionary]),
          @"photos":
              ([[MASUser currentUser] photos] ?
               [self photosWithImgSrc:[[MASUser currentUser] photos]] : [NSDictionary dictionary]),
          @"active":[NSNumber numberWithBool:[[MASUser currentUser] active]],
          @"accessToken":
              ([[MASUser currentUser] accessToken] ? [[MASUser currentUser] accessToken] : @"")};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK   messageAsDictionary:currentUser];
    }
    else {
        
        NSDictionary *errorInfo = @{@"errorMessage":@"No authenticated user available"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }
    
    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)listAttributes:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result;
    if([MASUser currentUser])
    {
        
        NSDictionary *attribute = [[MASUser currentUser] _attributes];
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:attribute];
    }
    else {
        
        NSDictionary *errorInfo = @{@"errorMessage":@"No authenticated user available"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }
    
    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


///--------------------------------------
/// @name Current User - Lock/Unlock Session
///--------------------------------------

# pragma mark - Current User - Lock/Unlock Session

/**
 *  Lock current session
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)lockSession:(CDVInvokedUrlCommand*)command
{
    __block CDVPluginResult *result;
    
    if([MASUser currentUser]){
        
        if(![[MASUser currentUser] isSessionLocked]) {
            
            [[MASUser currentUser] lockSessionWithCompletion:
             ^(BOOL completed, NSError *error) {
                 
                 if (completed && !error) {
                     
                     result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                  messageAsBool:completed];
                 }
                 else if (error) {
                     
                     NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                                 @"errorMessage":[error localizedDescription],
                                                 @"errorInfo":[error userInfo]};
                     
                     result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                            messageAsDictionary:errorInfo];
                 }
                 
                 [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
             }];
        }
        else {
            
            NSDictionary *errorInfo = @{@"errorMessage":@"Session already locked",
                                        @"errorInfo":@"errorInfo"};
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                   messageAsDictionary:errorInfo];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }
    }
    else {
        
        NSDictionary *errorInfo = @{@"errorMessage":@"No session initialized",
                                    @"errorInfo":@"errorInfo"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                               messageAsDictionary:errorInfo];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}


/**
 *  Unlock current session
 *
 *  @param command CDInvokedUrlCommand object
 */

- (void)unlockSession:(CDVInvokedUrlCommand*)command
{
    __block CDVPluginResult *result;
    
    if([MASUser currentUser]){
        
        if([[MASUser currentUser] isSessionLocked]) {
            
            [[MASUser currentUser] unlockSessionWithCompletion:
             ^(BOOL completed, NSError *error) {
                 
                 if (completed && !error) {
                     
                     result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                  messageAsBool:completed];
                 }
                 else if (error) {
                     
                     NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                                 @"errorMessage":[error localizedDescription],
                                                 @"errorInfo":[error userInfo]};
                     
                     result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                            messageAsDictionary:errorInfo];
                 }
                 
                 [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
             }];
        }
        else {
            
            NSDictionary *errorInfo = @{@"errorMessage":@"Session is not locked",
                                        @"errorInfo":@"errorInfo"};
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                   messageAsDictionary:errorInfo];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }
    }
    else {
        
        NSDictionary *errorInfo = @{@"errorMessage":@"No session initialized",
                                    @"errorInfo":@"errorInfo"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                               messageAsDictionary:errorInfo];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}


/**
 *  Unlock current session with a custom message
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)unlockSessionWithMessage:(CDVInvokedUrlCommand*)command
{
    __block CDVPluginResult *result;
    
    if([MASUser currentUser]){
        
        if([[MASUser currentUser] isSessionLocked]) {
            
            NSString *promptMessage = [command.arguments objectAtIndex:0];
            [[MASUser currentUser] unlockSessionWithUserOperationPromptMessage:promptMessage
                                                                    completion:
             ^(BOOL completed, NSError *error) {
                 
                 if (completed && !error) {
                     
                     result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                  messageAsBool:completed];
                 }
                 else if (error) {
                     
                     NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                                 @"errorMessage":[error localizedDescription],
                                                 @"errorInfo":[error userInfo]};
                     
                     result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                            messageAsDictionary:errorInfo];
                 }
                 
                 [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
             }];
        }
        else {
            
            NSDictionary *errorInfo = @{@"errorMessage":@"Session is not locked",
                                        @"errorInfo":@"errorInfo"};
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                   messageAsDictionary:errorInfo];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }
    }
    else {
        
        NSDictionary *errorInfo = @{@"errorMessage":@"No session initialized",
                                    @"errorInfo":@"errorInfo"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                               messageAsDictionary:errorInfo];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}


/**
 *  Remove current session lock,
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)removeSessionLock:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result;
    
    if([MASUser currentUser]) {
        
        [[MASUser currentUser] removeSessionLock];
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                     messageAsBool:YES];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
    else {
        
        NSDictionary *errorInfo = @{@"errorMessage":@"No session initialized",
                                    @"errorInfo":@"errorInfo"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                               messageAsDictionary:errorInfo];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}


//--------------------------------------
/// @name Authentication
///--------------------------------------

# pragma mark - Authentication


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


- (void)loginWithIdTokenAndTokenType:(CDVInvokedUrlCommand*)command
{
    __block CDVPluginResult *result;
    
    NSString *idToken = @"";
    NSString *tokenType = @"";
    
    if (command.arguments.count>=2) {
        
        idToken = [command.arguments objectAtIndex:0];
        tokenType = [command.arguments objectAtIndex:1];
        
        [MASUser loginWithIdToken:idToken tokenType:tokenType completion:^(BOOL completed, NSError *error) {
            
            if (error) {
                
                NSDictionary *errorInfo = @{@"errorCode": [NSNumber numberWithInteger:[error code]],
                                            @"errorMessage":[error localizedDescription],
                                            @"errorInfo":[error userInfo]};
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
                
                return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Login with idToken and tokenType complete"];
            
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


- (void)loginWithAuthCode:(CDVInvokedUrlCommand*)command
{
    __block CDVPluginResult *result;
    
    NSString *authCode = @"";
    
    if (command.arguments.count>=1) {
        
        authCode = [command.arguments objectAtIndex:0];
        
        [MASUser loginWithAuthorizationCode:authCode
                                 completion:
         ^(BOOL completed, NSError *error) {
            
            if (error) {
                
                NSDictionary *errorInfo = @{@"errorCode": [NSNumber numberWithInteger:[error code]],
                                            @"errorMessage":[error localizedDescription],
                                            @"errorInfo":[error userInfo]};
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                       messageAsDictionary:errorInfo];
                
                return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                       messageAsString:@"Login with authorization code complete"];
            
            return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }];
    }
    else
    {
        NSDictionary *errorInfo = @{@"errorCode": [NSNumber numberWithInteger:1000],
                                    @"errorMessage":@"Invalid parameters. Please provide the valid inputs.",
                                    @"errorInfo":[NSDictionary dictionary]};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                               messageAsDictionary:errorInfo];
        
        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        
    }
}

- (void)loginWithAuthCredentialsUsernamePassword:(CDVInvokedUrlCommand *)command
{
    __block CDVPluginResult *result;
    
    NSString *username = [command.arguments objectAtIndex:0];
    NSString *password = [command.arguments objectAtIndex:1];
    
    if(username!=NULL && password!=NULL) {
        MASAuthCredentialsPassword *authCredentials = [MASAuthCredentialsPassword initWithUsername:username password:password];
        
        [MASUser loginWithAuthCredentials:authCredentials completion:^(BOOL completed, NSError * _Nullable error) {
            if(completed && !error) {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                           messageAsString:@"Login with authorization credentials complete"];
                
                return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }
            else {
                NSDictionary *errorInfo = @{@"errorCode": [NSNumber numberWithInteger:[error code]],
                                            @"errorMessage":[error localizedDescription],
                                            @"errorInfo":[NSDictionary dictionary]};
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                       messageAsDictionary:errorInfo];
                
                return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }
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

- (void)loginWithAuthCredentialsAuthCode:(CDVInvokedUrlCommand *)command
{
    __block CDVPluginResult *result;
    
    NSString *authorizationCode = [command.arguments objectAtIndex:0];
    
    if(authorizationCode!=NULL) {
        MASAuthCredentialsAuthorizationCode *authCredentials = [MASAuthCredentialsAuthorizationCode initWithAuthorizationCode:authorizationCode];
        [MASUser loginWithAuthCredentials:authCredentials completion:^(BOOL completed, NSError * _Nullable error) {
            if(completed && !error) {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                           messageAsString:@"Login with authorization credentials complete"];
                
                return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }
            else {
                NSDictionary *errorInfo = @{@"errorCode": [NSNumber numberWithInteger:[error code]],
                                            @"errorMessage":[error localizedDescription],
                                            @"errorInfo":[NSDictionary dictionary]};
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                       messageAsDictionary:errorInfo];
                
                return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }
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

- (void)loginWithAuthCredentialsJWT:(CDVInvokedUrlCommand*)command
{
    __block CDVPluginResult *result;
    
    NSString *jwt = [command.arguments objectAtIndex:0];
    NSString *tokenType = [command.arguments objectAtIndex:1];
    
    if(jwt!=NULL && tokenType!=NULL) {
        MASAuthCredentialsJWT *authCredentials = [MASAuthCredentialsJWT initWithJWT:jwt tokenType:tokenType];
        [MASUser loginWithAuthCredentials:authCredentials completion:^(BOOL completed, NSError * _Nullable error) {
            if(completed && !error) {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                           messageAsString:@"Login with authorization credentials complete"];
                
                return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }
            else {
                NSDictionary *errorInfo = @{@"errorCode": [NSNumber numberWithInteger:[error code]],
                                            @"errorMessage":[error localizedDescription],
                                            @"errorInfo":[NSDictionary dictionary]};
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                       messageAsDictionary:errorInfo];
                
                return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }
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


- (void)initializeBrowserBasedAuthentication:(CDVInvokedUrlCommand*)command
{
    __block CDVPluginResult *result;
    
    [MASUser initializeBrowserBasedAuthenticationWithCompletion:^(BOOL completed, NSError* error){
        if(error)
        {
            NSDictionary *errorInfo = @{@"errorCode": [NSNumber numberWithInteger:[error code]],
                                        @"errorMessage":[error localizedDescription],
                                        @"errorInfo":[error userInfo]};
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                   messageAsDictionary:errorInfo];
            
            return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                   messageAsString:@"Browser based authentication is Successful"];
        
        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}


- (void)requestUserInfo:(CDVInvokedUrlCommand*)command
{
    __block CDVPluginResult *result;
    
    if ([MASUser currentUser])
    {
        [[MASUser currentUser] requestUserInfoWithCompletion:
         ^(MASUser *user, NSError *error)
        {
            if (error) {
                
                NSDictionary *errorInfo = @{@"errorCode": [NSNumber numberWithInteger:[error code]],
                                            @"errorMessage":[error localizedDescription],
                                            @"errorInfo":[error userInfo]};
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                       messageAsDictionary:errorInfo];
                
                return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }
            
            NSDictionary *currentUser =
            @{@"isAuthenticated":[NSNumber numberWithBool:[user isAuthenticated]],
              @"userName":[user userName],
              @"active":[NSNumber numberWithBool:[user active]]};
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                   messageAsDictionary:currentUser];
            
            return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }];
    }
    else {
        
        NSDictionary *errorInfo = @{@"errorMessage":@"User has not been authenticated."};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
        
        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}


- (void)logoutUser:(CDVInvokedUrlCommand*)command
{
    __block CDVPluginResult *result;
    
    if ([MASUser currentUser])
    {
        [[MASUser currentUser] logoutWithCompletion:^(BOOL completed, NSError *error) {
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
    else {
        
        NSDictionary *errorInfo = @{@"errorMessage":@"User has not been authenticated."};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
        
        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}


- (void)getAuthCredentialsType:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result;
    
    NSString *authCredentialsType = [MASUser authCredentialsType];
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:authCredentialsType];
    
    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


///--------------------------------------
/// @name Utility
///--------------------------------------

# pragma mark - Utility

- (NSDictionary *)photosWithImgSrc:(NSDictionary*)uiimagePhotos {
    
    NSMutableDictionary *photosImgSrc = [NSMutableDictionary dictionary];
    
    if (uiimagePhotos && [[uiimagePhotos allKeys] count]) {
        
        for (NSString *key in [uiimagePhotos allKeys]) {
            
            NSString *base64String = @"data:image/png;base64,";
            NSData *pngData = UIImagePNGRepresentation([uiimagePhotos objectForKey:key]);
            base64String =
                [base64String stringByAppendingString:[pngData base64EncodedStringWithOptions:0]];
            [photosImgSrc setObject:base64String forKey:key];
        }
    }
    
    return photosImgSrc;
}


@end
