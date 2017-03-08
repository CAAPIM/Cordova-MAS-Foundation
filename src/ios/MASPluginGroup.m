/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */
//
//  MASPluginGroup.m
//  FoundationTest
//
//  Created by YUSSY01 on 01/02/17.
//
//

#import "MASPluginGroup.h"

#import <MASFoundation/MASFoundation.h>


@implementation MASPluginGroup


///--------------------------------------
/// @name Properties
///--------------------------------------

# pragma mark - Properties

- (void)initWithInfo:(CDVInvokedUrlCommand*)command {
    
    CDVPluginResult *result;
    
    NSDictionary *info = (NSDictionary *)[command.arguments objectAtIndex:0];
    
    MASGroup *group = [[MASGroup alloc] initWithInfo:info];
    
    NSMutableDictionary *dictionary =
        [NSMutableDictionary dictionaryWithObjectsAndKeys:
         group.groupName, @"groupName",
         group.owner, @"owner",
         group.members, @"members", nil];

    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:dictionary];
}


- (void)newGroup:(CDVInvokedUrlCommand*)command {
    
    CDVPluginResult *result;
    
    MASGroup *group = [MASGroup group];
    
    NSMutableDictionary *dictionary =
    [NSMutableDictionary dictionaryWithObjectsAndKeys:
     group.groupName, @"groupName",
     group.owner, @"owner",
     group.members, @"members", nil];
    
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:dictionary];
}


@end
