/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

package com.l7tech.msso;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.os.ResultReceiver;
import android.util.Log;
import android.util.Pair;

import com.ca.mas.core.MobileSso;
import com.ca.mas.core.MobileSsoConfigProvider;
import com.ca.mas.core.MobileSsoFactory;
import com.ca.mas.core.http.MAGRequest;
import com.ca.mas.core.http.MAGRequestBody;
import com.ca.mas.core.http.MAGResponse;
import com.ca.mas.core.io.Charsets;
import com.ca.mas.core.service.MssoClient;
import com.ca.mas.core.service.MssoIntents;
import com.ca.mas.core.storage.MASStorage;
import com.ca.mas.core.storage.MASStorageException;
import com.ca.mas.core.storage.MASStorageResult;
import com.ca.mas.core.storage.implementation.MASStorageManager;

import com.ca.mas.core.error.MAGError;
import com.ca.mas.core.error.TargetApiException;
import com.ca.mas.core.http.MAGResponse;
import com.ca.mas.core.http.MAGResponseBody;
import com.ca.mas.core.service.MssoClient;
import com.ca.mas.core.service.MssoIntents;
import com.ca.mas.core.MAGResultReceiver;
import com.ca.mas.core.http.MAGResponse;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.LOG;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class L7SMssoSDKPlugin extends CordovaPlugin {

    private static final String TAG = L7SMssoSDKPlugin.class.getCanonicalName();

    //Some of the return code are not supported, however define it as a constant for future enhancement.
    private static final int AUTHENTICATION_LOGIN_ERROR = -101;
    private static final int AUTHENTICATION_JWT_ERROR = -102;
    private static final int AUTHENTICATION_REFRESH_ERROR = -103;

    private static final int LOGOUT_ERROR = -104;
    private static final int LOGOFF_ERROR = -105;

    private static final int SOCIAL_LOGIN_ERROR = -106;

    private static final int REGISTRATION_ERROR = -201;
    private static final int DEREGISTRATION_ERROR = -202;

    private static final int LOCATION_ERROR = -301;
    private static final int NETWORK_ERROR = -401;

    private static final int HTTPCALL_ERROR = -501;

    //this is used by MAS Storage implementation.
    private static final int JSON_PARSING_ERROR=-601;

    //Action
    private static final String HTTP_CALL = "httpCall";
    private static final String LOGOUT_DEVICE = "logoutDevice";
    private static final String DE_REGISTER = "deRegister";
    private static final String LOGOFF_APP = "logoffApp";
    private static final String IS_LOGIN = "isLogin";
    private static final String IS_APP_LOGON = "isAppLogon";
    private static final String IS_DEVICE_REGISTERED = "isDeviceRegistered";
    private static final String AUTHENTICATE = "authenticate";
    private static final String REGISTER_STATUS_UPDATE = "registerStatusUpdate";
    private static final String REGISTER_ERROR_CALLBACK = "registerErrorCallback";

    //Action definition for MASStorage implementation
    private static final String MASSTORAGE_GET_TYPE ="getType";
    private static final String MASSTORAGE_READ_DATA ="read";
    private static final String MASSTORAGE_WRITE_DATA ="write";
    private static final String MASSTORAGE_UPDATE_DATA ="update";
    private static final String MASSTORAGE_WRITE_OR_UPDATE_DATA ="writeOrUpdate";
    private static final String MASSTORAGE_DELETE_DATA ="delete";
    private static final String MASSTORAGE_DELETE_ALL ="deleteAll";
    private static final String MASSTORAGE_GET_ALL_KEYS ="getAllKeys";
    private static final String MASSTORAGE_STATUS_SUCCESS ="SUCCESS";
    private static final String MASSTORAGE_STATUS_FAILURE ="FAILURE";

    //Action definition for Custom Json initialization
    private static final String INITIALIZE_WITH_JSON="initializeWithJson";

    private static final String APPLICATION_X_WWW_FORM_URLENCODED = "application/x-www-form-urlencoded";
    private static final String POST = "POST";
    private static final String GET = "GET";
    private static final String PUT = "PUT";
    private static final String DELETE = "DELETE";

    //Define parameters index
    private static final int METHOD = 0;
    private static final int HOST = 1;
    private static final int PATH = 2;
    private static final int HEADERS = 3;
    private static final int BODY = 4;

    //Define parameter index for MASStorage
    private static final String PLATFORM="android";
    private static final String TYPE_PARAMETER="type";
    private static final String MODE_PARAMETER="mode";


    private CallbackContext errorCallback;

    @Override
    public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {

        final MobileSso mobileSso;
        Context context = webView.getContext();

        if(action.equals(INITIALIZE_WITH_JSON)) {
            MobileSso temp=null;

            try {
                String configObject = args.getString(0);
                JSONObject jsonObject = new JSONObject(configObject);
                temp=MobileSsoFactory.getInstance(context, jsonObject);
                if(callbackContext!=null)
                    callbackContext.success("success");
            }catch (Exception e){
                Log.e(TAG, "Exception while initializing with custom JSON object: ", e);
                if(callbackContext!=null)
                    callbackContext.error("failure: "+e.getMessage());
            }
            mobileSso=temp;
        }
        else {
            mobileSso = MobileSsoFactory.getInstance(context);
        }

        if (action.equals(HTTP_CALL)) {

            execute(new Op() {
                @Override
                public void run() {

                    MAGRequest request = null;
                    try {
                        request = getRequest(args);
                    } catch (Exception e) {
                        LOG.e(TAG, "Invalid Request", e);
                        reportError(callbackContext);
                        return;
                    }

                    mobileSso.processRequest(request, new ResultReceiver(null) {
                        @Override
                        protected void onReceiveResult(int resultCode, Bundle resultData) {

                            if (resultCode != MssoIntents.RESULT_CODE_SUCCESS) {
                                String message = resultData.getString(MssoIntents.RESULT_ERROR_MESSAGE);
                                if (message == null) {
                                    message = "<Unknown error>";
                                }
                                LOG.e(TAG, message);
                                reportError(callbackContext, resultCode);
                            } else {
                                long requestId = resultData.getLong(MssoIntents.RESULT_REQUEST_ID);
                                if (requestId == -1 || requestId == 0) {
                                    LOG.e(TAG, "Received result included an invalid request ID");
                                    reportError(callbackContext);
                                } else {
                                    MAGResponse httpResponse = MssoClient.takeMAGResponse(requestId);
                                    if (httpResponse == null) {
                                        LOG.e(TAG, "Request was canceled");
                                        reportError(callbackContext);
                                    } else {
                                        if (httpResponse.getResponseCode() == HttpURLConnection.HTTP_OK) {
                                            try {
                                                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK,
                                                        new String(httpResponse.getBody().getRawContent())));
                                            } catch (Exception e) {
                                                LOG.e(TAG, "Unable to return result to the client", e);
                                                reportError(callbackContext);
                                            }
                                        } else {
                                            LOG.e(TAG, "Receive failed response from Server: " + httpResponse.getResponseCode());
                                            reportError(callbackContext, httpResponse.getResponseCode());
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            });
            return true;
        }
        if (action.equals(LOGOUT_DEVICE)) {
            execute(new Op() {
                @Override
                public void run() throws L7SMssoSDKPluginException {
                    try {
                        mobileSso.logout(true);
                    } catch (Exception e) {
                        throw new L7SMssoSDKPluginException(LOGOUT_ERROR, e);
                    }

                }
            });
            return true;
        }
        if (action.equals(DE_REGISTER)) {
            execute(new Op() {
                @Override
                public void run() throws L7SMssoSDKPluginException {
                    try {
                        mobileSso.removeDeviceRegistration();
                    } catch (Exception e) {
                        throw new L7SMssoSDKPluginException(DEREGISTRATION_ERROR, e);
                    }
                }
            });
            return true;
        }
        if (action.equals(LOGOFF_APP)) {
            execute(new Op() {
                @Override
                public void run() throws L7SMssoSDKPluginException {
                    try {
                        mobileSso.logoffApp();
                    } catch (Exception e) {
                        throw new L7SMssoSDKPluginException(LOGOFF_ERROR, e);
                    }
                }
            });
            return true;
        }
        if (action.equals(IS_LOGIN)) {
            execute(new Op() {
                @Override
                public void run() {
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, mobileSso.isLogin()));
                }
            });
            return true;
        }
        if (action.equals(IS_APP_LOGON)) {
            execute(new Op() {
                @Override
                public void run() {
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, mobileSso.isAppLogon()));
                }
            });
            return true;
        }
        if (action.equals(IS_DEVICE_REGISTERED)) {
            execute(new Op() {
                @Override
                public void run() {
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, mobileSso.isDeviceRegistered()));
                }
            });
            return true;
        }
        if (action.equals(AUTHENTICATE)) {
            //validate input(s).
            Log.i(TAG, "Processing  AUTHENTICATE.");
            if(args.length()<2)
            {
                callbackContext.error("missing credentials");
                return true;
            }else if(args.getString(0)==null || args.getString(0).trim().length()==0){
                callbackContext.error("empty username");
                return true;
            }else if(args.getString(1)==null || args.getString(1).trim().length()==0){
                callbackContext.error("empty password");
                return true;
            }
            try {
                final String uname = ""+args.getString(0).trim();
                final char[] pw = (""+args.getString(1).trim()).toCharArray();


                execute(new Op() {
                    @Override
                    public void run() {

                        mobileSso.authenticate(uname,pw, new MAGResultReceiver(){

                            @Override
                            public void onSuccess(MAGResponse response) {
                                String message = "Success";
                                if(response!=null){
                                    message=response.getResponseMessage()!=null? response.getResponseMessage(): ""+response.getResponseCode();
                                }
                                callbackContext.success(message);
                            }

                            @Override
                            public void onError(MAGError error) {
                                String message = "Error";
                                if(error!=null){
                                    message=error.getMessage()!=null? error.getMessage(): ""+error.getResultCode();
                                }
                                callbackContext.error(message);

                            }

                            @Override
                            public void onRequestCancelled() {
                                callbackContext.error("Cancelled");
                            }

                        });
                    }
                });

            }catch (Exception e){
                callbackContext.error("Bad inputs "+e);
                return true;
            }
            return true;
        }
        if (action.equals(REGISTER_STATUS_UPDATE)) {
            return true;
        }
        if (action.equals(REGISTER_ERROR_CALLBACK)) {
            this.errorCallback = callbackContext;
            return true;
        }
        if(action.equals(MASSTORAGE_GET_TYPE)){
            String storageType;
            String storageMode;
            try {
                String configObject = args.getString(0);
                JSONObject jsonObject = new JSONObject(configObject);
                storageType = jsonObject.getJSONObject(PLATFORM).getString(TYPE_PARAMETER);
                storageMode=jsonObject.getJSONObject(PLATFORM).getString(MODE_PARAMETER);

            }catch(JSONException e){
                String resultObject=createFailureJSONObject(MASSTORAGE_GET_TYPE,new L7SMssoSDKPluginException(JSON_PARSING_ERROR));
                callbackContext.error(resultObject);
                return false;
            }
            MASStorage currentStorage;
            MASStorageManager.MASStorageType result;
            try {
                boolean val=false;
                if(storageMode!=null){
                    val= storageMode.trim().equalsIgnoreCase("true");
                }
                currentStorage = new MASStorageManager().getStorage(storageType, new Object[]{context, val});
                result=currentStorage.getType();

                String resultObject=createSuccessJSONObject(MASSTORAGE_GET_TYPE, result);
                callbackContext.success(resultObject);
                return true;

            } catch (MASStorageException e) {
                Log.e(TAG,"Exception while instantiating secure storage"+e.getMessage());
                String resultObject= createFailureJSONObject(MASSTORAGE_GET_TYPE,e);
                callbackContext.error(resultObject);
                return false;
            }
        }
        if(action.equals(MASSTORAGE_WRITE_DATA)){
            String storageType;
            String storageMode;
            try {
                String configObject = args.getString(0);
                JSONObject jsonObject = new JSONObject(configObject);
                storageType = jsonObject.getJSONObject(PLATFORM).getString(TYPE_PARAMETER);
                storageMode=jsonObject.getJSONObject(PLATFORM).getString(MODE_PARAMETER);
            }catch(JSONException e){
                String resultObject=createFailureJSONObject(MASSTORAGE_WRITE_DATA,new L7SMssoSDKPluginException(JSON_PARSING_ERROR));
                callbackContext.error(resultObject);
                return false;
            }
            MASStorage currentStorage;
            MASStorageResult result;
            try {
                boolean val=false;
                if(storageMode!=null){
                    val= storageMode.trim().equalsIgnoreCase("true");
                }
                currentStorage = new MASStorageManager().getStorage(storageType, new Object[]{context, val});
                result=currentStorage.writeString(args.getString(1), args.getString(2));
                if(MASStorageResult.StorageOperationStatus.SUCCESS.equals(result.getStatus())){
                    String resultObject=createSuccessJSONObject(MASSTORAGE_WRITE_DATA, result.getData());
                    callbackContext.success(resultObject);
                    return true;
                }else{
                    String resultObject= createFailureJSONObject(MASSTORAGE_WRITE_DATA, (MASStorageException) result.getData());
                    callbackContext.error(resultObject);
                    return false;
                }
            } catch (MASStorageException e) {
                Log.e(TAG,"Exception while instantiating secure storage"+e.getMessage());
                String resultObject= createFailureJSONObject(MASSTORAGE_WRITE_DATA,e);
                callbackContext.error(resultObject);
                return false;
            }
        }
        if(action.equals(MASSTORAGE_READ_DATA)){
            String storageType;
            String storageMode;
            try {
                String configObject = args.getString(0);
                JSONObject jsonObject = new JSONObject(configObject);
                storageType = jsonObject.getJSONObject(PLATFORM).getString(TYPE_PARAMETER);
                storageMode=jsonObject.getJSONObject(PLATFORM).getString(MODE_PARAMETER);

            }catch(JSONException e){
                String resultObject=createFailureJSONObject(MASSTORAGE_READ_DATA,new L7SMssoSDKPluginException(JSON_PARSING_ERROR));
                callbackContext.error(resultObject);
                return false;
            }

            MASStorageResult result;
            MASStorage currentStorage;
            try {
                boolean val=false;
                if(storageMode!=null){
                    val= storageMode.trim().equalsIgnoreCase("true");
                }
                currentStorage = new MASStorageManager().getStorage(storageType, new Object[]{context, val});
                result=currentStorage.readString(args.getString(1));
                if(MASStorageResult.StorageOperationStatus.SUCCESS.equals(result.getStatus())){
                    String resultObject=createSuccessJSONObject(MASSTORAGE_READ_DATA,result.getData());
                    callbackContext.success(resultObject);
                    return true;
                }else{
                    String resultObject= createFailureJSONObject(MASSTORAGE_READ_DATA, (MASStorageException) result.getData());
                    callbackContext.error(resultObject);
                    return false;
                }

            } catch (MASStorageException e) {
                Log.e(TAG,"Exception while reading from secure storage"+e.getMessage());
                String resultObject=createFailureJSONObject(MASSTORAGE_READ_DATA, e);
                callbackContext.error(resultObject);
                return false;
            }
        }
        if(action.equals(MASSTORAGE_UPDATE_DATA)){
            String storageType;
            String storageMode;
            try {
                String configObject = args.getString(0);
                JSONObject jsonObject = new JSONObject(configObject);
                storageType = jsonObject.getJSONObject(PLATFORM).getString(TYPE_PARAMETER);
                storageMode=jsonObject.getJSONObject(PLATFORM).getString(MODE_PARAMETER);

            }catch(JSONException e){
                String resultObject=createFailureJSONObject(MASSTORAGE_UPDATE_DATA,new L7SMssoSDKPluginException(JSON_PARSING_ERROR));
                callbackContext.error(resultObject);
                return false;
            }
            MASStorageResult result;
            MASStorage currentStorage;
            try {
                boolean val=false;
                if(storageMode!=null){
                    val= storageMode.trim().equalsIgnoreCase("true");
                }
                currentStorage = new MASStorageManager().getStorage(storageType, new Object[]{context, val});
                result=currentStorage.updateString(args.getString(1),args.getString(2));
                if(MASStorageResult.StorageOperationStatus.SUCCESS.equals(result.getStatus())){
                    String resultObject=createSuccessJSONObject(MASSTORAGE_UPDATE_DATA,result.getData());
                    callbackContext.success(resultObject);
                    return true;
                }else{
                    String resultObject= createFailureJSONObject(MASSTORAGE_UPDATE_DATA, (MASStorageException) result.getData());
                    callbackContext.error(resultObject);
                    return false;
                }

            } catch (MASStorageException e) {
                Log.e(TAG, "Exception while updating from secure storage" + e.getMessage());
                String resultObject=createFailureJSONObject(MASSTORAGE_UPDATE_DATA,e);
                callbackContext.error(resultObject);
                return false;
            }

        }
        if(action.equals(MASSTORAGE_WRITE_OR_UPDATE_DATA)){
            Log.i(TAG, "in writeOrUpdate");
            String storageType;
            String storageMode;
            try {
                String configObject = args.getString(0);
                JSONObject jsonObject = new JSONObject(configObject);
                storageType = jsonObject.getJSONObject(PLATFORM).getString(TYPE_PARAMETER);
                storageMode=jsonObject.getJSONObject(PLATFORM).getString(MODE_PARAMETER);

            }catch(JSONException e){
                String resultObject=createFailureJSONObject(MASSTORAGE_WRITE_OR_UPDATE_DATA,new L7SMssoSDKPluginException(JSON_PARSING_ERROR));
                callbackContext.error(resultObject);
                return false;
            }
            MASStorageResult result;
            MASStorage currentStorage;
            try {
                boolean val=false;
                if(storageMode!=null){
                    val= storageMode.trim().equalsIgnoreCase("true");
                }
                currentStorage = new MASStorageManager().getStorage(storageType, new Object[]{context,val});
                result=currentStorage.writeOrUpdateString(args.getString(1), args.getString(2));
                if(MASStorageResult.StorageOperationStatus.SUCCESS.equals(result.getStatus())){
                    String resultObject=createSuccessJSONObject(MASSTORAGE_WRITE_OR_UPDATE_DATA,result.getData());
                    callbackContext.success(resultObject);
                    return true;
                }else{
                    String resultObject= createFailureJSONObject(MASSTORAGE_WRITE_OR_UPDATE_DATA, (MASStorageException) result.getData());
                    callbackContext.error(resultObject);
                    return false;
                }

            } catch (MASStorageException e) {
                Log.e(TAG, "Exception while writing/updating from secure storage" + e.getMessage());
                String resultObject=createFailureJSONObject(MASSTORAGE_WRITE_OR_UPDATE_DATA,e);
                callbackContext.error(resultObject);
                return false;
            }

        }
        if(action.equals(MASSTORAGE_DELETE_DATA)){
            String storageType;
            String storageMode;
            try {
                String configObject = args.getString(0);
                JSONObject jsonObject = new JSONObject(configObject);
                storageType = jsonObject.getJSONObject(PLATFORM).getString(TYPE_PARAMETER);
                storageMode=jsonObject.getJSONObject(PLATFORM).getString(MODE_PARAMETER);

            }catch(JSONException e){
                String resultObject=createFailureJSONObject(MASSTORAGE_DELETE_DATA,new L7SMssoSDKPluginException(JSON_PARSING_ERROR));
                callbackContext.error(resultObject);
                return false;
            }
            MASStorageResult result;
            MASStorage currentStorage;
            try {
                boolean val=false;
                if(storageMode!=null){
                    val= storageMode.trim().equalsIgnoreCase("true");
                }
                currentStorage = new MASStorageManager().getStorage(storageType, new Object[]{context,val});
                result=currentStorage.deleteString(args.getString(1));
                if(MASStorageResult.StorageOperationStatus.SUCCESS.equals(result.getStatus())){
                    String resultObject=createSuccessJSONObject(MASSTORAGE_DELETE_DATA,result.getData());
                    callbackContext.success(resultObject);
                    return true;
                }else{
                    String resultObject= createFailureJSONObject(MASSTORAGE_DELETE_DATA, (MASStorageException) result.getData());
                    callbackContext.error(resultObject);
                    return false;
                }

            } catch (MASStorageException e) {
                Log.e(TAG, "Exception while deleting from secure storage" + e.getMessage());
                String resultObject=createFailureJSONObject(MASSTORAGE_DELETE_DATA,e);
                callbackContext.error(resultObject);
                return false;
            }

        }

        if(action.equals(MASSTORAGE_DELETE_ALL)){
            String storageType;
            String storageMode;
            try {
                String configObject = args.getString(0);
                JSONObject jsonObject = new JSONObject(configObject);
                storageType = jsonObject.getJSONObject(PLATFORM).getString(TYPE_PARAMETER);
                storageMode=jsonObject.getJSONObject(PLATFORM).getString(MODE_PARAMETER);

            }catch(JSONException e){
                String resultObject=createFailureJSONObject(MASSTORAGE_DELETE_ALL,new L7SMssoSDKPluginException(JSON_PARSING_ERROR));
                callbackContext.error(resultObject);
                return false;
            }
            MASStorageResult result;
            MASStorage currentStorage;
            try {
                boolean val=false;
                if(storageMode!=null){
                    val= storageMode.trim().equalsIgnoreCase("true");
                }
                currentStorage = new MASStorageManager().getStorage(storageType, new Object[]{context,val});
                result=currentStorage.deleteAll();
                if(MASStorageResult.StorageOperationStatus.SUCCESS.equals(result.getStatus())){
                    String resultObject=createSuccessJSONObject(MASSTORAGE_DELETE_ALL,result.getData());
                    callbackContext.success(resultObject);
                    return true;
                }else{
                    String resultObject= createFailureJSONObject(MASSTORAGE_DELETE_ALL, (MASStorageException) result.getData());
                    callbackContext.error(resultObject);
                    return false;
                }

            } catch (MASStorageException e) {
                Log.e(TAG, "Exception while deleting from secure storage" + e.getMessage());
                String resultObject=createFailureJSONObject(MASSTORAGE_DELETE_ALL,e);
                callbackContext.error(resultObject);
                return false;
            }

        }

        if(action.equals(MASSTORAGE_GET_ALL_KEYS)){
            Log.i(TAG, "in getAllKeys");
            String storageType;
            String storageMode;
            try {
                String configObject = args.getString(0);
                JSONObject jsonObject = new JSONObject(configObject);
                storageType = jsonObject.getJSONObject(PLATFORM).getString(TYPE_PARAMETER);
                storageMode=jsonObject.getJSONObject(PLATFORM).getString(MODE_PARAMETER);

            }catch(JSONException e){
                String resultObject=createFailureJSONObject(MASSTORAGE_GET_ALL_KEYS,new L7SMssoSDKPluginException(JSON_PARSING_ERROR));
                callbackContext.error(resultObject);
                return false;
            }
            MASStorageResult result;
            MASStorage currentStorage;
            try {
                boolean val=false;
                if(storageMode!=null){
                    val= storageMode.trim().equalsIgnoreCase("true");
                }
                currentStorage = new MASStorageManager().getStorage(storageType, new Object[]{context,val});
                result=currentStorage.getAllKeys();
                if(MASStorageResult.StorageOperationStatus.SUCCESS.equals(result.getStatus())){
                    String resultObject=createSuccessJSONObject(MASSTORAGE_GET_ALL_KEYS,result.getData());
                    callbackContext.success(resultObject);
                    return true;
                }else{
                    String resultObject= createFailureJSONObject(MASSTORAGE_GET_ALL_KEYS, (MASStorageException) result.getData());
                    callbackContext.error(resultObject);
                    return false;
                }

            } catch (MASStorageException e) {
                Log.e(TAG, "Exception while getting all keys from secure storage" + e.getMessage());
                String resultObject=createFailureJSONObject(MASSTORAGE_GET_ALL_KEYS,e);
                callbackContext.error(resultObject);
                return false;
            }

        }

        return false;
    }

    private interface Op {
        void run() throws L7SMssoSDKPluginException;
    }

    private void reportError(CallbackContext callbackContext) {
        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, createJSONObject(HTTPCALL_ERROR)));
    }

    private void reportError(CallbackContext callbackContext, int resultCode) {
        switch (resultCode) {
            case MssoIntents.RESULT_CODE_ERR_AUTHORIZE:
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, createJSONObject(SOCIAL_LOGIN_ERROR)));
                return;
            case HttpURLConnection.HTTP_UNAUTHORIZED:
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, createJSONObject(AUTHENTICATION_LOGIN_ERROR)));
                return;
            case MssoIntents.RESULT_CODE_ERR_CANCELED:
                return;
            default:
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, createJSONObject(HTTPCALL_ERROR)));
        }

    }

    private void execute(final Op op) {

        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    op.run();
                } catch (L7SMssoSDKPluginException e) {
                    LOG.e(TAG, "SDK Plugin Error", e);
                    PluginResult result = new PluginResult(PluginResult.Status.OK, createJSONObject(e.getErrorCode()));
                    result.setKeepCallback(true);
                    if (errorCallback != null) {
                        errorCallback.sendPluginResult(result);
                    }
                } catch (Exception e) {
                    LOG.e(TAG, "Unknown Error", e);
                }
            }
        });
    }

    private JSONObject createJSONObject(int errorCode) {
        try {
            return (new JSONObject()).put("errorCode", errorCode);
        } catch (JSONException e) {
            LOG.e(TAG, "Unable to create Json object", e);
        }
        return null;
    }

    private MAGRequest getRequest(final JSONArray args) throws JSONException, UnsupportedEncodingException, URISyntaxException {
        if (args.length() < 2) {
            throw new IllegalArgumentException("Method and Host may missing from the parameter.");
        }
        String method = args.getString(METHOD);
        if (POST.equals(method) || PUT.equals(method)) {
            return getPostRequest(method, args.getString(HOST), getString(args, PATH), (JSONObject) get(args, HEADERS), get(args, BODY));
        } else if (GET.equals(method) || DELETE.equals(method)) {
            return getGetRequest(method, args.getString(HOST), getString(args, PATH), (JSONObject) get(args, HEADERS), (JSONObject) get(args, BODY));
        }
        throw new IllegalArgumentException("Invalid http method");
    }

    private MAGRequest getPostRequest(String method, String host, String path, JSONObject headers, Object data) throws URISyntaxException, UnsupportedEncodingException, JSONException {

        String url = host;
        if (path != null) {
            url += path;
        }
        URI uri = new URI(url);

        String contentType = headers != null? headers.getString("Content-Type"):null;
        MAGRequestBody requestBody =  null;
        if (data != null) {

            if (contentType == null || APPLICATION_X_WWW_FORM_URLENCODED.equals(contentType)) {
                //default to application/x-www-form-urlencoded
                List<Pair<String, String>> formBody = new ArrayList();
                Iterator<String> i = ((JSONObject) data).keys();
                while (i.hasNext()) {
                    String key = i.next();
                    formBody.add(new Pair<String,String>(key,((JSONObject) data).get(key).toString()));
                }
                requestBody = MAGRequestBody.urlEncodedFormBody(formBody);

            } else {
                requestBody = MAGRequestBody.stringBody(data.toString());
            }
        }

        MAGRequest.MAGRequestBuilder requestBuilder = new MAGRequest.MAGRequestBuilder(uri);

        if (POST.equals(method)) {
            requestBuilder = requestBuilder.post(requestBody);
        } else {
            requestBuilder = requestBuilder.put(requestBody);
        }

        if (headers != null) {
            Iterator<String> i = headers.keys();
            while (i.hasNext()) {
                String key = i.next();
                requestBuilder.header(key, (String) headers.get(key));
            }
        }

        return requestBuilder.build();

    }

    private MAGRequest getGetRequest(String method, String host, String path, JSONObject headers, JSONObject params) throws URISyntaxException, UnsupportedEncodingException, JSONException {

        Uri.Builder builder = Uri.parse(host).buildUpon();
        if (path != null) {
            builder.path(path);
        }

        if (params != null && params.length() > 0) {
            Iterator<String> i = params.keys();
            while (i.hasNext()) {
                String key = i.next();
                builder.appendQueryParameter(key, (String) params.get(key));
            }
        }

        URI endpoint = new URI(builder.toString());

        MAGRequest.MAGRequestBuilder requestBuilder = new MAGRequest.MAGRequestBuilder(endpoint);
        if (GET.equals(method)) {
            requestBuilder = requestBuilder.get();
        } else {
            requestBuilder = requestBuilder.delete(null);
        }
        if (headers != null) {
            Iterator<String> i = headers.keys();
            while (i.hasNext()) {
                String key = i.next();
                requestBuilder.header(key, (String) headers.get(key));
            }
        }

        return requestBuilder.build();

    }

    private String urlEncode(String s) throws UnsupportedEncodingException {
        return s == null ? null : URLEncoder.encode(s, Charsets.UTF8.name());
    }

    private Object get(final JSONArray args, int index) {
        try {
            return args.get(index);
        } catch (JSONException e) {
            return null;
        }
    }

    private String getString(final JSONArray args, int index) {
        try {
            return args.getString(index);
        } catch (JSONException e) {
            return null;
        }
    }

    //MASStorage Utility methods

    private String createSuccessJSONObject(String methodType,Object resultData){
        JSONObject successJSONObject=new JSONObject();
        try {
            successJSONObject.put("status", MASSTORAGE_STATUS_SUCCESS);
            successJSONObject.put("type", methodType);

            if(methodType.equals(MASSTORAGE_GET_ALL_KEYS)){
                JSONArray arr=new JSONArray();
                if(resultData instanceof ArrayList){
                    ArrayList<String> al= (ArrayList) resultData;
                    for(String s: al){
                        arr.put(s);
                    }
                }
                successJSONObject.put("data",arr);
            }else{
                String data=String.valueOf(resultData);
                successJSONObject.put("data",data);
            }

        } catch (JSONException e) {
            Log.e(TAG,"error while json parsing",e);
        }
        return successJSONObject.toString();
    }

    private String createFailureJSONObject(String methodType, Exception exception){

        JSONObject failureJSONObject= new JSONObject();
        try {
            failureJSONObject.put("status", MASSTORAGE_STATUS_FAILURE);
            failureJSONObject.put("type", methodType);

            JSONObject errorDataObject=new JSONObject();

            if(exception instanceof MASStorageException){
                errorDataObject.put("code",String.valueOf(((MASStorageException)exception).getCode()));
            }
            if(exception instanceof  L7SMssoSDKPluginException){
                errorDataObject.put("code",String.valueOf(((L7SMssoSDKPluginException) exception).getErrorCode()));
            }

            errorDataObject.put("message",exception.getMessage());

            failureJSONObject.put("data", errorDataObject.toString());


        } catch (JSONException e) {
            Log.e(TAG, "error while json parsing", e);
        }
        return failureJSONObject.toString();
    }

}
