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
