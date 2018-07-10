/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

//
//  MASPluginMAS.m
//


#import "MASPluginMAS.h"

#import "MASPluginAuthenticationController.h"

#import <MASFoundation/MASFoundation.h>

#if defined(__has_include)
#if __has_include(<MASUI/MASUI.h>)
#import <MASUI/MASUI.h>
#endif
#endif

#import "WebViewController.h"

#import <SafariServices/SafariServices.h>


@interface MASPluginMAS()
    
    
    ///--------------------------------------
    /// @name Private Properties
    ///-------------------------------------
    
# pragma mark - Private Properties
    
    @property (nonatomic, copy) MASOTPGenerationBlock otpGenerationBlock;
    
    
    @property (nonatomic, copy) MASOTPFetchCredentialsBlock otpBlock;
    
    
    @property (nonatomic, copy) NSArray* currentEnterpriseApps;
    
    @end


@implementation MASPluginMAS
    
    
    ///--------------------------------------
    /// @name Properties
    ///--------------------------------------
    
# pragma mark - Properties
    
- (void)setConfigFileName:(CDVInvokedUrlCommand*)command
    {
        //
        // Set the configuration file name
        // Default is msso_config.json
        //
        
        CDVPluginResult *result;
        
        NSString *fileName = @"msso_config";
        
        if (command.arguments.count>0) {
            
            fileName = [command.arguments objectAtIndex:0];
        }
        
        [MAS setConfigurationFileName:fileName];
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Config file name is set"];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
    
    
- (void)setGrantFlow:(CDVInvokedUrlCommand*)command
    {
        //
        // Set the grant flow
        // Password or Client credentials
        //
        
        CDVPluginResult *result;
        
        NSNumber *grantFlowType = [NSNumber numberWithInteger:0];
        
        MASGrantFlow grantFlow;
        
        if (command.arguments.count>0) {
            
            grantFlowType = [command.arguments objectAtIndex:0];
        }
        
        grantFlow = [grantFlowType integerValue];
        
        [MAS setGrantFlow:grantFlow];
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Grant flow is set"];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        
    }
    
    
- (void)useNativeMASUI:(CDVInvokedUrlCommand*)command
    {
        CDVPluginResult *result;
        
        SEL selector = NSSelectorFromString(@"setWillHandleAuthentication:");
        if([MAS respondsToSelector:selector])
        {
            IMP imp = [MAS methodForSelector:selector];
            __block void (*setWillHandleAuthentication)(id, SEL, BOOL) = (void *)imp;
            
            setWillHandleAuthentication([MAS class], selector, YES);
        }
        
        selector = NSSelectorFromString(@"setWillHandleOTPAuthentication:");
        if([MAS respondsToSelector:selector])
        {
            IMP imp = [MAS methodForSelector:selector];
            __block void (*setWillHandleOTPAuthentication)(id, SEL, BOOL) = (void *)imp;
            
            setWillHandleOTPAuthentication([MAS class], selector, YES);
        }
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Using native MASUI"];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }

- (void)getMASState:(CDVInvokedUrlCommand *)command
    {
        CDVPluginResult *result;
        MASState masState = [MAS MASState];
        NSString *currentState;
        switch (masState) {
            case MASStateNotConfigured:
                currentState = @"MASStateNotConfigured";
                break;
                
            case MASStateNotInitialized:
                currentState = @"MASStateNotInitialized";
                break;
                
            case MASStateDidLoad:
                currentState = @"MASStateDidLoad";
                break;
                
            case MASStateWillStart:
                currentState = @"MASStateWillStart";
                break;
                
            case MASStateDidStart:
                currentState = @"MASStateDidStart";
                break;
                
            case MASStateWillStop:
                currentState = @"MASStateWillStop";
                break;
                
            case MASStateDidStop:
                currentState = @"MASStateDidStop";
                break;
                
            case MASStateIsBeingStopped:
                currentState = @"MASStateIsBeingStopped";
                break;
                
            default:
                break;
        }
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:currentState];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }


- (void)enableBrowserBasedAuthentication:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result;
    BOOL enable = YES;
    [MAS enableBrowserBasedAuthentication:enable];
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Browser Based Authentication is enabled"];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

    
    ///--------------------------------------
    /// @name Authentication Listeners
    ///--------------------------------------
    
# pragma mark - Authentication Listeners
    
- (void)setAuthenticationListener:(CDVInvokedUrlCommand*)command
    {
        //
        // Set an authentication listener that waits for a user login call
        //
        
        __block CDVPluginResult *result;
        
        SEL selector = NSSelectorFromString(@"setWillHandleAuthentication:");
        if([MAS respondsToSelector:selector])
        {
            IMP imp = [MAS methodForSelector:selector];
            __block void (*setWillHandleAuthentication)(id, SEL, BOOL) = (void *)imp;
            
            setWillHandleAuthentication([MAS class], selector, NO);
        }
        
        selector = NSSelectorFromString(@"setWillHandleOTPAuthentication:");
        if([MAS respondsToSelector:selector])
        {
            IMP imp = [MAS methodForSelector:selector];
            __block void (*setWillHandleOTPAuthentication)(id, SEL, BOOL) = (void *)imp;
            
            setWillHandleOTPAuthentication([MAS class], selector, NO);
        }
        
        [MAS setUserAuthCredentials:^(MASAuthCredentialsBlock  _Nonnull authCredentialBlock) {
            MASPluginAuthenticationController *MPAuthCntrl = [MASPluginAuthenticationController sharedAuthController];
            NSDictionary *resultDictionary = [MPAuthCntrl setLoginBlocksWithAuthenticationProviders:[MASAuthenticationProviders currentProviders]
                                                                               authCredentialsBlock:authCredentialBlock
                                                                                  removeQRCodeBlock:^(BOOL completed, NSError *error){
                                                                                    if (completed) {
                                                                                        
                                                                                        [self removeQRCode:command.callbackId];
                                                                                    }
                                                                                 }
                                                                         completeAuthorizationBlock:^(BOOL completed, NSError *error){
                                                                            
                                                                            [self completeAuthorization:command.callbackId];
                                                                        }];
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:resultDictionary];
            
            [result setKeepCallbackAsBool:YES];
            
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            
        }];
    }
    
    
