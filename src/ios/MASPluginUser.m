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


- (void)currentUser:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result;
    
    if([MASUser currentUser])
    {
        NSDictionary *currentUser =
        @{@"isAuthenticated":[NSNumber numberWithBool:[[MASUser currentUser] isAuthenticated]],
          @"userName":[[MASUser currentUser] userName],
          @"active":[NSNumber numberWithBool:[[MASUser currentUser] active]]};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK   messageAsDictionary:currentUser];
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


- (void)loginWithAuthorizationCode:(CDVInvokedUrlCommand*)command
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


- (void)logoutUser:(CDVInvokedUrlCommand *)command
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


@end
