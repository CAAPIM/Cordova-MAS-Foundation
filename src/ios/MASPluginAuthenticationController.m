/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

//  MASPluginAuthenticationController.m

#import "MASPluginAuthenticationController.h"

#import <SafariServices/SafariServices.h>


static NSString *const MASCurrentAuthProviderIdentifiers = @"providers";
static NSString *const MASQRCodeImageBase64String = @"qrCodeImageBase64";
static NSString *const MASUIAuthenticationProviderQrCodeImageKey = @"qrcode";
static MASPluginAuthenticationController *_sharedAuthController = nil;


@interface MASPluginAuthenticationController ()
    <MASAuthorizationResponseDelegate,SFSafariViewControllerDelegate>
    
    
    ///--------------------------------------
    /// @name Properties
    ///-------------------------------------
    
# pragma mark - Properties
    
    @property (nonatomic, copy) MASAuthCredentialsBlock authCredentialsBlock;
    @property (nonatomic, copy) MASCompletionErrorBlock removeQRCodeBlock;
    @property (nonatomic, copy) MASCompletionErrorBlock completeAuthorizationBlock;
    @property (nonatomic, copy) MASCompletionErrorBlock completeSocialLoginBlock;
    
    @property (nonatomic, copy) NSArray *authenticationProviders;
    @property (nonatomic, copy) NSString *availableProvider;
    @property (nonatomic, strong) MASAuthenticationProvider *qrCodeProvider;
    
    @property (nonatomic, strong) MASProximityLoginQRCode *qrCode;
    
    @property (nonatomic, strong) NSString *callbackId;
    
    @end

@implementation MASPluginAuthenticationController
    
    
#pragma mark - Initialization methods
    
+ (instancetype)sharedAuthController
    {
        static dispatch_once_t onceToken;
        
        if (!_sharedAuthController) {
            
            dispatch_once(&onceToken, ^{
                
                _sharedAuthController = [[MASPluginAuthenticationController alloc] init];
            });
        }
        
        return _sharedAuthController;
    }
    
    
- (NSDictionary *)setLoginBlocksWithAuthenticationProviders:(MASAuthenticationProviders *)providers
                                       authCredentialsBlock:(MASAuthCredentialsBlock)authCredentialsBlock
                                          removeQRCodeBlock:(MASCompletionErrorBlock)removeQRCodeBlock
                                 completeAuthorizationBlock:(MASCompletionErrorBlock)completeAuthorization
    {
        //
        // Set the login block for basic credentials and authorization with the available providers
        //
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didReceiveAuthorizationCodeFromSessionSharing:)
                                                     name:MASDeviceDidReceiveAuthorizationCodeFromProximityLoginNotification
                                                   object:nil];
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(removeQRCode:)
                                                     name:MASProximityLoginQRCodeDidStopDisplayingQRCodeImage
                                                   object:nil];
        
        MASAuthenticationProvider *qrCodeAuthenticationProvider;
        NSMutableArray *mutableCopy = [NSMutableArray new];
        NSMutableArray *idps = [NSMutableArray new];
        for(MASAuthenticationProvider *provider in providers.providers)
        {
            if([provider.identifier isEqualToString:MASUIAuthenticationProviderQrCodeImageKey])
            {
                qrCodeAuthenticationProvider = provider;
                continue;
            }
            
            [idps addObject:provider.identifier];
            [mutableCopy addObject:provider];
        }
        
        self.removeQRCodeBlock = removeQRCodeBlock;
        self.completeAuthorizationBlock = completeAuthorization;
        self.authCredentialsBlock = authCredentialsBlock;
        
        self.authenticationProviders = mutableCopy;
        self.qrCodeProvider = qrCodeAuthenticationProvider;
        self.availableProvider = providers.idp;
        
        NSString *qrCodeImageBase64;
        if (_qrCodeProvider)
        {
            [[MASDevice currentDevice] startAsBluetoothCentralWithAuthenticationProvider:_qrCodeProvider];
            
            if (_qrCode == nil)
            {
                _qrCode = [[MASProximityLoginQRCode alloc] initWithAuthenticationProvider:_qrCodeProvider];
                
                UIImage *qrCodeImage = [_qrCode startDisplayingQRCodeImageForProximityLogin];
                qrCodeImageBase64 = [UIImagePNGRepresentation(qrCodeImage) base64EncodedStringWithOptions:0];
            }
        }
        
        NSDictionary *resultDictionary = [NSDictionary dictionaryWithObjectsAndKeys:@"Login", @"requestType", @"2", @"requestId", self.availableProvider, @"idp", idps, MASCurrentAuthProviderIdentifiers, qrCodeImageBase64, MASQRCodeImageBase64String, nil];
        
        return [NSDictionary dictionaryWithObjectsAndKeys:resultDictionary, @"result", nil];
    }
    