- (void)completeAuthentication:(CDVInvokedUrlCommand *)command
    {
        //
        // Complete the authentication process with credentials
        //
        
        __block CDVPluginResult *result;
        
        MASPluginAuthenticationController *MPAuthCntrl = [MASPluginAuthenticationController sharedAuthController];
        [MPAuthCntrl completeAuthenticationWithUserName:command.arguments[0] andPassword:command.arguments[1] completion:^(BOOL completed, NSError * _Nullable error) {
            if(error) {
                NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                            @"errorMessage":[error localizedDescription],
                                            @"errorInfo":[error userInfo]};

                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
            }
            else {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Login successful"];
            }
            
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }];
    }
    
    
- (void)cancelAuthentication:(CDVInvokedUrlCommand *)command
    {
        //
        // Cancel the authentication process
        //
        
        CDVPluginResult *result;
        
        MASPluginAuthenticationController *MPAuthCntrl = [MASPluginAuthenticationController sharedAuthController];
        [MPAuthCntrl cancelAuthentication];
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"BasicCredentialsBlock cancelled"];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
    
    
    ///--------------------------------------
    /// @name OTP Listeners
    ///--------------------------------------
    
# pragma mark - OTP Listeners
    
- (void)setOTPChannelSelectorListener:(CDVInvokedUrlCommand*)command
    {
        //
        // Set the OTP Channel selection listener
        //
        
        __block CDVPluginResult *result;
        
        [MAS setOTPChannelSelectionBlock:
         ^(NSArray *supportedOTPChannels, MASOTPGenerationBlock otpGenerationBlock){
             
             self.otpGenerationBlock = otpGenerationBlock;
             
             result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[NSDictionary dictionaryWithObjectsAndKeys:[NSDictionary dictionaryWithObjectsAndKeys:supportedOTPChannels, @"channels", nil], @"result", nil]];
             
             [result setKeepCallbackAsBool:YES];
             
             [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
         }];
    }
    
    
- (void)generateAndSendOTP:(CDVInvokedUrlCommand*)command {
    
    //
    // Generate the OTP
    //
    
    __block CDVPluginResult *result;
    
    if (self.otpGenerationBlock) {
        
        self.otpGenerationBlock(command.arguments[0], NO, ^(BOOL completed, NSError * _Nullable error) {
            if(error) {
                NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                            @"errorMessage":[error localizedDescription]};
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
                
                return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }
            else {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:NO];
                
                [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }
        });
    }
}
    
    
- (void)cancelGenerateAndSendOTP:(CDVInvokedUrlCommand*)command {
    //
    // Cancel the OTP request
    //
    
    CDVPluginResult *result;
    
    if (self.otpGenerationBlock) {
        
        self.otpGenerationBlock(nil, YES, nil);
    }
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"OTP Channels Cancelled"];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}
    
    
- (void)setOTPAuthenticationListener:(CDVInvokedUrlCommand*)command
    {
        //
        // Set the OTP Authentication Listener which waits for an OTP request
        //
        
        __block CDVPluginResult *result;
        
        [MAS setOTPCredentialsBlock:^(MASOTPFetchCredentialsBlock otpBlock, NSError *otpError){
            
            self.otpBlock = otpBlock;
            
            NSString *isInvalidOtp = nil;
            if(otpError.code == 160104) {
                isInvalidOtp = @"false";
            }
            else {
                isInvalidOtp = @"true";
            }
            
            NSDictionary *errorDictionary = [NSDictionary dictionaryWithObjectsAndKeys:isInvalidOtp, @"isInvalidOtp", [otpError localizedDescription], @"errorMessage", nil];
            NSDictionary *resultDictionary = [NSDictionary dictionaryWithObjectsAndKeys: errorDictionary, @"result", nil];
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:resultDictionary];
            
            [result setKeepCallbackAsBool:YES];
            
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }];
    }
    
    
- (void)validateOTP:(CDVInvokedUrlCommand*)command {
    //
    // Validate the OTP
    //
    
    CDVPluginResult *result;
    
    if (self.otpBlock) {
        
        self.otpBlock(command.arguments[0], NO, nil);
    }
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"OTP Sent"];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}
    
    
- (void)cancelOTPValidation:(CDVInvokedUrlCommand*)command {
    //
    // Cancel the OTP Validation request
    //
    
    CDVPluginResult *result;
    
    if (self.otpBlock) {
        
        self.otpBlock(nil, YES, nil);
    }
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"OTP Cancelled"];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}
    
    
    ///--------------------------------------
    /// @name Start & Stop
    ///--------------------------------------
    
# pragma mark - Start & Stop
    
