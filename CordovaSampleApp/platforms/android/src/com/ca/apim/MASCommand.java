/*
 * Copyright (c) 2016 CA, Inc.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

package com.ca.apim;

import android.content.Context;
import android.net.Uri;
import android.util.Log;
import android.util.Pair;

import com.ca.mas.foundation.MAS;
import com.ca.mas.foundation.MASAuthenticationListener;
import com.ca.mas.foundation.MASCallback;
import com.ca.mas.foundation.MASConstants;
import com.ca.mas.foundation.MASOtpAuthenticationHandler;
import com.ca.mas.foundation.MASRequest;
import com.ca.mas.foundation.MASRequestBody;
import com.ca.mas.foundation.MASResponse;
import com.ca.mas.foundation.auth.MASAuthenticationProviders;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class MASCommand {

    private static final String TAG = MASCommand.class.getCanonicalName();

    public static class StartCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, CallbackContext callbackContext) {
            try {
                MAS.start(context);
                success(callbackContext, true);
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

    public static class SetAuthenticationListenerCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            try {
                MAS.setAuthenticationListener(new MASAuthenticationListener() {
                    @Override
                    public void onAuthenticateRequest(Context context, long requestId, MASAuthenticationProviders masAuthenticationProviders) {
                        JSONObject jsonObject = new JSONObject();
                        try {
                            jsonObject.put("requestType", "Login");
                            jsonObject.put("requestId", requestId);
                        } catch (Exception e ) {
                            Log.e(TAG, e.getMessage(), e);
                        }
                        callbackContext.success(jsonObject);
                    }

                    @Override
                    public void onOtpAuthenticateRequest(Context context, MASOtpAuthenticationHandler masOtpAuthenticationHandler) {
                        JSONObject jsonObject = new JSONObject();
                        try {
                            jsonObject.put("requestType", "OTP");
                           List<String> channels= masOtpAuthenticationHandler.getChannels();
                            StringBuffer channelResult=new StringBuffer();
                            for(int i=0;i<channels.size();i++){
                                channelResult.append(channels.get(i));
                                if(i!=channels.size()-1){
                                    channelResult.append(",");
                                }
                            }
                         jsonObject.put("channels", channelResult);
                        } catch (Exception e ) {
                            Log.e(TAG, e.getMessage(), e);
                        }
                        callbackContext.success(jsonObject);
                    }
                });
            } catch (Exception e) {
                Log.e(TAG, e.getMessage(), e);
                callbackContext.error(getError(e));
            }
        }

        @Override
        public String getAction() {
            return "setAuthenticationListener";
        }

    }

    public static class StartWithDefaultConfigurationCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, CallbackContext callbackContext) {
            try {
                boolean shouldUseDefault = args.getBoolean(0);
                MAS.start(context, shouldUseDefault);
                success(callbackContext, true);
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

    public static class StopCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, CallbackContext callbackContext) {
            try {
                MAS.stop();
                success(callbackContext, true);
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

    public static class SetConfigFileNameCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, CallbackContext callbackContext) {
            try {
                String filename = args.getString(0);
                MAS.setConfigurationFileName(filename);
                success(callbackContext, true);
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
                }

                MAS.setGrantFlow(grantFlow);
                PluginResult result = new PluginResult(PluginResult.Status.OK, true);
                callbackContext.sendPluginResult(result);
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
                        Map<String, List<String>> responseHeaders = masResponse.getHeaders();
                        if (responseHeaders != null) {
                            JSONObject headerJson = new JSONObject();
                            for (String h: responseHeaders.keySet()) {
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
                            list.add(new Pair<String, String>(name, value));
                        }
                        builder.put(MASRequestBody.urlEncodedFormBody(list));
                        break;
                }
            }
            return builder;
        }
    }

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
                            list.add(new Pair<String, String>(name, value));
                        }
                        builder.post(MASRequestBody.urlEncodedFormBody(list));
                        break;
                }
            }
            return builder;
        }
    }


}
