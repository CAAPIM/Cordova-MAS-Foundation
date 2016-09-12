//
//  MASPlugin.m
//
//  Copyright (c) 2016 CA, Inc.
//
//  This software may be modified and distributed under the terms
//  of the MIT license. See the LICENSE file for details.
//

#import "MASPlugin.h"
#import <MASFoundation/MASFoundation.h>
#import <MASUI/MASUI.h>


@interface MASPlugin()


///--------------------------------------
/// @name Properties
///-------------------------------------

# pragma mark - Properties

@property (nonatomic, copy) MASAuthorizationCodeCredentialsBlock authorizationCodeBlock;


@property (nonatomic, copy) MASBasicCredentialsBlock basicCredentialsBlock;


@property (nonatomic, copy) MASOTPGenerationBlock otpGenerationBlock;


@property (nonatomic, copy) MASOTPFetchCredentialsBlock otpBlock;

@end


@implementation MASPlugin

- (void)pluginInitialize
{

}


- (void)setGrantFlow:(CDVInvokedUrlCommand*)command
{
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
    __block CDVPluginResult *result;
    
    [MAS setUserLoginBlock:
        ^(MASBasicCredentialsBlock basicBlock,
          MASAuthorizationCodeCredentialsBlock authorizationCodeBlock) {
        
        self.basicCredentialsBlock = basicBlock;
        self.authorizationCodeBlock = authorizationCodeBlock;
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                   messageAsString:@"AuthenticationListener is set"];
        
        [result setKeepCallbackAsBool:YES];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}


- (void)completeAuthentication:(CDVInvokedUrlCommand *)command
{
    __block CDVPluginResult *result;
    
    if (self.basicCredentialsBlock) {
        
        self.basicCredentialsBlock(command.arguments[0], command.arguments[1], NO, nil);
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                   messageAsString:@"BasicCredentialsBlock called"];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}


- (void)cancelAuthentication:(CDVInvokedUrlCommand *)command
{
    __block CDVPluginResult *result;
    
    if (self.basicCredentialsBlock) {
        
        self.basicCredentialsBlock(nil, nil, YES, nil);
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                   messageAsString:@"BasicCredentialsBlock called"];
        
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}


- (void)setOTPChannelSelectorListener:(CDVInvokedUrlCommand*)command
{
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
    
    CDVPluginResult *result;
    
    if (self.otpGenerationBlock) {
        
        self.otpGenerationBlock(command.arguments[0], NO, nil);
    }
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:NO];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)cancelGenerateAndSendOTP:(CDVInvokedUrlCommand*)command {
    
    CDVPluginResult *result;
    
    if (self.otpGenerationBlock) {
        
        self.otpGenerationBlock(nil, YES, nil);
    }
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"OTP Channels Cancelled"];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)setOTPAuthenticationListener:(CDVInvokedUrlCommand*)command
{
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
 
    CDVPluginResult *result;
    
    if (self.otpBlock) {
        
        self.otpBlock(command.arguments[0], NO, nil);
    }
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"OTP Sent"];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)cancelOTPValidation:(CDVInvokedUrlCommand*)command {
    
    CDVPluginResult *result;
    
    if (self.otpBlock) {
        
        self.otpBlock(nil, YES, nil);
    }
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"OTP Cancelled"];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)start:(CDVInvokedUrlCommand*)command
{
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
    __block CDVPluginResult *result;

    [MAS stop:^(BOOL completed, NSError *error) {

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


- (void)getFromPath:(CDVInvokedUrlCommand*)command
{
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


- (void)deregister:(CDVInvokedUrlCommand*)command
{
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

        NSDictionary *errorInfo = @{@"errorMessage":@"SDK has not properly initlaized"};

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


- (void)isDeviceRegistered:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result;

    if ([MASDevice currentDevice])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:[[MASDevice currentDevice]isRegistered]];
    }
    else {

        NSDictionary *errorInfo = @{@"errorMessage":@"SDK has not properly initlaized"};

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }

    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)isAuthenticated:(CDVInvokedUrlCommand*)command
{
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


- (void)isApplicationAuthenticated:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result;

    if ([MASApplication currentApplication])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:[[MASApplication currentApplication] isAuthenticated]];
    }
    else {

        NSDictionary *errorInfo = @{@"errorMessage":@"SDK has not properly initlaized"};

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }

    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)authenticationStatus:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result;

    if ([MASApplication currentApplication])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:[[MASApplication currentApplication] authenticationStatus]];
    }
    else {

        NSDictionary *errorInfo = @{@"errorMessage":@"SDK has not properly initlaized"};

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }

    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)getCurrentUser:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result;

    if([MASUser currentUser])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:[[MASUser currentUser] isCurrentUser]];
    }
    else {

        NSDictionary *errorInfo = @{@"errorMessage":@"User not logged in"};

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }
}

- (void)getUserName:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result;

    if([MASUser currentUser])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[[MASUser currentUser] userName]];
    }
    else {

        NSDictionary *errorInfo = @{@"errorMessage":@"User not logged in"};

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }
}

- (void)resetLocally:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult *result;

    if ([MASDevice currentDevice])
    {
        [[MASDevice currentDevice] resetLocally];
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
    }
    else {

        NSDictionary *errorInfo = @{@"errorMessage":@"SDK has not properly initlaized"};

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    }

    return [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


@end