- (void)start:(CDVInvokedUrlCommand*)command
    {
        //
        // Start the MAS SDK
        // Returns error info if it fails
        //
        __block CDVPluginResult *result;
        
        [MAS start:^(BOOL completed, NSError *error) {
            if (error) {
                
                NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                            @"errorMessage":[error localizedDescription],
                                            @"errorInfo":[error userInfo]};
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
                
                return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Start complete"];
            
            return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }];
    }
    
    
- (void)startWithDefaultConfiguration:(CDVInvokedUrlCommand*)command
    {
        //
        // Start the MAS SDK with the default msso configuration
        // Returns error info if it fails
        //
        
        __block CDVPluginResult *result;
        
        if ([command.arguments count] > 0 && [command.arguments count] == 1)
        {
            BOOL defaultConfiguration = [[command.arguments objectAtIndex:0] boolValue];
            
            [MAS startWithDefaultConfiguration:defaultConfiguration completion:^(BOOL completed, NSError *error) {
                if (error) {
                    
                    NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                                @"errorMessage":[error localizedDescription],
                                                @"errorInfo":[error userInfo]};
                    
                    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
                    
                    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                }
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Start complete"];
                
                return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }];
        }
    }
    
    
- (void)startWithJSON:(CDVInvokedUrlCommand*)command
    {
        //
        // Start the MAS SDK with the a custom msso configuration
        // Returns error info if it fails
        //
        
        __block CDVPluginResult *result;
        
        if ([command.arguments count] > 0 && [command.arguments count] == 1)
        {
            NSDictionary *jsonObject = [[command.arguments objectAtIndex:0] isKindOfClass:[NSNull class]] ? nil : [command.arguments objectAtIndex:0];
            
            [MAS startWithJSON:jsonObject completion:^(BOOL completed, NSError *error) {
                if (error) {
                    
                    NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                                @"errorMessage":[error localizedDescription],
                                                @"errorInfo":[error userInfo]};
                    
                    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
                    
                    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                }
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Start complete"];
                
                return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }];
        }
    }
    
    
- (void)startWithURL:(CDVInvokedUrlCommand*)command
    {
        //
        // TODO
        //
        __block CDVPluginResult *result;
        
        if ([command.arguments count] > 0 && [command.arguments count] == 1)
        {
            NSString *urlString = [command.arguments objectAtIndex:0];
            NSURL *url = [NSURL URLWithString:urlString];
            if(url && url.scheme && url.host) {
                [MAS startWithURL:url completion:^(BOOL completed, NSError * error) {
                    if (error) {
                        
                        NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                                    @"errorMessage":[error localizedDescription],
                                                    @"errorInfo":[error userInfo]};
                        
                        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
                        
                        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                    }
                    
                    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Start complete"];
                    
                    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                }];
            }
            else {
                NSDictionary *errorInfo = @{@"errorMessage":@"Invalid URL"};
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
                
                return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }
        }
    }
    
    
- (void)stop:(CDVInvokedUrlCommand*)command
    {
        //
        // Stop the MAS SDK
        //
        
        __block CDVPluginResult *result;
        
        [MAS stop:^(BOOL completed, NSError *error) {
            
            if (error) {
                
                NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                            @"errorMessage":[error localizedDescription],
                                            @"errorInfo":[error userInfo]};
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
                
                return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Stop complete"];
            
            return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }];
    }


    ///--------------------------------------
    /// @name Security Configuration
    ///--------------------------------------

