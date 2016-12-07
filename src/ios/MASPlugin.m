/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

//
//  MASPlugin.m
//


#import "MASPlugin.h"

#import "MASPluginAuthenticationController.h"

#import <MASFoundation/MASFoundation.h>

#if defined(__has_include)
#if __has_include(<MASUI/MASUI.h>)
#import <MASUI/MASUI.h>
#endif
#endif

#import "WebViewController.h"


@interface MASPlugin()


///--------------------------------------
/// @name Properties
///-------------------------------------

# pragma mark - Properties

@property (nonatomic, copy) MASOTPGenerationBlock otpGenerationBlock;


@property (nonatomic, copy) MASOTPFetchCredentialsBlock otpBlock;


@property (nonatomic, copy) NSArray* currentEnterpriseApps;

@end


@implementation MASPlugin

- (void)pluginInitialize
{

}

- (void)useNativeMASUI:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result;
    
    SEL selector = NSSelectorFromString(@"setWillHandleAuthentication:");
    if([MAS respondsToSelector:selector])
    {
        IMP imp = [MAS methodForSelector:selector];
        __block void (*setWillHandleOTPAuthentication)(id, SEL, BOOL) = (void *)imp;
        
        setWillHandleOTPAuthentication([MAS class], selector, YES);
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
        __block void (*setWillHandleOTPAuthentication)(id, SEL, BOOL) = (void *)imp;
        
        setWillHandleOTPAuthentication([MAS class], selector, NO);
    }
    
    selector = NSSelectorFromString(@"setWillHandleOTPAuthentication:");
    if([MAS respondsToSelector:selector])
    {
        IMP imp = [MAS methodForSelector:selector];
        __block void (*setWillHandleOTPAuthentication)(id, SEL, BOOL) = (void *)imp;
        
        setWillHandleOTPAuthentication([MAS class], selector, NO);
    }
    
    [MAS setUserLoginBlock:
     ^(MASBasicCredentialsBlock basicBlock,
       MASAuthorizationCodeCredentialsBlock authorizationCodeBlock) {
         
         MASPluginAuthenticationController *MPAuthCntrl = [MASPluginAuthenticationController sharedAuthController];
         
         //
         // This is the block that gets called when a login call is made
         //
         
         NSDictionary *resultDictionary =
            [MPAuthCntrl setLoginBlocksWithAuthentiationProviders:[MASAuthenticationProviders currentProviders]
                                          basicCredentialsBlock__:basicBlock
                                         authorizationCodeBlock__:authorizationCodeBlock
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
    
    CDVPluginResult *result;
    
    MASPluginAuthenticationController *MPAuthCntrl = [MASPluginAuthenticationController sharedAuthController];    
    [MPAuthCntrl completeAuthenticationWithUserName:command.arguments[0] andPassword:command.arguments[1]];
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"BasicCredentialsBlock called"];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
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

- (void)completeAuthorization:(NSString *)callbackId {
    
    //
    // Complete the QR code authorization
    //
    
    CDVPluginResult *result;
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"qrCodeAuthorizationComplete"];

    [result setKeepCallbackAsBool:YES];
    
    [self.commandDelegate sendPluginResult:result callbackId:callbackId];
}

- (void)removeQRCode:(NSString *)callbackId {
    
    //
    // Remove the QR code
    //
    
    CDVPluginResult *result;
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"removeQRCode"];

    [result setKeepCallbackAsBool:YES];
    
    [self.commandDelegate sendPluginResult:result callbackId:callbackId];
}

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


