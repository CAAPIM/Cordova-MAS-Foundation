/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

package com.ca.mas.cordova.core;

import android.app.Activity;
import android.app.DialogFragment;
import android.content.Context;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.util.Pair;
import android.widget.ImageView;

import com.ca.mas.foundation.MAS;
import com.ca.mas.foundation.MASAuthenticationListener;
import com.ca.mas.foundation.MASCallback;
import com.ca.mas.foundation.MASConstants;
import com.ca.mas.foundation.MASOtpAuthenticationHandler;
import com.ca.mas.foundation.MASRequest;
import com.ca.mas.foundation.MASRequestBody;
import com.ca.mas.foundation.MASResponse;
import com.ca.mas.foundation.MASUser;
import com.ca.mas.foundation.auth.MASAuthenticationProviders;
import com.ca.mas.foundation.auth.MASProximityLogin;
import com.ca.mas.foundation.auth.MASProximityLoginQRCode;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


public class MASCommand {

    private static final String TAG = MASCommand.class.getCanonicalName();
    private static final String REQUEST_CANCELLATION_MSG_KEY = "REQUEST_CANCELLATION_MSG_KEY";

    private static MASOtpAuthenticationHandler masOtpAuthenticationHandlerStatic;
    private static CallbackContext AUTH_LISTENER_CALLBACK;
    private static CallbackContext OTP_AUTH_LISTENER_CALLBACK;
    private static CallbackContext OTP_CHANNEL_SELECT_LISTENER_CALLBACK;