- (void)setSecurityConfiguration:(CDVInvokedUrlCommand *)command
{
    CDVPluginResult *result;
    
    NSDictionary *securityConfig = [command.arguments objectAtIndex:0];
    NSURL *url = nil;
    NSString *host = [securityConfig objectForKey:@"host"];
    if(![host isEqualToString:@""])
    {
        url = [NSURL URLWithString:host];
    }
    else
    {
        NSDictionary *errorInfo = @{@"errorMessage":@"Missing host"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
        
        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
    
    MASSecurityConfiguration *securityConfiguration = [[MASSecurityConfiguration alloc] initWithURL:url];
    
    if([[securityConfig objectForKey:@"isPublic"] isEqualToString:@"true"])
        securityConfiguration.isPublic = YES;
    if([[securityConfig objectForKey:@"trustPublicPKI"] isEqualToString:@"true"])
        securityConfiguration.trustPublicPKI = YES;
    if(![[[securityConfig objectForKey:@"publicKeyHashes"] objectAtIndex:0] isEqualToString:@""])
        securityConfiguration.publicKeyHashes = [securityConfig objectForKey:@"publicKeyHashes"];
    if(![[[securityConfig objectForKey:@"certificates"] objectAtIndex:0] isEqualToString:@""])
        securityConfiguration.certificates = [securityConfig objectForKey:@"certificates"];
    
    NSError *error = nil;
    [MASConfiguration setSecurityConfiguration:securityConfiguration error:&error];
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Security configuration set"];
    
    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

    ///--------------------------------------
    /// @name Gateway Monitoring
    ///--------------------------------------
    
# pragma mark - Gateway Monitoring
    
- (void)gatewayIsReachable:(CDVInvokedUrlCommand*)command
    {
        //
        // Check if gateway is reachable
        //
        
        CDVPluginResult *result;
        
        if ([MAS gatewayIsReachable])
        {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:[MAS gatewayIsReachable]];
        }
        else {
            
            NSDictionary *errorInfo = @{@"errorMessage":@"NO"};

            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                   messageAsDictionary:errorInfo];
        }
        
        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
    
    
    ///--------------------------------------
    /// @name HTTP Requests
    ///--------------------------------------
    
# pragma mark - HTTP Requests
    
- (void)getFromPath:(CDVInvokedUrlCommand*)command
    {
        //
        // Make a get call with parameters, headers, request type, response type
        //
        
        __block CDVPluginResult *result;
        
        NSString *path = @"";
        NSDictionary *parametersInfo = nil;
        NSDictionary *headersInfo = nil;
        MASRequestResponseType requestType = MASRequestResponseTypeJson;
        MASRequestResponseType responseType = MASRequestResponseTypeJson;
        BOOL isPublic = NO;
        
        if (command.arguments.count>0 && command.arguments.count==6)
        {
            //
            // Path
            //
            path = [command.arguments objectAtIndex:0];
            
            //
            // parameters
            //
            if ([[command.arguments objectAtIndex:1] isKindOfClass:[NSDictionary class]])
            {
                parametersInfo = [command.arguments objectAtIndex:1];
            }
            
            //
            // headers
            //
            if ([[command.arguments objectAtIndex:2] isKindOfClass:[NSDictionary class]])
            {
                headersInfo = [command.arguments objectAtIndex:2];
            }
            
            //
            // request type
            //
            if ([command.arguments objectAtIndex:3] && [command.arguments objectAtIndex:3] != [NSNull null]) {
                requestType = [[command.arguments objectAtIndex:3] intValue];
            }
            
            //
            // response type
            //
            if ([command.arguments objectAtIndex:4] && [command.arguments objectAtIndex:4] != [NSNull null]) {
                responseType = [[command.arguments objectAtIndex:4] intValue];
            }
            
            //
            // is public server
            //
            if ([command.arguments objectAtIndex:5] && [command.arguments objectAtIndex:5] != [NSNull null]) {
                isPublic = ([[command.arguments objectAtIndex:5] isEqualToString:@"true"])? YES : NO;
            }
            
            [MAS getFrom:path
          withParameters:parametersInfo
              andHeaders:headersInfo
             requestType:requestType
            responseType:responseType
                isPublic:isPublic
              completion:^(NSDictionary *responseInfo, NSError *error) {
                  
                  //
                  // Error case
                  //
                  if (error) {
                      
                      //
                      // There is an issue when the error userInfo dictionary contains non-serializable data such as NSData for plain text response.
                      // As MASFoundation returns plain text response as NSData, in MASPlugin level, the data should be converted into NSString.
                      //
                      NSMutableDictionary *errorUserInfoCopy = [[error userInfo] mutableCopy];
                      
                      //
                      // Only for the case where userInfo object contains response body, and the data type is NSData
                      //
                      if ([[errorUserInfoCopy allKeys] containsObject:MASResponseInfoBodyInfoKey] && [errorUserInfoCopy[MASResponseInfoBodyInfoKey] isKindOfClass:[NSData class]])
                      {
                          errorUserInfoCopy[MASResponseInfoBodyInfoKey] = [[NSString alloc] initWithData:errorUserInfoCopy[MASResponseInfoBodyInfoKey] encoding:NSUTF8StringEncoding];
                      }
                      
                      NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                                  @"errorMessage":[error localizedDescription],
                                                  @"errorInfo":errorUserInfoCopy};
                      
                      result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
                      
                      return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                  }
                  
                  NSMutableDictionary *newResult = [NSMutableDictionary dictionary];
                  
                  //
                  // For the same reason as Cordova Framework crashes when we pass non-serializable raw data as dictionary.
                  // Check if the response body is NSData type, and convert it into NSString.
                  //
                  if ([responseInfo[MASResponseInfoBodyInfoKey] isKindOfClass:[NSData class]])
                  {
                      NSString *responseBody = [[NSString alloc] initWithData:responseInfo[MASResponseInfoBodyInfoKey] encoding:NSUTF8StringEncoding];
                      
                      [newResult setObject:responseBody forKey:MASResponseInfoBodyInfoKey];
                      [newResult setObject:responseInfo[MASResponseInfoHeaderInfoKey] forKey:MASResponseInfoHeaderInfoKey];
                  }
                  else {
                      newResult = [responseInfo mutableCopy];
                  }
                  
                  result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:newResult];
                  
                  return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                  
              }];
        }
    }
    
    