- (void)setOTPChannelSelectorListener:(CDVInvokedUrlCommand*)command
{
    //
    // Set the OTP Channel selection listener
    //
    
    __block CDVPluginResult *result;
    
    [MAS setOTPChannelSelectionBlock:
     ^(NSArray *supportedOTPChannels, MASOTPGenerationBlock otpGenerationBlock){
        
         self.otpGenerationBlock = otpGenerationBlock;
         
         result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:supportedOTPChannels];
         
         [result setKeepCallbackAsBool:YES];
         
         [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}


- (void)generateAndSendOTP:(CDVInvokedUrlCommand*)command {
    
    //
    // Generate the OTP
    //
    
    CDVPluginResult *result;
    
    if (self.otpGenerationBlock) {
        
        self.otpGenerationBlock(command.arguments[0], NO, nil);
    }
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:NO];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)cancelGenerateAndSendOTP:(CDVInvokedUrlCommand*)command {
    //
    // Cancel the OTP request
    //
    
    CDVPluginResult *result;
    
    if (self.otpGenerationBlock) {
        
        self.otpGenerationBlock(nil, YES, nil);
    }
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"OTP Channels Cancelled"];
    
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
        
         NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[otpError code]],
                                    @"errorMessage":[otpError localizedDescription],
                                    @"errorInfo":[otpError userInfo]};
        
         result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:errorInfo];
         
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
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"OTP Cancelled"];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


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

    if (command.arguments.count>0 && command.arguments.count==5)
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

        [MAS getFrom:path
      withParameters:parametersInfo
          andHeaders:headersInfo
         requestType:requestType
        responseType:responseType
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

    if (command.arguments.count>0 && command.arguments.count==5)
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

        [MAS deleteFrom:path
         withParameters:parametersInfo
             andHeaders:headersInfo
            requestType:requestType
           responseType:responseType
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

    if (command.arguments.count>0 && command.arguments.count==5)
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

        [MAS postTo:path
     withParameters:parametersInfo
         andHeaders:headersInfo
        requestType:requestType
       responseType:responseType
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

    if (command.arguments.count>0 && command.arguments.count==5)
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

        [MAS putTo:path
    withParameters:parametersInfo
        andHeaders:headersInfo
       requestType:requestType
      responseType:responseType
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

    if (command.arguments.count>0 && command.arguments.count==5)
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

        [MAS patchTo:path
      withParameters:parametersInfo
          andHeaders:headersInfo
         requestType:requestType
        responseType:responseType
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

- (void)isSessionLocked:(CDVInvokedUrlCommand*)command {
    //
    // Check if session is locked
    //
    
    CDVPluginResult *result;
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                 messageAsBool:[[MASUser currentUser] isSessionLocked]];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)lockSession:(CDVInvokedUrlCommand*)command {
    //
    // Lock current session
    //
    
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

- (void)unlockSession:(CDVInvokedUrlCommand*)command {
    //
    // Unlock current session
    //
    
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

- (void)unlockSessionWithMessage:(CDVInvokedUrlCommand*)command {
    //
    // Unlock current session with a custom message
    //
    
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

- (void)removeSessionLock:(CDVInvokedUrlCommand*)command {
    //
    // Remove current session lock, if present
    //
    
    CDVPluginResult *result;
    
    [[MASUser currentUser] removeSessionLock];
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                 messageAsBool:YES];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)loginWithUsernameAndPassword:(CDVInvokedUrlCommand*)command
{
    //
    // Login with username and password as parameters
    // Returns error info if it fails
    //
    
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


- (void)deregister:(CDVInvokedUrlCommand*)command
{
    //
    // Deregister the device from the server
    // Returns error info if it fails
    //
    
    __block CDVPluginResult *result;

    if ([MASDevice currentDevice])
    {
        [[MASDevice currentDevice] deregisterWithCompletion:^(BOOL completed, NSError *error) {

            if (error) {

                NSDictionary *errorInfo = @{@"errorCode": [NSNumber numberWithInteger:[error code]],
                                            @"errorMessage":[error localizedDescription],
                                            @"errorInfo":[error userInfo]};

                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];

                return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }

            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Deregister complete"];

            return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }];
    }
    else {

        NSDictionary *errorInfo = @{@"errorMessage":@"SDK has not properly initialized"};

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];

        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}


- (void)logoutUser:(CDVInvokedUrlCommand *)command
{
    //
    // Logout the user
    // Returns error info if it fails
    //

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

- (void)getCurrentProviders:(CDVInvokedUrlCommand*)command
{
    //
    // Get a list of login providers
    //

	CDVPluginResult *result;

    NSArray *listOfProviders = [[MASAuthenticationProviders currentProviders] providers];
    NSMutableArray *providersJson = nil;
    if(listOfProviders) {
        for(id object in listOfProviders)
        {
            MASAuthenticationProvider *provider = object;
            NSMutableDictionary *entry = [[NSMutableDictionary alloc] init];
            
            [entry setObject:[provider identifier] forKey:@"identifier"];
            [entry setObject:[provider authenticationUrl] forKey:@"authUrl"];
            [entry setObject:[provider pollUrl] forKey:@"pollUrl"];
            [entry setObject:[NSNumber numberWithBool:[provider isGoogle]] forKey:@"isGoogle"];
            [entry setObject:[NSNumber numberWithBool:[provider isFacebook]] forKey:@"isFacebook"];
            [entry setObject:[NSNumber numberWithBool:[provider isLinkedIn]] forKey:@"isLinkedIn"];
            [entry setObject:[NSNumber numberWithBool:[provider isQrCode]] forKey:@"isQrCode"];
            [entry setObject:[NSNumber numberWithBool:[provider isEnterprise]] forKey:@"isEnterprise"];
            [entry setObject:[NSNumber numberWithBool:[provider isSalesforce]] forKey:@"isSalesforce"];
            [providersJson addObject:entry];
        }
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:providersJson];
    }
    else {
        NSDictionary *errorInfo = @{@"errorMessage":@"No providers found"};
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }

	return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)retrieveAuthenticationProviderForProximityLogin:(CDVInvokedUrlCommand*)command
{
    //
    // Get a list of proximity providers
    //
    
	CDVPluginResult *result;

	MASAuthenticationProvider *proximityProvider = [[MASAuthenticationProviders currentProviders] retrieveAuthenticationProviderForProximityLogin];
    NSMutableDictionary *entry = [[NSMutableDictionary alloc] init];
    if(proximityProvider){
        [entry setObject:[proximityProvider identifier] forKey:@"identifier"];
        [entry setObject:[proximityProvider authenticationUrl] forKey:@"authUrl"];
        [entry setObject:[proximityProvider pollUrl] forKey:@"pollUrl"];
        [entry setObject:[NSNumber numberWithBool:[proximityProvider isGoogle]] forKey:@"isGoogle"];
        [entry setObject:[NSNumber numberWithBool:[proximityProvider isFacebook]] forKey:@"isFacebook"];
        [entry setObject:[NSNumber numberWithBool:[proximityProvider isLinkedIn]] forKey:@"isLinkedIn"];
        [entry setObject:[NSNumber numberWithBool:[proximityProvider isQrCode]] forKey:@"isQrCode"];
        [entry setObject:[NSNumber numberWithBool:[proximityProvider isEnterprise]] forKey:@"isEnterprise"];
        [entry setObject:[NSNumber numberWithBool:[proximityProvider isSalesforce]] forKey:@"isSalesforce"];
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:entry];
    }
    
    else {
        NSDictionary *errorInfo = @{@"errorMessage":@"No proximity provider found"};
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }
    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)getCurrentDevice:(CDVInvokedUrlCommand*)command
{
    //
    // Get details of the current device
    // Returns device identifier
    //
    
    CDVPluginResult *result;

    if ([MASDevice currentDevice])
    {
        NSDictionary *currentDevice = @{@"isRegistered": [NSNumber numberWithBool:[[MASDevice currentDevice] isRegistered]],
                                          @"identifier":[[MASDevice currentDevice] identifier]};

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:currentDevice];
    }
    else {

        NSDictionary *errorInfo = @{@"errorMessage":@"No device found"};

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }

    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)isDeviceRegistered:(CDVInvokedUrlCommand*)command
{
    //
    // Checks if device is registered
    //
    
    CDVPluginResult *result;

    if ([MASDevice currentDevice])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:[[MASDevice currentDevice]isRegistered]];
    }
    else {

        NSDictionary *errorInfo = @{@"errorMessage":@"SDK has not properly initialized"};

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }

    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)getDeviceIdentifier:(CDVInvokedUrlCommand*)command
{
    //
    // Returns device identifier
    //

    CDVPluginResult *result;

    if ([MASDevice currentDevice])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[[MASDevice currentDevice]identifier]];
    }
    else {

        NSDictionary *errorInfo = @{@"errorMessage":@"SDK has not properly initialized"};

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }

    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)isAuthenticated:(CDVInvokedUrlCommand*)command
{
    //
    // Checks if device is authenticated
    //
    
    CDVPluginResult *result;

    if ([MASUser currentUser])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:[[MASUser currentUser] isAuthenticated]];
    }
    else {

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:NO];
    }

    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)isActive:(CDVInvokedUrlCommand*)command
 {
    //
    // Checks if current user is active
    //
     
    CDVPluginResult *result;

    if ([MASUser currentUser])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:[[MASUser currentUser] active]];
    }
    else {

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:NO];
    }

    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
 }