- (void)completeAuthenticationWithUserName:(NSString *)userName andPassword:(NSString *)password completion:(MASCompletionErrorBlock)completion
    {
        //
        // Complete the authentication with a username and password
        //
        
        if (self.authCredentialsBlock) {
            MASAuthCredentialsPassword *authCredentials = [MASAuthCredentialsPassword initWithUsername:userName password:password];
            
            self.authCredentialsBlock(authCredentials, NO, ^(BOOL completed, NSError * _Nullable error) {
                if(error) {
                    completion(completed, error);
                }
                else {
                    [self qrCodeCleanup];
                    completion(completed, error);
                }
            });
            
        }
    }
    
    
- (void)cancelAuthentication
    {
        //
        // Cancel the authentication
        //
        
        if (self.authCredentialsBlock) {
            
            self.authCredentialsBlock(nil, YES, nil);
            
            [self qrCodeCleanup];
        }
    }
    
    
- (void)didReceiveAuthorizationCodeFromSessionSharing:(NSNotification *)notification
    {
        
        NSString *authorizationCode = [notification.object objectForKey:@"code"];
        
        //
        // Stop QR Code session sharing
        //
        [self qrCodeCleanup];
        
        self.completeAuthorizationBlock(YES, nil);
        
        MASAuthCredentialsAuthorizationCode *authCode = [MASAuthCredentialsAuthorizationCode initWithAuthorizationCode:authorizationCode];
        
        self.authCredentialsBlock(authCode, NO, ^(BOOL completed, NSError * _Nullable error) {
            
            //
            // Ensure this code runs in the main UI thread
            //
            dispatch_async(dispatch_get_main_queue(), ^
                           {
                               //
                               // Handle the error
                               //
                               if(error)
                               {
                                   // TODO: Handle error
                                   
                                   return;
                               }
                           });
        });
    }
    
- (void)removeQRCode:(NSNotification *)notification
    {
        //
        // Remove the QR code block
        //
        
        if (self.removeQRCodeBlock) {
            
            self.removeQRCodeBlock(YES, nil);
            
            [self qrCodeCleanup];
        }
    }
    
- (void)qrCodeCleanup {
    
    //
    // Stop displaying QR code
    //
    
    NSNotificationCenter *notificationCenter = [NSNotificationCenter defaultCenter];
    [notificationCenter removeObserver:self
                                  name:MASDeviceDidReceiveAuthorizationCodeFromProximityLoginNotification
                                object:nil];
    
    [notificationCenter removeObserver:self
                                  name:MASProximityLoginQRCodeDidStopDisplayingQRCodeImage
                                object:nil];
    
    if (_qrCode) {
        
        [_qrCode stopDisplayingQRCodeImageForProximityLogin];
        
        _qrCode = nil;
    }
}
    
    
- (void)authorizeQRCode:(NSString *)code completion:(MASCompletionErrorBlock) completion {
    //
    // Authorize the QR code
    //
    
    [MASProximityLoginQRCode authorizeAuthenticateUrl:code completion:completion];
}
    
    
    ///--------------------------------------
    /// @name Social Login
    ///--------------------------------------
    
# pragma mark - Social Login
    