- (void)deleteFromPath:(CDVInvokedUrlCommand*)command
    {
        //
        // Make a delete call with parameters, headers, request type and response type
        //
        
        __block CDVPluginResult *result;
        
        NSString *path = @"";
        NSDictionary *parametersInfo = @{};
        NSDictionary *headersInfo = @{};
        MASRequestResponseType requestType = MASRequestResponseTypeJson;
        MASRequestResponseType responseType = MASRequestResponseTypeJson;
        BOOL isPublic = NO;
        
        if (command.arguments.count>0 && command.arguments.count==6)
        {
            //
            // Path
            //
            path = [command.arguments objectAtIndex:0];
            
            //
            // parameters
            //
            if ([[command.arguments objectAtIndex:1] isKindOfClass:[NSDictionary class]])
            {
                parametersInfo = [command.arguments objectAtIndex:1];
            }
            
            //
            // headers
            //
            if ([[command.arguments objectAtIndex:2] isKindOfClass:[NSDictionary class]])
            {
                headersInfo = [command.arguments objectAtIndex:2];
            }
            
            //
            // request type
            //
            if ([command.arguments objectAtIndex:3] && [command.arguments objectAtIndex:3] != [NSNull null]) {
                requestType = [[command.arguments objectAtIndex:3] intValue];
            }
            
            //
            // response type
            //
            if ([command.arguments objectAtIndex:4] && [command.arguments objectAtIndex:4] != [NSNull null]) {
                responseType = [[command.arguments objectAtIndex:4] intValue];
            }
            
            //
            // is public server
            //
            if ([command.arguments objectAtIndex:5] && [command.arguments objectAtIndex:5] != [NSNull null]) {
                isPublic = ([[command.arguments objectAtIndex:5] isEqualToString:@"true"])? YES : NO;
            }
            
            [MAS deleteFrom:path
             withParameters:parametersInfo
                 andHeaders:headersInfo
                requestType:requestType
               responseType:responseType
                   isPublic:isPublic
                 completion:^(NSDictionary *responseInfo, NSError *error) {
                     
                     //
                     // Error case
                     //
                     if (error) {
                         
                         //
                         // There is an issue when the error userInfo dictionary contains non-serializable data such as NSData for plain text response.
                         // As MASFoundation returns plain text response as NSData, in MASPlugin level, the data should be converted into NSString.
                         //
                         NSMutableDictionary *errorUserInfoCopy = [[error userInfo] mutableCopy];
                         
                         //
                         // Only for the case where userInfo object contains response body, and the data type is NSData
                         //
                         if ([[errorUserInfoCopy allKeys] containsObject:MASResponseInfoBodyInfoKey] && [errorUserInfoCopy[MASResponseInfoBodyInfoKey] isKindOfClass:[NSData class]])
                         {
                             errorUserInfoCopy[MASResponseInfoBodyInfoKey] = [[NSString alloc] initWithData:errorUserInfoCopy[MASResponseInfoBodyInfoKey] encoding:NSUTF8StringEncoding];
                         }
                         
                         NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                                     @"errorMessage":[error localizedDescription],
                                                     @"errorInfo":errorUserInfoCopy};
                         
                         result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
                         
                         return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                     }
                     
                     NSMutableDictionary *newResult = [NSMutableDictionary dictionary];
                     
                     //
                     // For the same reason as Cordova Framework crashes when we pass non-serializable raw data as dictionary.
                     // Check if the response body is NSData type, and convert it into NSString.
                     //
                     if ([responseInfo[MASResponseInfoBodyInfoKey] isKindOfClass:[NSData class]])
                     {
                         NSString *responseBody = [[NSString alloc] initWithData:responseInfo[MASResponseInfoBodyInfoKey] encoding:NSUTF8StringEncoding];
                         
                         [newResult setObject:responseBody forKey:MASResponseInfoBodyInfoKey];
                         [newResult setObject:responseInfo[MASResponseInfoHeaderInfoKey] forKey:MASResponseInfoHeaderInfoKey];
                     }
                     else {
                         newResult = [responseInfo mutableCopy];
                     }
                     
                     result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:newResult];
                     
                     return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                     
                 }];
        }
    }
    
    
- (void)postToPath:(CDVInvokedUrlCommand*)command
    {
        //
        // Make a post call with parameters, headers, request type and response type
        //
        
        __block CDVPluginResult *result;
        
        NSString *path = @"";
        NSDictionary *parametersInfo = @{};
        NSDictionary *headersInfo = @{};
        MASRequestResponseType requestType = MASRequestResponseTypeJson;
        MASRequestResponseType responseType = MASRequestResponseTypeJson;
        BOOL isPublic = NO;
        
        if (command.arguments.count>0 && command.arguments.count==6)
        {
            //
            // Path
            //
            path = [command.arguments objectAtIndex:0];
            
            //
            // parameters
            //
            if ([[command.arguments objectAtIndex:1] isKindOfClass:[NSDictionary class]])
            {
                parametersInfo = [command.arguments objectAtIndex:1];
            }
            
            //
            // headers
            //
            if ([[command.arguments objectAtIndex:2] isKindOfClass:[NSDictionary class]])
            {
                headersInfo = [command.arguments objectAtIndex:2];
            }
            
            //
            // request type
            //
            if ([command.arguments objectAtIndex:3] && [command.arguments objectAtIndex:3] != [NSNull null]) {
                requestType = [[command.arguments objectAtIndex:3] intValue];
            }
            
            //
            // response type
            //
            if ([command.arguments objectAtIndex:4] && [command.arguments objectAtIndex:4] != [NSNull null]) {
                responseType = [[command.arguments objectAtIndex:4] intValue];
            }
            
            //
            //
            //
            if ([command.arguments objectAtIndex:5] && [command.arguments objectAtIndex:5] != [NSNull null]) {
                isPublic = ([[command.arguments objectAtIndex:5] isEqualToString:@"true"])? YES : NO;
            }
            
            [MAS postTo:path
         withParameters:parametersInfo
             andHeaders:headersInfo
            requestType:requestType
           responseType:responseType
               isPublic:isPublic
             completion:^(NSDictionary *responseInfo, NSError *error) {
                 
                 //
                 // Error case
                 //
                 if (error) {
                     
                     //
                     // There is an issue when the error userInfo dictionary contains non-serializable data such as NSData for plain text response.
                     // As MASFoundation returns plain text response as NSData, in MASPlugin level, the data should be converted into NSString.
                     //
                     NSMutableDictionary *errorUserInfoCopy = [[error userInfo] mutableCopy];
                     
                     //
                     // Only for the case where userInfo object contains response body, and the data type is NSData
                     //
                     if ([[errorUserInfoCopy allKeys] containsObject:MASResponseInfoBodyInfoKey] && [errorUserInfoCopy[MASResponseInfoBodyInfoKey] isKindOfClass:[NSData class]])
                     {
                         errorUserInfoCopy[MASResponseInfoBodyInfoKey] = [[NSString alloc] initWithData:errorUserInfoCopy[MASResponseInfoBodyInfoKey] encoding:NSUTF8StringEncoding];
                     }
                     
                     NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                                 @"errorMessage":[error localizedDescription],
                                                 @"errorInfo":errorUserInfoCopy};
                     
                     result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
                     
                     return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                 }
                 
                 NSMutableDictionary *newResult = [NSMutableDictionary dictionary];
                 
                 //
                 // For the same reason as Cordova Framework crashes when we pass non-serializable raw data as dictionary.
                 // Check if the response body is NSData type, and convert it into NSString.
                 //
                 if ([responseInfo[MASResponseInfoBodyInfoKey] isKindOfClass:[NSData class]])
                 {
                     NSString *responseBody = [[NSString alloc] initWithData:responseInfo[MASResponseInfoBodyInfoKey] encoding:NSUTF8StringEncoding];
                     
                     [newResult setObject:responseBody forKey:MASResponseInfoBodyInfoKey];
                     [newResult setObject:responseInfo[MASResponseInfoHeaderInfoKey] forKey:MASResponseInfoHeaderInfoKey];
                 }
                 else {
                     newResult = [responseInfo mutableCopy];
                 }
                 
                 result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:newResult];
                 
                 return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                 
             }];
        }
    }
    
    
