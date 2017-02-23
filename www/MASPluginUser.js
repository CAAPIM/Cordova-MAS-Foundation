/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

 var MASPluginUser = function(masPluginUser) {

    ///------------------------------------------------------------------------------------------------------------------
    /// @name Properties
    ///------------------------------------------------------------------------------------------------------------------
    //console.log(JSON.stringify(masPluginUser));
    /**
     *  String property of username
     */

    this.userName = masPluginUser.userName;

    /**
     *  String property of the user's family name
     */
     this.familyName = masPluginUser.familyName;

    /**
     *  String property of the user's given name
     */
     this.givenName = masPluginUser.givenName;

    /**
     *  String property of the user's full name
     */    
     this.formattedName = masPluginUser.formattedName;

    /**
     *  String property of the user's email address
     */    
     this.emailAddresses = masPluginUser.emailAddresses;

    /**
     *  String property of the user's phone number
     */    
     this.phoneNumbers = masPluginUser.phoneNumbers;

    /**
     *  String property of the user's address
     */    
     this.addresses = masPluginUser.addresses;

     this.photos = masPluginUser.photos;

     this.groups = masPluginUser.groups;

     this.active = masPluginUser.active;

     /**
     *  Boolean indicator of whether the MASPluginUser object is currently authenticated user or not.
     */
     this.isCurrentUser = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginUser", "isCurrentUser", []);
     };

    /**
     *  Boolean indicator of whether the MASPluginUser object is authenticated or not
     */
     this.isAuthenticated = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginUser", "isAuthenticated", []);
     };

    /**
     *  Boolean indicator of whether the currently authenticated MASPluginUser object is locked or not
     */
     this.isSessionLocked = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginUser", "isSessionLocked", []);
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

    /**
     log off user.
     */
     this.logout = function(successHandler, errorHandler) {
        return Cordova.exec(function(result) {
            delete MASPluginUser.sharedCurrUser;
            successHandler(result);            
        }, errorHandler, "MASPluginUser", "logoutUser", []);
    };
}

///------------------------------------------------------------------------------------------------------------------
/// @name Current User
///------------------------------------------------------------------------------------------------------------------

MASPluginUser.sharedCurrUser;

/**
 *  The authenticated user for the application, if any. nil returned if none.
 *  This is a singleton object.
 *
 *  @return Returns a singleton 'MASPluginUser' object.
 */

 MASPluginUser.currentUser = function(successHandler, errorHandler, retryOnNull) {
 if (!retryOnNull) {
    retryOnNull = false;
 }
    Cordova.exec(function(masPluginUser) {
        if (typeof(MASPluginUser.sharedCurrUser === 'undefined')){
            MASPluginUser.sharedCurrUser = new MASPluginUser(masPluginUser);
        }else {
            delete MASPluginUser.sharedCurrUser;
            MASPluginUser.sharedCurrUser = new MASPluginUser(masPluginUser);
        }
        successHandler(MASPluginUser.sharedCurrUser);
    }, errorHandler, "MASPluginUser", "currentUser", [retryOnNull]);
};

//------------------------------------------------------------------------------------------------------------------
/// @name Authentication
///-----------------------------------------------------------------------------------------------------------------

/**
 Authenticates the user using the username and password.
 */
 MASPluginUser.loginWithUsernameAndPassword = function(successHandler, errorHandler, username, password) {
    return Cordova.exec(function(result) {
        if (result && typeof(MASPluginUser.sharedCurrUser !== 'undefined')){
            MASPluginUser.currentUser(function(){}, function(){});
         }
        successHandler(result);
    }, errorHandler, "MASPluginUser", "loginWithUsernameAndPassword", [username, password]);
};

module.exports = MASPluginUser;