/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASPluginUser = function() {

    ///------------------------------------------------------------------------------------------------------------------
    /// @name Properties
    ///------------------------------------------------------------------------------------------------------------------

    /**
     *  Boolean indicator of whether the MASPluginUser object is currently authenticated user or not.
     */
    const this.isCurrentUser;

    /**
     *  Boolean indicator of whether the MASPluginUser object is authenticated or not
     */
    const this.isAuthenticated;

    /**
     *  Boolean indicator of whether the currently authenticated MASPluginUser object is locked or not
     */
    const this.isSessionLocked;

    /**
     *  String property of username
     */    
    const this.userName;

    /**
     *  String property of the user's family name
     */    
    const this.familyName;

    /**
     *  String property of the user's given name
     */    
    const this.givenName;

    /**
     *  String property of the user's full name
     */    
    const this.formattedName;
    
    /**
     *  String property of the user's email address
     */    
    const this.emailAddresses;

    /**
     *  String property of the user's phone number
     */    
    const this.phoneNumbers;

    /**
     *  String property of the user's address
     */    
    const this.addresses;
    
    const this.photos;

    const this.groups;

    const this.active;

    const this.accessToken;


    ///------------------------------------------------------------------------------------------------------------------
    /// @name Current User
    ///------------------------------------------------------------------------------------------------------------------

    /**
     *  The authenticated user for the application, if any. nil returned if none.
     *  This is a singleton object.
     *
     *  @return Returns a singleton 'MASPluginUser' object.
     */
    MASPluginUser.currentUser = function(successHandler, errorHandler) {

        Cordova.exec(successHandler, errorHandler, "MASPluginUser", "currentUser", []);
    };

    ///------------------------------------------------------------------------------------------------------------------
    /// @name Current User - Lock/Unlock Session
    ///------------------------------------------------------------------------------------------------------------------
    
    this.lockSession = function(successHandler, errorHandler) {

        return Cordova.exec(successHandler, errorHandler, "MASPluginUser", "lockSession", []); 
    }

    this.unlockSession = function(successHandler, errorHandler) {

        return Cordova.exec(successHandler, errorHandler, "MASPluginUser", "unlockSession", []); 
    }

    this.unlockSessionWithMessage = function(successHandler, errorHandler, message) {

        return Cordova.exec(successHandler, errorHandler, "MASPluginUser", "unlockSessionWithMessage", [message]); 
    }

    this.removeSessionLock = function(successHandler, errorHandler) {

        return Cordova.exec(successHandler, errorHandler, "MASPluginUser", "removeSessionLock", []); 
    }

    //------------------------------------------------------------------------------------------------------------------
    /// @name Authentication
    ///-----------------------------------------------------------------------------------------------------------------

    /**
     Authenticates the user using the username and password.
     */
    MASPluginUser.loginWithUsernameAndPassword = function(successHandler, errorHandler, username, password) {
        
        return Cordova.exec(successHandler, errorHandler, "MASPluginUser", "loginWithUsernameAndPassword", [username, password]);
    };

    MASPluginUser.loginWithAuthorizationCode = function(successHandler, errorHandler, authorizationCode){

        Cordova.exec(successHandler, errorHandler, "MASPluginUser", "loginWithAuthorizationCode", [authorizationCode]);
    };
    
    this.requestUserInfo = function(successHandler, errorHandler){

        Cordova.exec(successHandler, errorHandler, "MASPluginUser", "requestUserInfo", []);
    };

    /**
     log off user.
     */
    this.logout = function(successHandler, errorHandler) {
        
        return Cordova.exec(successHandler, errorHandler, "MASPluginUser", "logout", []);
    };
}

module.exports = MASPluginUser;