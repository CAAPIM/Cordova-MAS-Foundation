cordova.define("com.ca.apim.MASPlugin", function(require, exports, module) {
//
//  MASPlugin.js
//
//  Copyright (c) 2016 CA, Inc.
//
//  This software may be modified and distributed under the terms
//  of the MIT license. See the LICENSE file for details.
//
               
var MASPlugin = {
    
MASAuthenticationStatus:{
MASAuthenticationStatusNotLoggedIn: -1,
MASAuthenticationStatusLoginWithUser: 0,
MASAuthenticationStatusLoginAnonymously: 1
},
    
MASGrantFlow:{
MASGrantFlowUnknown: -1,
MASGrantFlowClientCredentials: 0,
MASGrantFlowPassword: 1,
MASGrantFlowCount: 2
},
    
MASRequestResponseType:{
    /**
     * Unknown encoding type.
     */
MASRequestResponseTypeUnknown: -1,
    
    /**
     * Standard JSON encoding.
     */
MASRequestResponseTypeJson:0,
    
    /**
     * SCIM-specific JSON variant encoding.
     */
MASRequestResponseTypeScimJson:1,
    
    /**
     * Plain Text.
     */
MASRequestResponseTypeTextPlain:2,
    
    /**
     * Standard WWW Form URL encoding.
     */
MASRequestResponseTypeWwwFormUrlEncoded:3,
    
    /**
     * Standard XML encoding.
     */
MASRequestResponseTypeXml:4,
    
    /**
     * The total number of supported types.
     */
MASRequestResponseTypeCount:5
},
    
    /**
     MAS which has the interfaces mapped to the native MAS class.
     */
MAS: function(){
               
    /**
     Sets the device registration type MASDeviceRegistrationType. This should be set before MAS start is executed.
     */
    this.initialize=function(errorHandler){
        
        Cordova.exec(MASAuthenticationCallback,errorHandler,"com.ca.apim.MASPlugin","setAuthenticationListener",[]);
    };
    
               
    this.setCustomLoginPage=function(successHandler,errorHandler,customLoginPage){
               
        loginPage = customLoginPage;
        $.ajax({
            url: loginPage,
            success: function(data){},
            error: function(data){
                loginPage="login.html";
            },
        })
    };
               
    /**
     Sets the device registration type MASDeviceRegistrationType. This should be set before MAS start is executed.
     */
    this.grantFlow=function(successHandler,errorHandler,MASGrantFlow){
        return Cordova.exec(successHandler,errorHandler,"com.ca.apim.MASPlugin","setGrantFlow",[MASGrantFlow]);
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
    
    this.startWithDefaultConfiguration=function(successHandler,errorHandler,defaultConfiguration){
        return Cordova.exec(successHandler,errorHandler,"com.ca.apim.MASPlugin","startWithDefaultConfiguration",[defaultConfiguration]);
    };
    
    this.startWithJSON=function(successHandler,errorHandler,jsonObject){
        return Cordova.exec(successHandler,errorHandler,"com.ca.apim.MASPlugin","startWithJSON",[jsonObject]);
    };
    
    /**
     Completes the current user's authentication session validation.
    */
    this.completeAuthentication=function(successHandler,errorHandler,username,password){
       
        $.mobile.activePage.find(".messagePopup").popup("close");
               
        return Cordova.exec(successHandler,errorHandler,"com.ca.apim.MASPlugin","completeAuthentication",[username,password]);
    };

    /**
     Cancels the current user's authentication session validation.
     */
    this.cancelAuthentication=function(successHandler,errorHandler,args){
        
        $.mobile.activePage.find(".messagePopup").popup("close");
               
        return Cordova.exec(successHandler,errorHandler,"com.ca.apim.MASPlugin","cancelAuthentication",[args]);
    };
               
    /**
     getFromPath does the HTTP GET call from the gateway. This expects atleast three mandatry parameters as shown in the the below example. The requestType and responseType are the optional parameters. If the requestType and responseType is not present then it is set to the Default Type to JSON.
     */
    this.getFromPath=function(successHandler,errorHandler,path,parametersInfo,headersInfo,requestType,responseType){
        return Cordova.exec(successHandler,errorHandler,"com.ca.apim.MASPlugin","getFromPath",[path,parametersInfo,headersInfo,requestType,responseType]);
    };
    
    /**
     deleteFromPath does the HTTP DELTE call from the gateway. This expects atleast three mandatry parameters as shown in the the below example. The requestType and responseType are the optional parameters. If the requestType and responseType is not present then it is set to the Default Type to JSON.
     */
    this.deleteFromPath=function(successHandler,errorHandler,path,parametersInfo,headersInfo,requestType,responseType){
        return Cordova.exec(successHandler,errorHandler,"com.ca.apim.MASPlugin","deleteFromPath",[path,parametersInfo,headersInfo,requestType,responseType]);
    };
    
    /**
     putToPath does the HTTP PUT call from the gateway. This expects atleast three mandatry parameters as shown in the the below example. The requestType and responseType are the optional parameters. If the requestType and responseType is not present then it is set to the Default Type to JSON.
     */
    this.putToPath=function(successHandler,errorHandler,path,parametersInfo,headersInfo,requestType,responseType){
        return Cordova.exec(successHandler,errorHandler,"com.ca.apim.MASPlugin","putToPath",[path,parametersInfo,headersInfo,requestType,responseType]);
    };
    
    /**
     postToPath does the HTTP POST call from the gateway. This expects atleast three mandatry parameters as shown in the the below example. The requestType and responseType are the optional parameters. If the requestType and responseType is not present then it is set to the Default Type to JSON.
     */
    this.postToPath=function(successHandler,errorHandler,path,parametersInfo,headersInfo,requestType,responseType){
        return Cordova.exec(successHandler,errorHandler,"com.ca.apim.MASPlugin","postToPath",[path,parametersInfo,headersInfo,requestType,responseType]);
    };
    
    /**
     Stops the lifecycle of all MAS processes.
     */
    this.stop=function(successHandler,errorHandler){
        return Cordova.exec(successHandler,errorHandler,"com.ca.apim.MASPlugin","stop",[]);
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
    this.logoutUser=function(successHandler,errorHandler){
        return Cordova.exec(successHandler,errorHandler,"com.ca.apim.MASPlugin","logoutUser",[]);
    };
    
    this.isAuthenticated=function(successHandler, errorHandler){
        return Cordova.exec(successHandler,errorHandler,"com.ca.apim.MASPlugin","isAuthenticated",[]);
    };
},
    
    /**
     MASDevice which has the interfaces mapped to the native MASDevice class.
     */
MASDevice: function(){
    
    /**
     Deregister the application resources on this device.
     */
    this.deregister=function(successHandler,errorHandler){
        return Cordova.exec(successHandler,errorHandler,"com.ca.apim.MASPlugin","deregister",[]);
    };
    
    this.resetLocally=function(successHandler, errorHandler){
        return Cordova.exec(successHandler,errorHandler,"com.ca.apim.MASPlugin","resetLocally",[]);
    };
    
    this.isDeviceRegistered=function(successHandler, errorHandler){
        return Cordova.exec(successHandler,errorHandler,"com.ca.apim.MASPlugin","isDeviceRegistered",[]);
    };
}
};

module.exports = MASPlugin;
});

var loginPage = "login.html";

var MASPopupLoginUI = function(loginPage, popupafterclose) {
    
    window.onbeforeunload = function() {
        return "Dude, are you sure you want to leave? Think of the kittens!";
    }
    
    var template = "<div id='loginDiv' data-role='popup' class='ui-content messagePopup' style='position: fixed; top: 50%; left:50%; transform: translate(-50%, -50%)'>"
    + "<a href='#' data-role='button' data-theme='g' data-icon='delete' data-iconpos='notext' "
    + " class='ui-btn-right closePopup'>Close</a> </div>";
    
    popupafterclose = popupafterclose ? popupafterclose : function () {};
    
    $.mobile.activePage.append(template).trigger("create");
    
    $('#loginDiv').load(loginPage);
    
    $.mobile.activePage.find(".closePopup").bind("tap", function (e) {
                                                 $.mobile.activePage.find(".messagePopup").popup("close");
                                                 });
    
    $.mobile.activePage.find(".messagePopup").popup(
                                                    { transition: 'slidedown',
                                                      history: false,
                                                      overlay: true
                                                    }).popup("open").bind({
                                                            
                                                        popupafterclose: function () {
                                                        $(this).unbind("popupafterclose").remove();
                                                        popupafterclose();
                                                    }
                                                });
    
    $(".messagePopup").on({
                          popupbeforeposition: function () {
                          $('.ui-popup-screen').off();
                          }
                          });
    
    return false;
}

var MASAuthenticationCallback = function(result) {
    
    MASPopupLoginUI(loginPage,function(){
        
        $('#loginDiv').remove();
        
        var MAS = new MASPlugin.MAS();
        MAS.cancelAuthentication(function(){},function(){});
    });
    
}

var MASSendCredentials = function(username, password) {
    
    var MAS = new MASPlugin.MAS();
    MAS.completeAuthentication(function(){}, function(){}, username, password);
}

var MASCancelLogin = function(args) {
    
    var MAS = new MASPlugin.MAS();
    MAS.cancelAuthentication(function(){}, function(){}, args);
}