- (void)isApplicationAuthenticated:(CDVInvokedUrlCommand*)command
{
    //
    // Checks if application is authenticated
    //
    
    CDVPluginResult *result;

    if ([MASApplication currentApplication])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:[[MASApplication currentApplication] isAuthenticated]];
    }
    else {

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsBool:NO];
    }

    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)launchApp:(CDVInvokedUrlCommand*)command
{
    //
    // Launches an enterprise app
    //
    
    CDVPluginResult *result;
    
    NSString *appId = [command.arguments objectAtIndex:0];
    NSString *appUrl = nil;
    MASApplication *app = nil;
    MASApplication *currentApp = nil;
    for(app in _currentEnterpriseApps){
        if([app.identifier isEqualToString:appId]){
            currentApp = app;
        }
    }
    if([currentApp.nativeUrl length]) {
        
        appUrl = currentApp.nativeUrl;
        BOOL canOpenUrl = [[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:appUrl]];
        if (canOpenUrl)
        {
            [[UIApplication sharedApplication] openURL:[NSURL URLWithString:appUrl]];
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
        }
        else {
            
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsBool:NO];
        }
    }
    else if ([currentApp.authUrl length]) {
        
        if (![[MAS gatewayMonitoringStatusAsString] isEqualToString:@"Not Reachable"]) {
            
            UIStoryboard*  sb = [UIStoryboard storyboardWithName:@"EnterpriseBrowser"
                                                          bundle:nil];
            WebViewController* vc = [sb instantiateViewControllerWithIdentifier:@"EBViewController"];
            vc.app = currentApp;
            
            UINavigationController *nc = [[UINavigationController alloc] initWithRootViewController:vc];
            
            [self.viewController presentViewController:nc animated:YES completion:nil];
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
        }
        else {
        
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Host is currently not reachable"];
        }
    }
    else {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsBool:NO];
    }
    
    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)authenticationStatus:(CDVInvokedUrlCommand*)command
{
    //
    // Returns the authentication status
    //
    
    CDVPluginResult *result;

    if ([MASApplication currentApplication])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:[[MASApplication currentApplication] authenticationStatus]];
    }
    else {

        NSDictionary *errorInfo = @{@"errorMessage":@"SDK has not properly initialized"};

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }

    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)getCurrentUser:(CDVInvokedUrlCommand*)command
{
    //
    // Get the details of the current user
    //
    
    CDVPluginResult *result;

    if([MASUser currentUser])
    {
        NSDictionary *currentUser = @{@"isAuthenticated":[NSNumber numberWithBool:[[MASUser currentUser] isAuthenticated]],
                                             @"userName":[[MASUser currentUser] userName],
                                               @"active":[NSNumber numberWithBool:[[MASUser currentUser] active]]};

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK   messageAsDictionary:currentUser];
    }
    else {

        NSDictionary *errorInfo = @{@"errorMessage":@"User not logged in"};

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }

    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)getUserName:(CDVInvokedUrlCommand*)command
{
    //
    // Get the username of the current user
    //
    
    CDVPluginResult *result;

    if([MASUser currentUser])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[[MASUser currentUser] userName]];
    }
    else {

        NSDictionary *errorInfo = @{@"errorMessage":@"User not logged in"};

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }

    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)getName:(CDVInvokedUrlCommand*)command
{
    //
    // Get name of current user
    //
    
    CDVPluginResult *result;

    if([MASUser currentUser])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[[MASUser currentUser] formattedName]];
    }
    else {

        NSDictionary *errorInfo = @{@"errorMessage":@"Name not found"};

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }

    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)getAddressList:(CDVInvokedUrlCommand*)command
{
    //
    // Get address of current user
    //
    
    CDVPluginResult *result;

    if([MASUser currentUser])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[[MASUser currentUser] addresses]];
    }
    else {

        NSDictionary *errorInfo = @{@"errorMessage":@"Address not found"};

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }

    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)getEmailList:(CDVInvokedUrlCommand*)command
{
    //
    // Get the email id of current user
    //
    
    CDVPluginResult *result;

    if([MASUser currentUser])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[[MASUser currentUser] emailAddresses]];
    }
    else {

        NSDictionary *errorInfo = @{@"errorMessage":@"Email address not found"};

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }

    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

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

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsBool:NO];       
    }

    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}
    
