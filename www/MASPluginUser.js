/*
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
     *  The username of the user
     *  @member {string}
     */

    this.userName = masPluginUser.userName;

    /**
     *  The family name of the user
     *  @member {string}
     */
     this.familyName = masPluginUser.familyName;

    /**
     *  The given name of the user
     *  @member {string}
     */
     this.givenName = masPluginUser.givenName;

    /**
     *  The formatted name of the user
     *  @member {string}
     */   
     this.formattedName = masPluginUser.formattedName;

    /**
     *  Lists of the email addresses of the user
     *  @member {array}
     */  
     this.emailAddresses = masPluginUser.emailAddresses;

    /**
     *  Lists of the phone numbers of the user
     *  @member {array}
     */    
     this.phoneNumbers = masPluginUser.phoneNumbers;

    /**
     *  Lists of the addresses of the user
     *  @member {array}
     */ 
     this.addresses = masPluginUser.addresses;

     /**
     *  Returns the base64 string of the user's photo
     *  @member {string}
     */ 
     this.photos = masPluginUser.photos;

     /**
     *  List of the groups the user is a part of
     *  @member {array}
     */ 
     this.groups = masPluginUser.groups;

     /**
     *  Checks if the user is active
     *  @member {bool}
     */ 
     this.active = masPluginUser.active;

     /**
     *  Boolean indicator that specifies whether the MASPluginUser object is the current user.

     *  @param {function} successHandler user defined success callback
     *  @param {function} errorHandler user defined error callback
     */
     this.isCurrentUser = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginUser", "isCurrentUser", []);
     };

    /**
     *  Boolean indicator that specifies whether the MASPluginUser object is authenticated
     *  @param {function} successHandler user defined success callback
     *  @param {function} errorHandler user defined error callback
     */
     this.isAuthenticated = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginUser", "isAuthenticated", []);
     };

    /**
     *  Boolean indicator that specifies whether the currently authenticated MASPluginUser object is locked
     *  @param {function} successHandler user defined success callback
     *  @param {function} errorHandler user defined error callback
     */
     this.isSessionLocked = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginUser", "isSessionLocked", []);
     };

    ///------------------------------------------------------------------------------------------------------------------
    /// @name Current User - Lock/Unlock Session
    ///------------------------------------------------------------------------------------------------------------------
    
    /**
     *  Locks the current session 
     *  @param {function} successHandler user defined success callback
     *  @param {function} errorHandler user defined error callback
     */
    this.lockSession = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginUser", "lockSession", []);
    }

    /**
     *  Unlocks the current session 
     *  @param {function} successHandler user defined success callback
     *  @param {function} errorHandler user defined error callback
     */
    this.unlockSession = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginUser", "unlockSession", []);
    }

    /**
     *  Unlocks the current session with a message to the user 
     *  @param {function} successHandler user defined success callback
     *  @param {function} errorHandler user defined error callback
     *  @param {string} message message to the user
     */
    this.unlockSessionWithMessage = function(successHandler, errorHandler, message) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginUser", "unlockSessionWithMessage", [message]);
    }

    /**
     *  Removes the session lock 
     *  @param {function} successHandler user defined success callback
     *  @param {function} errorHandler user defined error callback
     */
    this.removeSessionLock = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginUser", "removeSessionLock", []);
    }

    /**
     Logs off the user.
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
 *  The authenticated user for the application, if any. nil returned if none
 *  This is a singleton object.
 *  @param {function} successHandler user defined success callback
 *  @param {function} errorHandler user defined error callback
 *  @return Returns a singleton 'MASPluginUser' object.
 */

 MASPluginUser.currentUser = function(successHandler, errorHandler) {
 
    Cordova.exec(function(masPluginUser) {
        if (typeof(MASPluginUser.sharedCurrUser === 'undefined')){
            MASPluginUser.sharedCurrUser = new MASPluginUser(masPluginUser);
        }else {
            delete MASPluginUser.sharedCurrUser;
            MASPluginUser.sharedCurrUser = new MASPluginUser(masPluginUser);
        }
        successHandler(MASPluginUser.sharedCurrUser);
    }, errorHandler, "MASPluginUser", "currentUser");
};

//------------------------------------------------------------------------------------------------------------------
/// @name Authentication
///-----------------------------------------------------------------------------------------------------------------

/**
 Authenticates the user using the username and password
 *  @param {function} successHandler user defined success callback
 *  @param {function} errorHandler user defined error callback
 *  @param {string} userName username of the user
 *  @param {string} password password of the user
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