- (void)putToPath:(CDVInvokedUrlCommand*)command
    {
        //
        // Make a put call with parameters, headers, request type and response type
        //
        
        __block CDVPluginResult *result;
        
        NSString *path = @"";
        NSDictionary *parametersInfo = @{};
        NSDictionary *headersInfo = @{};
        MASRequestResponseType requestType = MASRequestResponseTypeJson;
        MASRequestResponseType responseType = MASRequestResponseTypeJson;
        BOOL isPublic = NO;
        
        if (command.arguments.count>0 && command.arguments.count==6)
        {
            //
            // Path
            //
            path = [command.arguments objectAtIndex:0];
            
            //
            // parameters
            //
            if ([[command.arguments objectAtIndex:1] isKindOfClass:[NSDictionary class]])
            {
                parametersInfo = [command.arguments objectAtIndex:1];
            }
            
            //
            // headers
            //
            if ([[command.arguments objectAtIndex:2] isKindOfClass:[NSDictionary class]])
            {
                headersInfo = [command.arguments objectAtIndex:2];
            }
            
            //
            // request type
            //
            if ([command.arguments objectAtIndex:3] && [command.arguments objectAtIndex:3] != [NSNull null]) {
                requestType = [[command.arguments objectAtIndex:3] intValue];
            }
            
            //
            // response type
            //
            if ([command.arguments objectAtIndex:4] && [command.arguments objectAtIndex:4] != [NSNull null]) {
                responseType = [[command.arguments objectAtIndex:4] intValue];
            }
            
            //
            // is public server
            //
            if ([command.arguments objectAtIndex:5] && [command.arguments objectAtIndex:5] != [NSNull null]) {
                isPublic = ([[command.arguments objectAtIndex:5] isEqualToString:@"true"])? YES : NO;
            }
            
            [MAS putTo:path
        withParameters:parametersInfo
            andHeaders:headersInfo
           requestType:requestType
          responseType:responseType
              isPublic:isPublic
            completion:^(NSDictionary *responseInfo, NSError *error) {
                
                //
                // Error case
                //
                if (error) {
                    
                    //
                    // There is an issue when the error userInfo dictionary contains non-serializable data such as NSData for plain text response.
                    // As MASFoundation returns plain text response as NSData, in MASPlugin level, the data should be converted into NSString.
                    //
                    NSMutableDictionary *errorUserInfoCopy = [[error userInfo] mutableCopy];
                    
                    //
                    // Only for the case where userInfo object contains response body, and the data type is NSData
                    //
                    if ([[errorUserInfoCopy allKeys] containsObject:MASResponseInfoBodyInfoKey] && [errorUserInfoCopy[MASResponseInfoBodyInfoKey] isKindOfClass:[NSData class]])
                    {
                        errorUserInfoCopy[MASResponseInfoBodyInfoKey] = [[NSString alloc] initWithData:errorUserInfoCopy[MASResponseInfoBodyInfoKey] encoding:NSUTF8StringEncoding];
                    }
                    
                    NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                                @"errorMessage":[error localizedDescription],
                                                @"errorInfo":errorUserInfoCopy};
                    
                    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
                    
                    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                }
                
                NSMutableDictionary *newResult = [NSMutableDictionary dictionary];
                
                //
                // For the same reason as Cordova Framework crashes when we pass non-serializable raw data as dictionary.
                // Check if the response body is NSData type, and convert it into NSString.
                //
                if ([responseInfo[MASResponseInfoBodyInfoKey] isKindOfClass:[NSData class]])
                {
                    NSString *responseBody = [[NSString alloc] initWithData:responseInfo[MASResponseInfoBodyInfoKey] encoding:NSUTF8StringEncoding];
                    
                    [newResult setObject:responseBody forKey:MASResponseInfoBodyInfoKey];
                    [newResult setObject:responseInfo[MASResponseInfoHeaderInfoKey] forKey:MASResponseInfoHeaderInfoKey];
                }
                else {
                    newResult = [responseInfo mutableCopy];
                }
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:newResult];
                
                return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                
            }];
        }
    }
    
    
