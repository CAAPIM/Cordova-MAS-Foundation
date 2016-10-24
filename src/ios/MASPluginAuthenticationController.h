//
//  MASPluginAuthenticationController.h
//
//  Copyright (c) 2016 CA, Inc.
//
//  This software may be modified and distributed under the terms
//  of the MIT license. See the LICENSE file for details.
//

#import <Foundation/Foundation.h>

#import <Cordova/CDV.h>
#import <MASFoundation/MASFoundation.h>



@interface MASPluginAuthenticationController : CDVPlugin



#pragma mark - Lifecycle

/**
 *  Singlenton instance of the MASPluginAuthenticationController
 *
 *  @return Singlenton instance of the MASPluginAuthenticationController
 */
+ (instancetype)sharedAuthController;


- (NSDictionary *)setLoginBlocksWithAuthentiationProviders:(MASAuthenticationProviders *)providers
                                   basicCredentialsBlock__:(MASBasicCredentialsBlock)basicCredentialsBlock
                                  authorizationCodeBlock__:(MASAuthorizationCodeCredentialsBlock)authorizationCodeBlock
                                         removeQRCodeBlock:(MASCompletionErrorBlock)removeQRCodeBlock
                                completeAuthorizationBlock:(MASCompletionErrorBlock)completeAuthorization;


- (void)completeAuthenticationWithUserName:(NSString *)userName andPassword:(NSString *)password;


- (void)cancelAuthentication;


- (void)authorizeQRCode:(NSString *)code completion:(MASCompletionErrorBlock) completion;



@end
