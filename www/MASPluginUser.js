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
     this.isCurrentUser;

    /**
     *  Boolean indicator of whether the MASPluginUser object is authenticated or not
     */
     this.isAuthenticated;

    /**
     *  Boolean indicator of whether the currently authenticated MASPluginUser object is locked or not
     */
     this.isSessionLocked;

    /**
     *  String property of username
     */    
     this.userName;

    /**
     *  String property of the user's family name
     */    
     this.familyName;

    /**
     *  String property of the user's given name
     */    
     this.givenName;

    /**
     *  String property of the user's full name
     */    
     this.formattedName;

    /**
     *  String property of the user's email address
     */    
     this.emailAddresses;

    /**
     *  String property of the user's phone number
     */    
     this.phoneNumbers;

    /**
     *  String property of the user's address
     */    
     this.addresses;

     this.photos;

     this.groups;

     this.active;

     this.accessToken;

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

    Cordova.exec(function(result) {

        var currentUser = Object.create(MASPluginUser);
        currentUser.isCurrentUser = result.isCurrentUser;
        currentUser.isAuthenticated = result.isAuthenticated;
        currentUser.isSessionLocked = result.isSessionLocked;
        currentUser.userName = result.userName;
        currentUser.familyName = result.familyName;
        currentUser.givenName = result.givenName;
        currentUser.formattedName = result.formattedName;
        currentUser.emailAddresses = result.emailAddresses;
        currentUser.phoneNumbers = result.phoneNumbers;
        currentUser.addresses = result.addresses;
        currentUser.photos = result.photos;
        currentUser.active = result.active;
        currentUser.accessToken = result.accessToken;

        successHandler(currentUser);

    }, errorHandler, "MASPluginUser", "currentUser", []);
};

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


    module.exports = MASPluginUser;