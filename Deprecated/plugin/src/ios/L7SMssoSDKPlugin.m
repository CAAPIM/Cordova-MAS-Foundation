/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

//
//  L7SMssoSDKPlugin.m
//
//  Created by Anthony Yu on 2013-11-15.
//

#import "L7SMssoSDKPlugin.h"
#import "L7SClientManager.h"
#import "L7SAFJSONRequestOperation.h"
#import "L7SHTTPClient.h"
#import "L7SErrors.h"


@interface L7SMssoSDKPlugin() <L7SClientProtocol>


@end

@implementation L7SMssoSDKPlugin

CDVInvokedUrlCommand *_statusUpdateCommand;
CDVInvokedUrlCommand *_errorCallbackCommand;

- (void)pluginInitialize{
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(didReceiveStatusUpdate:)
                                                 name:L7SDidReceiveStatusUpdateNotification
                                               object:nil];
    
    [[L7SClientManager sharedClientManager] setDelegate:self];
    
}

- (void) httpCall:(CDVInvokedUrlCommand*)command {
    __block CDVPluginResult *result;
    if([command.arguments count] < 2 ){
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString: [NSString stringWithFormat: @"%d", L7SHTTPCallError]];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
    NSString *method = [command.arguments objectAtIndex:0];
    NSString *baseURL = [command.arguments objectAtIndex:1];
    NSString *path = nil;
    NSDictionary *headers = nil;
    NSDictionary *parameters = nil;
    
    if([command.arguments count] >2 ){
        path = [command.arguments objectAtIndex:2];
    }
    
    if([command.arguments count] > 3 ){
        headers = [command.arguments objectAtIndex:3];
        
    }
    
    if([command.arguments count] > 4 ){
        parameters = [command.arguments objectAtIndex:4];
    }
    
    
    L7SHTTPClient *httpClient = [[ L7SHTTPClient alloc] initWithBaseURL:[NSURL URLWithString:baseURL]];
    
    if(headers && headers.count>0){
        if([[headers objectForKey:@"Content-Type"] caseInsensitiveCompare:@"application/x-www-form-urlencoded"]==NSOrderedSame){
            httpClient.parameterEncoding = AFFormURLParameterEncoding;
        }else if ([[headers objectForKey:@"Content-Type"] caseInsensitiveCompare:@"application/json"]==NSOrderedSame){
            httpClient.parameterEncoding = AFJSONParameterEncoding;
        }
    }
    
    NSMutableURLRequest *mutableRequest = [httpClient requestWithMethod:method path:path parameters:parameters];
    
    if(headers && headers.count>0){
        [mutableRequest setAllHTTPHeaderFields:headers];
    }
    
    L7SAFHTTPRequestOperation *operation = [httpClient HTTPRequestOperationWithRequest:mutableRequest
                                                                            success:^(L7SAFHTTPRequestOperation *operation, id responseObject)
                                         {
                                             NSLog(@"received response:, %@", responseObject);
                                             
                                             NSString *responseString = operation.responseString;
                                             
                                             result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:responseString];
                                             
                                             [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                                         } failure:^(L7SAFHTTPRequestOperation *operation, NSError *error) {
                                             NSLog(@"received error");
                                             NSDictionary *errorDict = @{@"errorCode": [NSNumber numberWithInt:L7SHTTPCallError]};
                                             result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorDict];
                                             [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                                             
                                         }];
    
    [httpClient enqueueHTTPRequestOperation:operation];
    
}



- (void) logoutDevice:(CDVInvokedUrlCommand*)command{
    
    [[L7SClientManager sharedClientManager] logoutDevice];
    __block CDVPluginResult *result;
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void) deRegister:(CDVInvokedUrlCommand*)command{
    
    [[L7SClientManager sharedClientManager] deRegister];
    __block CDVPluginResult *result;
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void) logoffApp:(CDVInvokedUrlCommand*)command{
    
    [[L7SClientManager sharedClientManager] logoffApp];
    __block CDVPluginResult *result;
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void) isLogin:(CDVInvokedUrlCommand*)command{
    
    __block CDVPluginResult *result;
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool: [[L7SClientManager sharedClientManager] isDeviceLogin]];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void) isAppLogon:(CDVInvokedUrlCommand*)command{
    
    __block CDVPluginResult *result;
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool: [[L7SClientManager sharedClientManager] isAppLogon]];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void) isDeviceRegistered:(CDVInvokedUrlCommand*)command{
    
    __block CDVPluginResult *result;
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool: [[L7SClientManager sharedClientManager] isRegistered]];
    
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void) registerStatusUpdate:(CDVInvokedUrlCommand*)command{
    
    _statusUpdateCommand = command;
}

- (void) registerErrorCallback:(CDVInvokedUrlCommand*)command{
    
    _errorCallbackCommand = command;
}


- (void) didReceiveStatusUpdate:(NSNotification *) notification{
    NSLog(@"receive status update notification %@", notification);
    
    L7SClientState state = (L7SClientState)[[notification.userInfo objectForKey:L7SStatusUpdateKey] intValue];
    __block CDVPluginResult *result;
    
    
    switch (state) {
        case L7SDidFinishRegistration:{
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"L7SDidFinishRegistration"];
            [result setKeepCallbackAsBool:YES];
            [self.commandDelegate sendPluginResult:result callbackId:_statusUpdateCommand.callbackId];
            
            
        }break;
        case L7SDidFinishAuthentication:{
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"L7SDidFinishAuthentication"];
            [result setKeepCallbackAsBool:YES];
            [self.commandDelegate sendPluginResult:result callbackId:_statusUpdateCommand.callbackId];
            
        }break;
        case L7SDidFinishDeRegistration:{
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"L7SDidFinishDeRegistration"];
            [result setKeepCallbackAsBool:YES];
            [self.commandDelegate sendPluginResult:result callbackId:_statusUpdateCommand.callbackId];
            
        }
        case L7SDidLogout:{
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"L7SDidLogout"];
            [result setKeepCallbackAsBool:YES];
            [self.commandDelegate sendPluginResult:result callbackId:_statusUpdateCommand.callbackId];
            
            
        }break;
        case L7SDidLogoff:{
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"L7SDidLogoff"];
            [result setKeepCallbackAsBool:YES];
            [self.commandDelegate sendPluginResult:result callbackId:_statusUpdateCommand.callbackId];
            
        }break;
        default:
            break;
            
    }
}



- (void)DidReceiveError:(NSError *)error{
    
    __block CDVPluginResult *result;
    NSDictionary *errorDict = @{@"errorCode": [NSString stringWithFormat: @"%ld", error.code]};
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:errorDict];
    [result setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:result callbackId:_errorCallbackCommand.callbackId];
    
    
}


@end
