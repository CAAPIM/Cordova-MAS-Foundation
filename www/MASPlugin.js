//
//  MASPlugin.js
//
//  Created by Kaushik Thekkekere on 2016-02-04.
//  Copyright (c) 2016 CA Technologies. All rights reserved.
//

var MASPlugin = {
    
    
    MASDeviceRegistrationType:{
    /**
    * Unknown encoding type.
    */
    MASDeviceRegistrationTypeUnknown: -1,

    /**
    * The client credentials registration type.
    */
    MASDeviceRegistrationTypeClientCredentials: 0,

    /**
    * The user credentials registration type.
    */
    MASDeviceRegistrationTypeUserCredentials: 1,

    /**
    * The total number of supported types.
    */
    MASDeviceRegistrationTypeCount: 2
    },


    /**
    MAS which has the interfaces mapped to the native MAS class.
    */

    MAS: function(){
        /**
        Sets the device registration type MASDeviceRegistrationType. This should be set before MAS start is executed.
        */
        this.deviceRegistrationType=function(successHandler,errorHandler,MASDeviceRegistrationType){
        return Cordova.exec(successHandler,errorHandler,"com.ca.apim.MASPlugin","setDeviceRegistrationType",[MASDeviceRegistrationType]);
        };

        /**
        Set the name of the configuration file.  This gives the ability to set the file's name to a custom value.
        */
        this.configFileName=function(successHandler,errorHandler,fileName){
        return Cordova.exec(successHandler,errorHandler,"com.ca.apim.MASPlugin","setConfigFileName",[fileName]);
        };

        /**
        Starts the lifecycle of the MAS processes. This includes the registration of the application to the Gateway, if the network is available.
        */
        this.start=function(successHandler,errorHandler){
        return Cordova.exec(successHandler,errorHandler,"com.ca.apim.MASPlugin","start",[]);
        };

    },

    /**
    MASUser which has the interfaces mapped to the native MASUser class.
    */
    MASUser: function(){

        /**
        Authenticates the user using the username and password.
        */
        this.loginWithUsernameAndPassword=function(successHandler,errorHandler,username,password){
        return Cordova.exec(successHandler,errorHandler,"com.ca.apim.MASPlugin","loginWithUsernameAndPassword",[username,password]);
        };

        /**
        log off user.
        */
        this.logOffUser=function(successHandler,errorHandler){
        return Cordova.exec(successHandler,errorHandler,"com.ca.apim.MASPlugin","logOffUser",[]);
        };

    },

    /**
    MASDevice which has the interfaces mapped to the native MASDevice class.
    */
    MASDevice: function(){
        /**
        Log out device. This also provides option to clear local cache after logginf out the device.
        */
        this.logOutDeviceAndClearLocal=function(successHandler,errorHandler,clearLocal){
        return Cordova.exec(successHandler,errorHandler,"com.ca.apim.MASPlugin","logOutDeviceAndClearLocal",[clearLocal]);
        };



        /**
        Deregister the application resources on this device.
        */
        this.deregister=function(successHandler,errorHandler){
        return Cordova.exec(successHandler,errorHandler,"com.ca.apim.MASPlugin","deregister",[]);
        };


    },
    
};

    module.exports = MASPlugin;
