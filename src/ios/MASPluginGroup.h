/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */
//
//  MASPluginGroup.h
//  FoundationTest
//
//  Created by YUSSY01 on 01/02/17.
//
//

#import <Cordova/CDV.h>



@interface MASPluginGroup : CDVPlugin



///--------------------------------------
/// @name Properties
///--------------------------------------

# pragma mark - Properties

- (void)initWithInfo:(CDVInvokedUrlCommand*)command;



- (void)newGroup:(CDVInvokedUrlCommand*)command;



@end