- (void)retrieveEnterpriseApps:(CDVInvokedUrlCommand*)command
{
    //
    // Get the list of enterprise apps
    //
    
    __block CDVPluginResult *result;
    __block NSMutableArray *enterpriseApps = [[NSMutableArray alloc] init];
    if(![[MAS gatewayMonitoringStatusAsString] isEqualToString:@"Not Reachable"] && [MASApplication currentApplication])
    {
        [[MASApplication currentApplication] retrieveEnterpriseApps:^(NSArray *objects, NSError * error){
            _currentEnterpriseApps = objects;
            if(error){
                
                NSDictionary *errorInfo = @{@"errorCode":[NSNumber numberWithInteger:[error code]],
                                            @"errorMessage":[error localizedDescription],
                                            @"errorInfo":[error userInfo]};
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
            }
            else{
                //[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:objects];
                for(id object in _currentEnterpriseApps){
                    MASApplication *application = object;
                    NSMutableDictionary *app = [[NSMutableDictionary alloc] init];
                    [app setObject:application.name forKey:@"appName"];
                    [app setObject:application.identifier forKey:@"identifier"];
                    [app setObject:application.nativeUrl forKey:@"nativeUrl"];
                    [app setObject:application.authUrl forKey:@"authUrl"];
                    [app setObject:application.iconUrl forKey:@"iconUrl"];
                    [enterpriseApps addObject:app];
                }
                
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:enterpriseApps];
            }

            [result setKeepCallbackAsBool:YES];
            
            return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }];
    }
    else {
        
        NSDictionary *errorInfo = nil;
        if ([[MAS gatewayMonitoringStatusAsString] isEqualToString:@"Not Reachable"])
            errorInfo = @{@"errorMessage":@"Host is currently not reachable"};
        else if (![MASApplication currentApplication])
            errorInfo = @{@"errorMessage":@"Application not initialized"};
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
        
        return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}


- (void)resetLocally:(CDVInvokedUrlCommand*)command
{
    //
    // Reset cached data stored locally
    //
    
    CDVPluginResult *result;

    if ([MASDevice currentDevice])
    {
        [[MASDevice currentDevice] resetLocally];
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
    }
    else {

        NSDictionary *errorInfo = @{@"errorMessage":@"SDK has not properly initialized"};

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }

    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


@end
