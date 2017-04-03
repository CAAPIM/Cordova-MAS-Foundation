/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

//  MASPluginAuthenticationController.h

#import <Foundation/Foundation.h>

#import <Cordova/CDV.h>
#import <MASFoundation/MASFoundation.h>



@interface MASPluginAuthenticationController : CDVPlugin



#pragma mark - Lifecycle

/**
 *  Singleton instance of the MASPluginAuthenticationController
 *
 *  @return Singleton instance of the MASPluginAuthenticationController
 */
+ (instancetype)sharedAuthController;

/**
 *  Set the login block with the available authentication providers
 */
- (NSDictionary *)setLoginBlocksWithAuthentiationProviders:(MASAuthenticationProviders *)providers
                                   basicCredentialsBlock__:(MASBasicCredentialsBlock)basicCredentialsBlock
                                  authorizationCodeBlock__:(MASAuthorizationCodeCredentialsBlock)authorizationCodeBlock
                                         removeQRCodeBlock:(MASCompletionErrorBlock)removeQRCodeBlock
                                completeAuthorizationBlock:(MASCompletionErrorBlock)completeAuthorization;

/**
 *  Complete Authentication with username and password
 */
- (void)completeAuthenticationWithUserName:(NSString *)userName andPassword:(NSString *)password;

/**
 *  Cancel the authentication request
 */
- (void)cancelAuthentication;

/**
 *  Authorize with QR code
 */
- (void)authorizeQRCode:(NSString *)code completion:(MASCompletionErrorBlock) completion;


///--------------------------------------
/// @name Social Login
///--------------------------------------
    
# pragma mark - Social Login
    
- (void)doSocialLoginWith:(NSString *)authProviderId
        topViewController:(UIViewController *)tvc
               completion:(MASCompletionErrorBlock _Nullable)completion;



@end