- (void)doSocialLoginWith:(NSString *)authProviderId
        topViewController:(UIViewController *)tvc
               completion:(MASCompletionErrorBlock _Nullable)completion
{
    
    self.completeSocialLoginBlock = completion;
    
    if (!self.authenticationProviders) {
        
        MASAuthenticationProvider *qrCodeAuthenticationProvider;
        NSMutableArray *mutableCopy = [NSMutableArray new];
        NSMutableArray *idps = [NSMutableArray new];
        
        MASAuthenticationProviders *providers = [MASAuthenticationProviders currentProviders];
        for(MASAuthenticationProvider *provider in providers.providers)
        {
            if([provider.identifier isEqualToString:MASUIAuthenticationProviderQrCodeImageKey])
            {
                qrCodeAuthenticationProvider = provider;
                continue;
            }
            
            [idps addObject:provider.identifier];
            [mutableCopy addObject:provider];
        }
        
        self.authenticationProviders = mutableCopy;
        self.qrCodeProvider = qrCodeAuthenticationProvider;
        self.availableProvider = providers.idp;
    }
    
    for (MASAuthenticationProvider *provider in self.authenticationProviders) {
        
        //
        // Retrieve the authenticatin provider
        //
        if (provider.identifier == authProviderId) {
            
            //
            // Check if selected provider is available
            //
            if (![[self.availableProvider lowercaseString] isEqualToString:@"all"] &&
                ![provider.identifier isEqualToString:self.availableProvider])
            {
                //
                // If not all is available and the selected one is not the one that is available, skip
                //
                NSMutableDictionary *errorInfo = [NSMutableDictionary new];
                errorInfo[NSLocalizedDescriptionKey] =
                NSLocalizedString(@"AuthProviderNotFound", @"AuthProviderNotFound");
                
                NSError *error =
                [NSError errorWithDomain:MASFoundationErrorDomain
                                    code:MASFoundationErrorCodeUnknown userInfo:errorInfo];
                
                completion(NO, error);
            }
            
            //
            // if the authentication provider exists
            //
            if (provider)
            {
                SFSafariViewController *viewController = [[SFSafariViewController alloc] initWithURL:provider.authenticationUrl];
                
                [viewController setDelegate:self];
                
                [[MASAuthorizationResponse sharedInstance] setDelegate:self];
                
                //
                // Show the controller
                //
                [tvc presentViewController:viewController animated:YES completion:nil];
            }
        }
    }
}
    
    
# pragma mark - MASAuthorizationResponseDelegate
    
- (void)didReceiveError:(NSError *)error
{
    //
    // Complete Social Login Block
    //
    //
    self.completeSocialLoginBlock(NO, error);
}
    
    
- (void)didReceiveAuthorizationCode:(NSString *)code
{
    if (_authCredentialsBlock)
    {
        MASAuthCredentialsAuthorizationCode * authCode = [MASAuthCredentialsAuthorizationCode initWithAuthorizationCode:code];
        _authCredentialsBlock(authCode, NO, ^(BOOL completed, NSError *error) {
            
            if (self.completeSocialLoginBlock)
            {
                self.completeSocialLoginBlock(completed, error);
            }
        });
    }
    else {
        
        [MASUser loginWithAuthorizationCode:code
                                 completion:
         ^(BOOL completed, NSError *error) {
            
            if (self.completeSocialLoginBlock)
            {
                self.completeSocialLoginBlock(completed, error);
            }
        }];
    }
}
    
    
#pragma mark - SFSafariViewControllerDelegate
    
- (void)safariViewControllerDidFinish:(SFSafariViewController *)controller {

    
     NSMutableDictionary *errorInfo = [NSMutableDictionary new];
     errorInfo[NSLocalizedDescriptionKey] =
         NSLocalizedString(@"User cancelled social login", @"User cancelled social login");
    
     NSError *error =
     [NSError errorWithDomain:MASFoundationErrorDomain
                         code:MASFoundationErrorCodeUnknown userInfo:errorInfo];
    
    self.completeSocialLoginBlock(NO, error);
}
    
    
@end