- (void)patchToPath:(CDVInvokedUrlCommand*)command
    {
        //
        // Make a patch call with parameters, headers, request type and response type
        //
        
        __block CDVPluginResult *result;
        
        NSString *path = @"";
        NSDictionary *parametersInfo = @{};
        NSDictionary *headersInfo = @{};
        MASRequestResponseType requestType = MASRequestResponseTypeJson;
        MASRequestResponseType responseType = MASRequestResponseTypeJson;
        BOOL isPublic = NO;
        
        if (command.arguments.count>0 && command.arguments.count==6)
        {
            //
            // Path
            //
            path = [command.arguments objectAtIndex:0];
            
            //
            // parameters
            //
            if ([[command.arguments objectAtIndex:1] isKindOfClass:[NSDictionary class]])
            {
                parametersInfo = [command.arguments objectAtIndex:1];
            }
            
            //
            // headers
            //
            if ([[command.arguments objectAtIndex:2] isKindOfClass:[NSDictionary class]])
            {
                headersInfo = [command.arguments objectAtIndex:2];
            }
            
            //
            // request type
            //
            if ([command.arguments objectAtIndex:3] && [command.arguments objectAtIndex:3] != [NSNull null]) {
                requestType = [[command.arguments objectAtIndex:3] intValue];
            }
            
            //
            // response type
            //
            if ([command.arguments objectAtIndex:4] && [command.arguments objectAtIndex:4] != [NSNull null]) {
                responseType = [[command.arguments objectAtIndex:4] intValue];
            }
            
            //
            // is public server
            //
            if ([command.arguments objectAtIndex:5] && [command.arguments objectAtIndex:5] != [NSNull null]) {
                isPublic = ([[command.arguments objectAtIndex:5] isEqualToString:@"true"])? YES : NO;
            }
            
            [MAS patchTo:path
          withParameters:parametersInfo
              andHeaders:headersInfo
             requestType:requestType
            responseType:responseType
                isPublic:isPublic
              completion:^(NSDictionary *responseInfo, NSError *error) {
                  
                  //
                  // Error case
                  //
                  if (error) {
                      
                      //
                      // There is an issue when the error userInfo dictionary contains non-serializable data such as NSData for plain text response.
                      // As MASFoundation returns plain text response as NSData, in MASPlugin level, the data should be converted into NSString.
                      //
                      NSMutableDictionary *errorUserInfoCopy = [[error userInfo] mutableCopy];
                      
                      //
                      // Only for the case where userInfo object contains response body, and the data type is NSData
                      //
                      if ([[errorUserInfoCopy allKeys] containsObject:MASResponseInfoBodyInfoKey] && [errorUserInfoCopy[MASResponseInfoBodyInfoKey] isKindOfClass:[NSData class]])
                      {
                          errorUserInfoCopy[MASResponseInfoBodyInfoKey] = [[NSString alloc] initWithData:errorUserInfoCopy[MASResponseInfoBodyInfoKey] encoding:NSUTF8StringEncoding];
                      }
                      
                      NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                                  @"errorMessage":[error localizedDescription],
                                                  @"errorInfo":errorUserInfoCopy};
                      
                      result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
                      
                      return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                  }
                  
                  NSMutableDictionary *newResult = [NSMutableDictionary dictionary];
                  
                  //
                  // For the same reason as Cordova Framework crashes when we pass non-serializable raw data as dictionary.
                  // Check if the response body is NSData type, and convert it into NSString.
                  //
                  if ([responseInfo[MASResponseInfoBodyInfoKey] isKindOfClass:[NSData class]])
                  {
                      NSString *responseBody = [[NSString alloc] initWithData:responseInfo[MASResponseInfoBodyInfoKey] encoding:NSUTF8StringEncoding];
                      
                      [newResult setObject:responseBody forKey:MASResponseInfoBodyInfoKey];
                      [newResult setObject:responseInfo[MASResponseInfoHeaderInfoKey] forKey:MASResponseInfoHeaderInfoKey];
                  }
                  else {
                      newResult = [responseInfo mutableCopy];
                  }
                  
                  result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:newResult];
                  
                  return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                  
              }];
        }
    }
    
    
    ///--------------------------------------
    /// @name Proximity Login
    ///--------------------------------------
    
# pragma mark - Proximity Login
    
- (void)authorizeQRCode:(CDVInvokedUrlCommand *)command
    {
        //
        //  Authorize using QR code
        //
        
        __block CDVPluginResult *result;
        
        MASPluginAuthenticationController *MPAuthCntrl = [MASPluginAuthenticationController sharedAuthController];
        [MPAuthCntrl authorizeQRCode:command.arguments[0]
                          completion:^(BOOL completed, NSError *error) {
                              
                              if (!completed && error) {
                                  
                                  NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                                              @"errorMessage":[error localizedDescription]};
                                  
                                  result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
                              }
                              else {
                                  
                                  result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                             messageAsString:@"QRCode authorized successfully !!"];
                              }
                              
                              return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                          }];
    }
    
    