    /**
     * {@link StartCommand} will initiate the MAS functionality and is required to be called before calling other MAS functions.
     */
    public static class StartCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, CallbackContext callbackContext) {
            try {
                MAS.start(context, true);
                String result="Start Complete";
                callbackContext.success(result);
            } catch (Exception e) {
                Log.e(TAG, e.getMessage(), e);
                callbackContext.error(getError(e));
            }
        }

        @Override
        public String getAction() {
            return "start";
        }

    }

    /**
     * {@link GenerateAndSendOTPCommand} Request Server to generate and send OTP to the channels provided.
     */
    public static class GenerateAndSendOTPCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            try {
                JSONArray channels = args.getJSONArray(0);//String(0);
                StringBuilder channelResult = new StringBuilder();
                for (int i = 0; i < channels.length(); i++) {
                    channelResult.append(channels.get(i));
                    if (i != channels.length() - 1) {
                        channelResult.append(",");
                    }
                }

                masOtpAuthenticationHandlerStatic.deliver(channelResult.toString(), new MASCallback<Void>() {

                    @Override
                    public void onSuccess(Void result) {
                        callbackContext.success("true");
                    }

                    @Override
                    public void onError(Throwable e) {
                        callbackContext.error(getError(e));
                    }
                });
            } catch (Exception e) {
                Log.e(TAG, e.getMessage(), e);
                callbackContext.error(getError(e));
            }
        }

        @Override
        public String getAction() {
            return "generateAndSendOTP";
        }

    }

    /**
     * {@link ValidateOtpCommand} will validate the passed OTP.
     */
    public static class ValidateOtpCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            try {
                String otp = args.getString(0);
                masOtpAuthenticationHandlerStatic.proceed(context, otp);
            } catch (Exception e) {
                Log.e(TAG, e.getMessage(), e);
                callbackContext.error(getError(e));
            }
        }

        @Override
        public String getAction() {
            return "validateOTP";
        }

    }

    /**
     * {@link CancelGenerateAndSendOTPCommand} Cancels the current user's generating and sending OTP call.
     */
    public static class CancelGenerateAndSendOTPCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            try {
                masOtpAuthenticationHandlerStatic.cancel();

            } catch (Exception e) {
                Log.e(TAG, e.getMessage(), e);
                callbackContext.error(getError(e));
            }
        }

        @Override
        public String getAction() {
            return "cancelGenerateAndSendOTP";
        }

    }

    /**
     * {@link CancelOTPValidationCommand} Cancels the current user's authentication session validation.
     */
    public static class CancelOTPValidationCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            try {
                masOtpAuthenticationHandlerStatic.cancel();
            } catch (Exception e) {
                Log.e(TAG, e.getMessage(), e);
                callbackContext.error(getError(e));
            }
        }

        @Override
        public String getAction() {
            return "cancelOTPValidation";
        }

    }

    /* to maintain consistency with IOS */

    /**
     * {@link setOTPChannelSelectorListenerCommand} sets the OTP channel listener to the passed callbackContext
     */
    public static class setOTPChannelSelectorListenerCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            OTP_CHANNEL_SELECT_LISTENER_CALLBACK = callbackContext;
        }

        @Override
        public String getAction() {
            return "setOTPChannelSelectorListener";
        }

    }

    /* to maintain consistency with IOS */

    /**
     * {@link setOTPAuthenticationListenerCommand} sets the OTP Authentication listener callback to the passed callbackContext.
     */
    public static class setOTPAuthenticationListenerCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            OTP_AUTH_LISTENER_CALLBACK = callbackContext;
        }

        @Override
        public String getAction() {
            return "setOTPAuthenticationListener";
        }

    }

    /**
     * {@link SetAuthenticationListenerCommand} will set the Authentication listener which will receive callbacks for AuthenticationRequest,OTP.
     */
    public static class SetAuthenticationListenerCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            AUTH_LISTENER_CALLBACK = callbackContext;
            try {
                MAS.setAuthenticationListener(new MASAuthenticationListener() {
                    @Override
                    public void onAuthenticateRequest(Context context, long requestId, MASAuthenticationProviders masAuthenticationProviders) {
                        JSONObject jsonObject = new JSONObject();
                        try {
                            MASProximityLogin qrcode = new MASProximityLoginQRCode(){
                                @Override
                                protected void onAuthCodeReceived(String code) {
                                    super.onAuthCodeReceived(code);
                                    String data = "qrCodeAuthorizationComplete";
                                    PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, data);
                                    pluginResult.setKeepCallback(true);
                                    AUTH_LISTENER_CALLBACK.sendPluginResult(pluginResult);
                                }
                                @Override
                                public void close() {
                                    super.close();
                                    String data = "removeQRCode";
                                    PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, data);
                                    pluginResult.setKeepCallback(true);
                                    AUTH_LISTENER_CALLBACK.sendPluginResult(pluginResult);
                                }
                            };
                            MASUtil.setQrCode(qrcode);
                            boolean init = qrcode.init((Activity)context, requestId, masAuthenticationProviders);
                            String encodedImage="";
                            if(init){
                                ImageView image= (ImageView)qrcode.render();
                                Bitmap bitmap = ((BitmapDrawable)image.getDrawable()).getBitmap();
                                ByteArrayOutputStream byteArrOutStream= new ByteArrayOutputStream();
                                bitmap.compress(Bitmap.CompressFormat.PNG,100,byteArrOutStream);
                                byte byteImgArr[]=byteArrOutStream.toByteArray();
                                encodedImage=Base64.encodeToString(byteImgArr,Base64.DEFAULT);
                            }
                            jsonObject.put("requestType", "Login");
                            jsonObject.put("requestId", requestId);
                            jsonObject.put("qrCodeImageBase64",encodedImage);
                            qrcode.start();
                        } catch (Exception e) {
                            Log.e(TAG, e.getMessage(), e);
                        }
                        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, jsonObject);
                        pluginResult.setKeepCallback(true);
                        AUTH_LISTENER_CALLBACK.sendPluginResult(pluginResult);
                    }

                    @Override
                    public void onOtpAuthenticateRequest(Context context, MASOtpAuthenticationHandler masOtpAuthenticationHandler) {
                        masOtpAuthenticationHandlerStatic = masOtpAuthenticationHandler;
                        JSONArray jsonArray = new JSONArray();
                        try {
                            //jsonObject.put("requestType", "OTP");
                            JSONObject jsonObject = new JSONObject();
                            if (masOtpAuthenticationHandler.isInvalidOtp()) {
                                jsonObject.put("isInvalidOtp", "true");
                                jsonObject.put("errorMessage","Otp is invalid");
                                PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, jsonObject);
                                pluginResult.setKeepCallback(true);
                                OTP_AUTH_LISTENER_CALLBACK.sendPluginResult(pluginResult);
                                return;
                            } else {
                                List<String> channels = masOtpAuthenticationHandler.getChannels();
                                if (channels != null) {
                                    StringBuffer channelResult = new StringBuffer();
                                    for (int i = 0; i < channels.size(); i++) {
                                        channelResult.append(channels.get(i));
                                        jsonArray.put(channels.get(i));
                                        if (i != channels.size() - 1) {
                                            channelResult.append(",");
                                        }
                                    }
                                    //jsonObject.put("channels", channelResult);
                                }
                            }
                        } catch (Exception e) {
                            Log.e(TAG, e.getMessage(), e);
                        }
                        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, jsonArray);
                        pluginResult.setKeepCallback(true);
                        OTP_CHANNEL_SELECT_LISTENER_CALLBACK.sendPluginResult(pluginResult);
                    }
                });
            } catch (Exception e) {
                Log.e(TAG, e.getMessage(), e);
                PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR, getError(e));
                pluginResult.setKeepCallback(true);
                AUTH_LISTENER_CALLBACK.sendPluginResult(pluginResult);
            }
        }

        @Override
        public String getAction() {
            return "setAuthenticationListener";
        }

    }

    /**
     * {@link CancelRequestCommand} will cancel the request based on the requestId passed.
     */
    public static class CancelRequestCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, CallbackContext callbackContext) {
            try {
                String requestId = args.getString(0);
                MAS.cancelRequest(Long.getLong(requestId));
                success(callbackContext, true);
            } catch (Exception e) {
                Log.e(TAG, e.getMessage(), e);
                callbackContext.error(getError(e));
            }
        }

        @Override
        public String getAction() {
            return "cancelRequest";
        }

    }

    /**
     * {@link StartWithDefaultConfigurationCommand} initiates the MAS functionality by choosing to use the Default Configuration
     */

    public static class StartWithDefaultConfigurationCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, CallbackContext callbackContext) {
            try {
                boolean shouldUseDefault = args.getBoolean(0);
                MAS.start(context, shouldUseDefault);
                String result="Start complete";
                callbackContext.success(result);
            } catch (Exception e) {
                Log.e(TAG, e.getMessage(), e);
                callbackContext.error(getError(e));
            }
        }

        @Override
        public String getAction() {
            return "startWithDefaultConfiguration";
        }

    }

    /**
     * {@link GatewayIsReachableCommand} checks if the gateway is reachable.
     */

    public static class GatewayIsReachableCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            try {
                MAS.gatewayIsReachable(new MASCallback<Boolean>() {
                    @Override
                    public void onSuccess(Boolean result) {
                        success(callbackContext,result);
                    }

                    @Override
                    public void onError(Throwable e) {
                        Log.e(TAG, e.getMessage(), e);
                        callbackContext.error(getError(e));
                    }
                });
            } catch (Exception e) {
                Log.e(TAG, e.getMessage(), e);
                callbackContext.error(getError(e));
            }
        }

        @Override
        public String getAction() {
            return "gatewayIsReachable";
        }

    }

    /**
     * {@link UseNativeMASUICommand} will set the native MASUI interfaces instead of html cordova pages for login, OTP and others.
     */
    public static class UseNativeMASUICommand extends Command {
        private static DialogFragment getLoginFragment(long requestID, MASAuthenticationProviders providers) {
            try {
                Class<?> c = Class.forName("com.ca.mas.ui.MASLoginFragment");
                return (DialogFragment) c.getMethod("newInstance", long.class, MASAuthenticationProviders.class).invoke(null, requestID, providers);
            } catch (Exception e) {
                return null;
            }
        }

        private static DialogFragment getOtpSelectDeliveryChannelFragment(MASOtpAuthenticationHandler handler) {
            try {
                Class<?> c = Class.forName("com.ca.mas.ui.otp.MASOtpSelectDeliveryChannelFragment");
                return (DialogFragment) c.getMethod("newInstance",  MASOtpAuthenticationHandler.class).invoke(null, handler);
            } catch (Exception e) {
                return null;
            }
        }

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            MAS.setAuthenticationListener(new MASAuthenticationListener() {
                @Override
                public void onAuthenticateRequest(Context context, long requestId, MASAuthenticationProviders providers){
                    android.app.DialogFragment loginFragment = getLoginFragment(requestId,providers);
                    if(loginFragment!=null) {
                        loginFragment.show(((Activity) context).getFragmentManager(), "logonDialog");
                    }

                }

                @Override
                public void onOtpAuthenticateRequest(Context context, MASOtpAuthenticationHandler handler) {
                    android.app.DialogFragment otpFragment = getOtpSelectDeliveryChannelFragment(handler);
                    if(otpFragment!=null){
                        otpFragment.show(((Activity) context).getFragmentManager(), "OTPDialog");
                    }

                }
            });
            success(callbackContext,true);
        }

        @Override
        public String getAction() {
            return "useNativeMASUI";
        }

    }

    /**
     * {@link StartWithJSONCommand} initites the MAS functionality by accepting a json as configuration parameters.
     */
    public static class StartWithJSONCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, CallbackContext callbackContext) {
            try {
                JSONObject jsonObject = args.getJSONObject(0);
                MAS.start(context, jsonObject);
                success(callbackContext, true);
            } catch (Exception e) {
                Log.e(TAG, e.getMessage(), e);
                callbackContext.error(getError(e));
            }
        }

        @Override
        public String getAction() {
            return "startWithJSON";
        }

    }

    /**
     * {@link StopCommand} stops the MAS functionality.
     */
    public static class StopCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, CallbackContext callbackContext) {
            try {
                MAS.stop();
                String result="Stop Complete";
                callbackContext.success(result);
            } catch (Exception e) {
                Log.e(TAG, e.getMessage(), e);
                callbackContext.error(getError(e));
            }
        }

        @Override
        public String getAction() {
            return "stop";
        }

    }

    /**
     * {@link SetConfigFileNameCommand} sets the config filename,if present,that is used to initiate MAS functionality.
     */

    public static class SetConfigFileNameCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, CallbackContext callbackContext) {
            try {
                String filename = args.getString(0);
                AssetManager mg = context.getResources().getAssets();
                try {
                    mg.open(filename);
                } catch (IOException e) {
                    MASCordovaException exception=new MASCordovaException("File not found",e);
                    Log.e(TAG, exception.getMessage(), exception);
                    callbackContext.error(getError(exception));
                    return;
                }
                MAS.setConfigurationFileName(filename);
                String result="Config file name is set";
                callbackContext.success(result);
            } catch (Exception e) {
                Log.e(TAG, e.getMessage(), e);
                callbackContext.error(getError(e));
            }
        }

        @Override
        public String getAction() {
            return "setConfigFileName";
        }
    }

    /**
     * {@link SetGrantFlowCommand} is used to set grant flow as password or client credentials
     */
    public static class SetGrantFlowCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, CallbackContext callbackContext) {

            try {
                int grantFlow = args.getInt(0);
                switch (grantFlow) {
                    case 0:
                        grantFlow = MASConstants.MAS_GRANT_FLOW_CLIENT_CREDENTIALS;
                        break;
                    case 1:
                        grantFlow = MASConstants.MAS_GRANT_FLOW_PASSWORD;
                        break;
                    default:
                        throw new UnsupportedOperationException("No such flow present");
                }

                MAS.setGrantFlow(grantFlow);
                String result="Grant flow is set";
                callbackContext.success(result);
            } catch (Exception e) {
                Log.e(TAG, e.getMessage(), e);
                callbackContext.error(getError(e));
            }
        }

        @Override
        public String getAction() {
            return "setGrantFlow";
        }

    }


    private static abstract class InvokeCommand extends Command {

        protected static final int MAS_REQUEST_RESPONSE_TYPE_JSON = 0;
        protected static final int MAS_REQUEST_RESPONSE_TYPE_SCIM_JSON = 1;
        protected static final int MAS_REQUEST_RESPONSE_TYPE_TEXT_PLAIN = 2;
        protected static final int MAS_REQUEST_RESPONSE_TYPE_WWW_FORM_URL_ENCODED = 3;
        protected static final int MAS_REQUEST_RESPONSE_TYPE_XML = 4;

        private static final int PATH = 0;
        private static final int PARAMETERS = 1;
        private static final int HEADERS = 2;
        private static final int REQUEST_TYPE = 3;

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            try {
                JSONObject parameters = args.optJSONObject(PARAMETERS);
                JSONObject headers = args.optJSONObject(HEADERS);
                String path = args.getString(PATH);
                final int requestType = args.getInt(REQUEST_TYPE);
                MASRequest.MASRequestBuilder builder = getRequestBuilder(path, parameters, requestType);
                if (headers != null && headers.names() != null) {
                    for (int i = 0; i < headers.names().length(); i++) {
                        String name = headers.names().getString(i);
                        String value = headers.getString(name);
                        builder.header(name, value);
                    }
                }
                builder.notifyOnCancel();
                MAS.invoke(builder.build(), new MASCallback<MASResponse<Object>>() {

                    @Override
                    public void onSuccess(MASResponse masResponse) {
                        JSONObject response = new JSONObject();
                        Object content = masResponse.getBody().getContent();
                        if (content != null) {
                            try {
                                response.put("MASResponseInfoBodyInfoKey", content);
                            } catch (JSONException ignore) {
                            }
                        }
                        Map<String, List<String>> responseHeaders =masResponse.getHeaders();
                        if (responseHeaders != null) {
                            JSONObject headerJson = new JSONObject();
                            for (String h : responseHeaders.keySet()) {
                                List<String> hv = responseHeaders.get(h);
                                if (hv != null && !hv.isEmpty()) {
                                    try {
                                        headerJson.put(h, hv.get(0));
                                    } catch (JSONException ignore) {
                                    }
                                }
                            }
                            try {
                                response.put("MASResponseInfoHeaderInfoKey", headerJson);
                            } catch (JSONException ignore) {
                            }
                        }
                        callbackContext.success(response);
                    }

                    @Override
                    public void onError(Throwable throwable) {
                        if (throwable instanceof  MAS.RequestCancelledException) {
                            JSONObject error = new JSONObject();
                            String errorMessage = "Request Cancelled";

                            try {
                                if ((((MAS.RequestCancelledException) throwable).getData() != null &&
                                        ((MAS.RequestCancelledException) throwable).getData().get(REQUEST_CANCELLATION_MSG_KEY) != null)) {
                                    errorMessage =(String) ((MAS.RequestCancelledException) throwable).getData().get(REQUEST_CANCELLATION_MSG_KEY);
                                }
                                error.put("errorMessage", errorMessage);
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                            callbackContext.error(error);
                        } else
                            callbackContext.error(getError(throwable));
                    }
                });
            } catch (Exception e) {
                Log.e(TAG, e.getMessage(), e);
                callbackContext.error(getError(e));
            }
        }

        protected Uri getUri(String path, JSONObject parameters) throws JSONException {
            Uri.Builder uriBuilder = new Uri.Builder();
            uriBuilder.encodedPath(path);
            if (parameters != null && parameters.names() != null) {
                for (int i = 0; i < parameters.names().length(); i++) {
                    String name = parameters.names().getString(i);
                    String value = parameters.getString(name);
                    uriBuilder.appendQueryParameter(name, value);
                }
            }
            return uriBuilder.build();
        }

        public abstract MASRequest.MASRequestBuilder getRequestBuilder(String path, JSONObject parameters, int requestType) throws Exception;

    }

    /**
     * {@link GetFromPathCommand} Request method for an HTTP GET Call to the Gateway.
     */
    public static class GetFromPathCommand extends InvokeCommand {

        @Override
        public String getAction() {
            return "getFromPath";
        }

        @Override
        public MASRequest.MASRequestBuilder getRequestBuilder(String path, JSONObject parameters, int requestType) throws Exception {
            return new MASRequest.MASRequestBuilder(getUri(path, parameters)).get();

        }
    }

    /**
     * {@link DeleteFromPathCommand} Request method for an HTTP DELETE Call to the Gateway.
     */
    public static class DeleteFromPathCommand extends InvokeCommand {

        @Override
        public String getAction() {
            return "deleteFromPath";
        }

        @Override
        public MASRequest.MASRequestBuilder getRequestBuilder(String path, JSONObject parameters, int requestType) throws Exception {
            return new MASRequest.MASRequestBuilder(getUri(path, parameters)).delete(null);
        }
    }

    /**
     * {@link PutToPathCommand} Request method for an HTTP PUT Call to the Gateway.
     */
    public static class PutToPathCommand extends InvokeCommand {

        @Override
        public String getAction() {
            return "putToPath";
        }

        @Override
        public MASRequest.MASRequestBuilder getRequestBuilder(String path, JSONObject parameters, int requestType) throws Exception {
            MASRequest.MASRequestBuilder builder = new MASRequest.MASRequestBuilder(new URI(path));
            if (parameters != null) {
                switch (requestType) {
                    case MAS_REQUEST_RESPONSE_TYPE_JSON:
                    case MAS_REQUEST_RESPONSE_TYPE_SCIM_JSON:
                        builder.put(MASRequestBody.jsonBody(parameters));
                        break;
                    case MAS_REQUEST_RESPONSE_TYPE_TEXT_PLAIN:
                    case MAS_REQUEST_RESPONSE_TYPE_XML:
                        if (parameters.names().length() > 0) {
                            builder.put(MASRequestBody.stringBody(parameters.getString(parameters.names().getString(0))));
                        }
                        break;
                    case MAS_REQUEST_RESPONSE_TYPE_WWW_FORM_URL_ENCODED:
                        List<Pair<String, String>> list = new ArrayList<>();
                        for (int i = 0; i < parameters.names().length(); i++) {
                            String name = parameters.names().getString(i);
                            String value = parameters.getString(name);
                            list.add(new Pair<>(name, value));
                        }
                        builder.put(MASRequestBody.urlEncodedFormBody(list));
                        break;
                }
            }
            return builder;
        }
    }

    /**
     * {@link PostToPathCommand} Request method for an HTTP POST Call to the Gateway.
     */
    public static class PostToPathCommand extends InvokeCommand {

        @Override
        public String getAction() {
            return "postToPath";
        }

        @Override
        public MASRequest.MASRequestBuilder getRequestBuilder(String path, JSONObject parameters, int requestType) throws Exception {
            MASRequest.MASRequestBuilder builder = new MASRequest.MASRequestBuilder(new URI(path));
            if (parameters != null) {
                switch (requestType) {
                    case MAS_REQUEST_RESPONSE_TYPE_JSON:
                    case MAS_REQUEST_RESPONSE_TYPE_SCIM_JSON:
                        builder.post(MASRequestBody.jsonBody(parameters));
                        break;
                    case MAS_REQUEST_RESPONSE_TYPE_TEXT_PLAIN:
                    case MAS_REQUEST_RESPONSE_TYPE_XML:
                        if (parameters.names().length() > 0) {
                            builder.post(MASRequestBody.stringBody(parameters.getString(parameters.names().getString(0))));
                        }
                        break;
                    case MAS_REQUEST_RESPONSE_TYPE_WWW_FORM_URL_ENCODED:
                        List<Pair<String, String>> list = new ArrayList<>();
                        for (int i = 0; i < parameters.names().length(); i++) {
                            String name = parameters.names().getString(i);
                            String value = parameters.getString(name);
                            list.add(new Pair<>(name, value));
                        }
                        builder.post(MASRequestBody.urlEncodedFormBody(list));
                        break;
                }
            }
            return builder;
        }
    }

    /**
     * {@link AuthorizeCommand} is used to authorize the user with scanned url from the QRCode image
     */
    public static class AuthorizeCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            String url;
            try {
                url = (String) args.get(0);
            } catch (JSONException e) {
                callbackContext.error(getError(e));
                return;
            }

            MASProximityLoginQRCode.authorize(url, new MASCallback<Void>() {
                @Override
                public void onSuccess(Void result) {
                    String msg = "QR Code authorized successfully!";
                    callbackContext.success(msg);
                }


                @Override
                public void onError(Throwable e) {
                    //context.showMessage(e.getMessage(), Toast.LENGTH_LONG);
                    Log.e(TAG, e.getMessage(), e);
                    callbackContext.error(getError(e));
                }
            });
        }

        @Override
        public String getAction() {
            return "authorizeQRCode";
        }
    }

    /**
     * {@link CompleteAuthenticationCommand} is used to complete the authentication for the current user by providing username and password
     */

    public static class CompleteAuthenticationCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            String username;
            String password;
            try {
                username = (String) args.get(0);
                password = (String) args.get(1);
            } catch (JSONException e) {
                callbackContext.error(getError(e));
                return;
            }
            MASUser.login(username, password, new MASCallback<MASUser>() {
                @Override
                public void onSuccess(MASUser masUser) {

                    PluginResult pluginResult = new PluginResult(PluginResult.Status.OK);
                    pluginResult.setKeepCallback(true);
                    callbackContext.sendPluginResult(pluginResult);
                    MASUtil.getQrCode().stop();
                }

                @Override
                public void onError(Throwable error) {
                    Log.e(TAG, error.getMessage(), error);
                    callbackContext.error(getError(error));

                }
            });
        }

        @Override
        public String getAction() {
            return "completeAuthentication";
        }
    }

    /**
     * {@link CancelAuthenticationCommand} cancels the login request already made
     */

    public static class CancelAuthenticationCommand extends Command {
        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            try {
                int requestId = args.getInt(0);
                if (requestId == 0) {
                    Log.e(TAG, "request Id is empty");
                    callbackContext.error("request Id is  empty");
                }
                String cancellationMessage = "Request cancelled";
                try {
                    if (args.getString(1) != null && args.getString(1) != "null" )
                        cancellationMessage = args.getString(1);
                } catch (Exception e) {
                    Log.e(TAG, e.getMessage());
                }
                MASUtil.getQrCode().stop();
                Bundle bundle = new Bundle();
                bundle.putString(REQUEST_CANCELLATION_MSG_KEY, cancellationMessage);
                MAS.cancelRequest(requestId, bundle);
                success(callbackContext, true);
            } catch (Exception e) {
                Log.e(TAG, e.getMessage(), e);
                callbackContext.error(getError(e));
            }
        }

        @Override
        public String getAction() {
            return "cancelAuthentication";
        }
    }
}
