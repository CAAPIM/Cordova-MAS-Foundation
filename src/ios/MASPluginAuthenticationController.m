//
//  MASPluginAuthenticationController.m
//
//  Copyright (c) 2016 CA, Inc.
//
//  This software may be modified and distributed under the terms
//  of the MIT license. See the LICENSE file for details.
//

#import "MASPluginAuthenticationController.h"


static NSString *const MASCurrentAuthProviderIdentifiers = @"idps";
static NSString *const MASQRCodeImageBase64String = @"qrCodeImageBase64";
static NSString *const MASUIAuthenticationProviderQrCodeImageKey = @"qrcode";
static MASPluginAuthenticationController *_sharedAuthController = nil;


@interface MASPluginAuthenticationController ()


///--------------------------------------
/// @name Properties
///-------------------------------------

# pragma mark - Properties

@property (nonatomic, copy) MASAuthorizationCodeCredentialsBlock authorizationCodeBlock;
@property (nonatomic, copy) MASBasicCredentialsBlock basicCredentialsBlock;
@property (nonatomic, copy) MASCompletionErrorBlock removeQRCodeBlock;
@property (nonatomic, copy) MASCompletionErrorBlock completeAuthorizationBlock;

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


- (NSDictionary *)setLoginBlocksWithAuthentiationProviders:(MASAuthenticationProviders *)providers
                                   basicCredentialsBlock__:(MASBasicCredentialsBlock)basicCredentialsBlock
                                  authorizationCodeBlock__:(MASAuthorizationCodeCredentialsBlock)authorizationCodeBlock
                                         removeQRCodeBlock:(MASCompletionErrorBlock)removeQRCodeBlock
                                completeAuthorizationBlock:(MASCompletionErrorBlock)completeAuthorization
{
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
    self.basicCredentialsBlock = basicCredentialsBlock;
    self.authorizationCodeBlock = authorizationCodeBlock;
    
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
    
    return [NSDictionary dictionaryWithObjectsAndKeys:idps, MASCurrentAuthProviderIdentifiers,
            qrCodeImageBase64, MASQRCodeImageBase64String, nil];
}

- (void)completeAuthenticationWithUserName:(NSString *)userName andPassword:(NSString *)password
{
    if (self.basicCredentialsBlock) {
        
        self.basicCredentialsBlock(userName, password, NO, nil);
        
        [self qrCodeCleanup];
    }
}


- (void)cancelAuthentication
{
    if (self.basicCredentialsBlock) {
        
        self.basicCredentialsBlock(nil, nil, YES, nil);
        
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
    
    self.authorizationCodeBlock(authorizationCode, NO, ^(BOOL completed, NSError *error) {
                                    
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
    if (self.removeQRCodeBlock) {
        
        self.removeQRCodeBlock(YES, nil);
        
        [self qrCodeCleanup];
    }
}

- (void)qrCodeCleanup {
    
    if (_qrCode) {
        
        [[NSNotificationCenter defaultCenter] removeObserver:self
                                                        name:MASProximityLoginQRCodeDidStopDisplayingQRCodeImage
                                                      object:nil];
        
        [_qrCode stopDisplayingQRCodeImageForProximityLogin];
        
        _qrCode = nil;
    }
}


- (void)authorizeQRCode:(NSString *)code completion:(MASCompletionErrorBlock) completion {
    
    [MASProximityLoginQRCode authorizeAuthenticateUrl:code completion:completion];
}


@end