- (void)completeAuthorization:(NSString *)callbackId {
    
    //
    // Complete the QR code authorization
    //
    
    CDVPluginResult *result;
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[NSDictionary dictionaryWithObjectsAndKeys:[NSDictionary dictionaryWithObjectsAndKeys:@"qrCodeAuthorizationComplete", @"requestType", nil], @"result", nil]];
    
    [result setKeepCallbackAsBool:YES];
    
    [self.commandDelegate sendPluginResult:result callbackId:callbackId];
}
    
    
- (void)removeQRCode:(NSString *)callbackId {
    
    //
    // Remove the QR code
    //
    
    CDVPluginResult *result;
    NSLog(@"%@", [MAS gatewayMonitoringStatusAsString]);
    if ([MAS gatewayIsReachable]) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[NSDictionary dictionaryWithObjectsAndKeys:[NSDictionary dictionaryWithObjectsAndKeys:@"removeQRCode", @"requestType", nil], @"result", nil]];
    }
    else {
        NSDictionary *errorInfo = @{@"errorMessage": [NSString stringWithFormat:@"Unable to resolve host \"%@\": No address associated with hostname", [[MASConfiguration currentConfiguration] gatewayHostName]]};
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[NSDictionary dictionaryWithObjectsAndKeys:[NSDictionary dictionaryWithObjectsAndKeys:@"qrCodeAuthorizationComplete", @"requestType", nil], @"result", errorInfo, @"error", nil]];
    }
    
    [result setKeepCallbackAsBool:YES];
    
    [self.commandDelegate sendPluginResult:result callbackId:callbackId];
}
    
    
    ///--------------------------------------
    /// @name Social Login
    ///--------------------------------------
    
# pragma mark - Social Login
    
- (void)doSocialLogin:(CDVInvokedUrlCommand *)command {
    
    __block CDVPluginResult *result;
    
    NSString *authProviderId = [command.arguments objectAtIndex:0];
    
    [[MASPluginAuthenticationController sharedAuthController]
     doSocialLoginWith:authProviderId
     topViewController:self.viewController
     completion:^(BOOL completed, NSError *error) {
         
         if (completed && !error) {
             
             result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
             
             [result setKeepCallbackAsBool:YES];
         }
         else {
             
             NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                         @"errorMessage":[error localizedDescription]};
             
             result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
         }
         
         [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
         
         [self.viewController dismissViewControllerAnimated:YES completion:nil];
     }];
}

    ///--------------------------------------
    /// @name Proof Key for Code Exchange (PKCE)
    ///--------------------------------------

# pragma mark - Proof Key for Code Exchange

/**
 *  Checks if PKCE is enabled
 *
 *  @param command CDInvokedUrlCommand object
 */

- (void)isPKCEEnabled:(CDVInvokedUrlCommand *)command {
    
    CDVPluginResult *result;
    
    BOOL isPKCEEnabled = [MAS isPKCEEnabled];
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:isPKCEEnabled];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

/**
 *  Enables PKCE
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)enablePKCE:(CDVInvokedUrlCommand *)command {
    
    CDVPluginResult *result;
    
    if([[command.arguments objectAtIndex:0] isEqualToString:@"true"]) {
        [MAS enablePKCE:YES];
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"PKCE Enabled"];
    }
    else {
        [MAS enablePKCE:NO];
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"PKCE Disabled"];
    }
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

    ///--------------------------------------
    /// @name JWT Signing
    ///--------------------------------------

# pragma mark - JWT Signing

/**
 *  Signs MASClaims with a default private key
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)signWithClaims:(CDVInvokedUrlCommand *)command {
    
    CDVPluginResult *result;
    NSError *customClaimsError, *error;
    NSMutableDictionary *claimsDictionary = [command.arguments objectAtIndex:0];
    NSString *privateKeyString, *jwt;
    NSData *privateKey;
    MASClaims *claims = [MASClaims claims];
    if(!([claimsDictionary isKindOfClass:[NSDictionary class]])) {
        NSDictionary *errorInfo = @{@"errorCode": [NSNumber numberWithInteger:-1],
                                    @"errorMessage":@"Invalid claims provided",
                                    @"errorInfo":[NSDictionary dictionary]};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
        
        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
    
    if([claimsDictionary objectForKey:@"aud"])
        claims.aud = [claimsDictionary objectForKey:@"aud"];
    if([claimsDictionary objectForKey:@"jti"])
        claims.jti = [claimsDictionary objectForKey:@"jti"];
    if([claimsDictionary objectForKey:@"sub"])
        claims.sub = [claimsDictionary objectForKey:@"sub"];
    if([claimsDictionary objectForKey:@"iss"])
        claims.iss = [claimsDictionary objectForKey:@"iss"];
    if([claimsDictionary objectForKey:@"iat"])
        claims.iat = [claimsDictionary objectForKey:@"iat"];
    if([claimsDictionary objectForKey:@"exp"])
        claims.exp = [claimsDictionary objectForKey:@"exp"];
    if([claimsDictionary objectForKey:@"nbf"])
        claims.nbf = [claimsDictionary objectForKey:@"nbf"];
    if([claimsDictionary objectForKey:@"content"])
        claims.content = [claims objectForKey:@"content"];
    if([claimsDictionary objectForKey:@"contentType"])
        claims.contentType = [claimsDictionary objectForKey:@"contentType"];
    if([claimsDictionary objectForKey:@"customClaims"])
        [claims setValue:[claimsDictionary objectForKey:@"customClaims"] forClaimKey:@"customClaims" error:&customClaimsError];
    
    if(command.arguments.count > 1) {
        privateKeyString = [command.arguments objectAtIndex:1];
        if(![privateKeyString isEqualToString:@""])
            privateKey = [privateKeyString dataUsingEncoding:NSUTF8StringEncoding];
    }
    if(!(privateKey))
        jwt = [MAS signWithClaims:claims error:&error];
    else
        jwt = [MAS signWithClaims:claims privateKey:privateKey error:&error];
    
    if(!error) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:jwt];
        
        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
    else {
        NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                    @"errorMessage":[error localizedDescription],
                                    @"errorInfo":[error userInfo]};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
        
        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}

    @end
