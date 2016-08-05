//  Copyright (c) 2016 CA Technologies. All rights reserved.
//
var L7SMssoSDKPlugin = {

    /**
    * The SDK can be initialized with a custom named JSON object. This json object is passed in as a string.
    * The follwing is an example
    * L7SMssoSDKPlugin.initialize(successCallBack,errorCallback,jsonObject);
	*
    * function successCallback(result){
    *    console.log(result);
	*
    * }
    * function errorCallback(result){
    *   console.log(result);
    * }
    **/
    initialize:function(successCallback,errorCallback,jsonObject){
            return Cordova.exec(successCallback, errorCallback, "com.l7tech.msso.L7SMssoSDKPlugin", "initializeWithJson", [jsonObject]);
        },

    L7SStatus: {
        L7SDidFinishRegistration: 'L7SDidFinishRegistration',
        L7SDidFinishAuthentication: 'L7SDidFinishAuthentication',
        L7SDidFinishDeRegistration: 'L7SDidFinishDeRegistration',
        L7SDidLogout: 'L7SDidLogout',
        L7SDidLogoff: 'L7SDidLogoff'
    },

    L7SError: {
        //authentication domain
        AuthenticationLoginError: -101,
        AuthenticationJWTError: -102,
        AuthenticationRefreshError: -103,
        LogoutError: -104,
        LogoffError: -105,
        SocialLoginError: -106,

        //registration domain
        RegistrationError: -201,
        DeRegistrationError: -202,

        //location domian
        LocationError: -301,

        //http call domain
        HttpCallError: -501,

        //JSON parsing error used by MAS Storage
        JsonParsingError: -601

    },

    /**
     * Supported HTTP methods
     **/
    HTTPMethod: {
        GET: 'GET',
        POST: 'POST',
        DELETE: 'DELETE',
        PUT: 'PUT'
    },

    /**
     *Supported the content type
     *Set the content-type in the headers to specify desired parameter encoding
     **/
    CONTENT_TYPE :{
        FORM_URL:'application/x-www-form-urlencoded',
        JSON: 'application/json'
    },

    /**
     *This is an HTTPClient Object for making an HTTP Call.
     *1. To create an HTTP client object:
     *  var httpClient = new L7SMssoSDKPlugin.HttpClient('https://baseURL');
     *2. To make a Get HTTP Call:
     *  httpClient.httpCall(successHandler, errorHandler, L7SMssoSDKPlugin.HTTPMethod.GET);
     *
     *Optionally, the following HTTPClient properties can be set (belows are examples):
     * httpClient.path = '/protected/resource/products';
     * httpClient.headers = {"Accept":"application/json", "Content-Type":L7SMssoSDKPlugin.CONTENT_TYPE.FORM_URL};
     * httpClient.parameters = {"operation":"listProducts"};
     *
     *If the "headers" is not set, the default parameter encoding will be form_url encoding.
     *
     *
     **/
    HttpClient: function (baseURL) {
        this.baseURL = baseURL;  // the URL to the resource
        this.path = '';      //optional, path to the resource
        this.headers={};     //optional, http request headers in Json foramt
        this.parameters={};  //optional, http request parameters in Json format

        /*
         The httpCall function takes three parameters: request success handler, request failure handler, and a supported HTTP method.

         1) The success handler is a fucntion accepts string as a parameter, for example:

           function httpCallPluginResultHandler (result) {
                  //process the result based on the format
            }

         2) The failure hander accepts an error object as a dictionary with a key "errorCode", for example:

           function nativePluginErrorHandler (error) {
                //the errorCode in this case, L7SMssoSDKPlugin.L7SError.HttpCallError
                alert("ERROR: \r\n"+error.errorCode );
           }

         3) The method parameter is one of supported HTTP methods, for example: L7SMssoSDKPlugin.HTTPMethod.GET

        */
        this.httpCall = function (success, fail, method){
            return Cordova.exec(success, fail, "com.l7tech.msso.L7SMssoSDKPlugin", "httpCall", [method, this.baseURL, this.path, this.headers, this.parameters]);
        };
    },


    //Method to logout device
    logoutDevice: function () {
        return Cordova.exec(null, null, "com.l7tech.msso.L7SMssoSDKPlugin", "logoutDevice", []);
    },

    //Method to deregister device
    deRegister: function () {
        return Cordova.exec(null, null, "com.l7tech.msso.L7SMssoSDKPlugin", "deRegister", []);
    },

    //method to logoff app
    logoffApp: function () {
        return Cordova.exec(null, null, "com.l7tech.msso.L7SMssoSDKPlugin", "logoffApp", []);
    },

    /**
     *Method to check if the app is logged in
     *
     * return boolean
     **/
    isLogin: function (resultHandler) {
        return Cordova.exec(resultHandler, null, "com.l7tech.msso.L7SMssoSDKPlugin", "isLogin", []);
    },


    /**
     *Method to check if the app is logged on
     *
     * return boolean
     **/
    isAppLogon: function (resultHandler) {
       return Cordova.exec(resultHandler, null, "com.l7tech.msso.L7SMssoSDKPlugin", "isAppLogon", []);
    },

    /**
     * Method to check if the device is registered.
     *
     * return boolean
     **/
    isDeviceRegistered:function (resultHandler) {
        return Cordova.exec(resultHandler, null, "com.l7tech.msso.L7SMssoSDKPlugin", "isDeviceRegistered", []);
    },


    /**
     * Authenticate user with a username and password. The existing user session will be logout and authenticate with the provided username
     * and password.
     * @param username       		The username to authenticate with
     * @param password       		The password to authenticate with
     * @param authSuccessHandler:	Success Callback
     * @param authErrorHandler:		Error Callback
     **/
    authenticate:function (username,password,authSuccessHandler,authErrorHandler){
        return Cordova.exec(authSuccessHandler, authErrorHandler, "com.l7tech.msso.L7SMssoSDKPlugin", "authenticate", [username,password]);
    },

    /**
     *Register system status update.
     *The callback object is a JSON object that contains a dictionary with L7SStatus enum as the key
     *
     *@deprecated
     **/
    registerStatusUpdate:function (statusUpdateHandler){
        return Cordova.exec(statusUpdateHandler, null, "com.l7tech.msso.L7SMssoSDKPlugin", "registerStatusUpdate", []);
    },

    /**
     * Register error callback.
     * The callback object is a JSON object that contains a dictionary with "errorCode" as the key
     *
     *@deprecated
    */
    registerErrorCallback:function (errorCallbackHandler){
        return Cordova.exec(errorCallbackHandler, null, "com.l7tech.msso.L7SMssoSDKPlugin", "registerErrorCallback", []);
    },

     // --MASStorage Implementation--

     /*
         This is an MASStorage Object. It is used for storing data into the MASStroage provided.

         1. To create an MASStorage client object:
            var MASStorageClient = new L7SMssoSDKPlugin.MASStorage(mas_config_storage);

            The argument(mas_config_storage) is an json string of the following form:

            {
                "android":{
                    "type":"com.ca.mas.core.storage.implementation.KeyStoreStorage",
                    "mode":"false"
                    },
                "ios":{
                    "key1":"val1",
                    "key2":"val2"
                    }
            }

            Options for type are:
            1)'com.ca.mas.core.storage.implementation.EncryptedLocalStorage'
            2)'com.ca.mas.core.storage.implementation.KeyStoreStorage'

            Options for mode are:
            1)"true"
            2)"false"


         2. To make the various CRUD calls use the following commands.
            MASStorageClient.read(successCallback, errorCallback,key);
            MASStorageClient.write(successCallback, errorCallback,key,value);
            MASStorageClient.update(successCallback, errorCallback,key,value);
            MASStorageClient.writeOrUpdate(successCallback, errorCallback,key,value);
            MASStorageClient.delete(successCallback, errorCallback,key);
            MASStorageClient.deleteAll(successCallback, errorCallback);
            MASStorageClient.getAllKeys(successCallback, errorCallback);
            MASStorageClient.getType(successCallback, errorCallback);

         3. The successCallback and errorCallback are callback functions to handle the successful and failure situations respectively.
            They would accept one argument called result. The result returned would be json string which would have the following structure:

            success result structure:
            {
                "status":"SUCCESS",
                "type":"CRUD operation name",
                "data":"value"
            }

            error result structure:
            {
                "status":"FAILURE",
                "type":"CRUD operation name",
                "data":{
                    "code":105,
                    "message":"message if it exists"
                 }
            }

            function successCallback(result){
                var resultObj=JSON.parse(result);
                var status=resultObj.status;
                var type=resultObj.type;
                var data=resultObj.data;
            }
            function errorCallback(result){
                var resultObj=JSON.parse(result);
                var status=resultObj.status;
                var type=resultObj.type;
                var resultObjData=JSON.parse(resultObj.data);
                var errorCode=resultObjData.code;
                var errorMessage=resultObjData.message;
            }

        */

    MASStorage:function(config){
    this.mas_storage_config=config;

    this.getType=function(successCallback,errorCallback){
    return Cordova.exec(successCallback,errorCallback,"com.l7tech.msso.L7SMssoSDKPlugin","getType",[this.mas_storage_config])
    };
    this.read=function(successCallback,errorCallback,key){
                return Cordova.exec(successCallback,errorCallback,"com.l7tech.msso.L7SMssoSDKPlugin","read",[this.mas_storage_config,key]);
    };
    this.write=function(successCallback,errorCallback,key,value){
        return Cordova.exec(successCallback,errorCallback,"com.l7tech.msso.L7SMssoSDKPlugin","write",[this.mas_storage_config,key,value]);
    };
    this.update=function(successCallback,errorCallback,key,value){
            return Cordova.exec(successCallback,errorCallback,"com.l7tech.msso.L7SMssoSDKPlugin","update",[this.mas_storage_config,key,value]);
        };
    this.writeOrUpdate=function(successCallback,errorCallback,key,value){
            return Cordova.exec(successCallback,errorCallback,"com.l7tech.msso.L7SMssoSDKPlugin","writeOrUpdate",[this.mas_storage_config,key,value]);
        };

    this.delete=function(successCallback,errorCallback,key){
            return Cordova.exec(successCallback,errorCallback,"com.l7tech.msso.L7SMssoSDKPlugin","delete",[this.mas_storage_config,key]);
        };
    this.deleteAll=function(successCallback,errorCallback){
                return Cordova.exec(successCallback,errorCallback,"com.l7tech.msso.L7SMssoSDKPlugin","deleteAll",[this.mas_storage_config]);
     };

    this.getAllKeys=function(successCallback,errorCallback){
                return Cordova.exec(successCallback,errorCallback,"com.l7tech.msso.L7SMssoSDKPlugin","getAllKeys",[this.mas_storage_config]);
     };


    }

};

module.exports = L7SMssoSDKPlugin;