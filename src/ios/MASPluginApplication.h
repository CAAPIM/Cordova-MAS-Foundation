//
//  MASPluginApplication.h
//  FoundationTest
//
//  Created by YUSSY01 on 01/02/17.
//
//

#import <Cordova/CDV.h>



@interface MASPluginApplication : CDVPlugin



///--------------------------------------
/// @name Properties
///--------------------------------------

# pragma mark - Properties

/**
 *  Boolean property of the application authentication status (primarily for client credential authentication.)
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)isApplicationAuthenticated:(CDVInvokedUrlCommand*)command;



/**
 *  Enumeration value of authentication status.
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)authenticationStatus:(CDVInvokedUrlCommand*)command;



///--------------------------------------
/// @name Enterprise App
///--------------------------------------

# pragma mark - Enterprise App

/**
 *  Launches a native app with a given URI
 *
 *  @param command CDInvokedUrlCommand object
 */
- (void)launchApp:(CDVInvokedUrlCommand*)command;



/**
 *  Retrieves the list of enterprise apps
 *
 *  @param command CDVInvokedUrlCommand object
 *
 */
- (void)retrieveEnterpriseApps:(CDVInvokedUrlCommand*)command;



@end
