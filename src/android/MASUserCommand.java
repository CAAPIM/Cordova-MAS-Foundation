/*
 * Copyright (c) 2016 CA, Inc.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

package com.ca.mas.cordova.core;

import org.json.JSONObject;

import android.content.Context;
import android.util.Log;
import android.widget.Toast;
import com.ca.mas.core.MAGResultReceiver;
import com.ca.mas.core.MobileSsoFactory;
import com.ca.mas.core.error.MAGError;
import com.ca.mas.core.http.MAGResponse;
import com.ca.mas.foundation.MAS;
import com.ca.mas.foundation.MASCallback;
import com.ca.mas.foundation.MASUser;
import com.ca.mas.foundation.auth.MASProximityLoginQRCode;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

public class MASUserCommand {

    private static final String TAG = LoginCommand.class.getCanonicalName();
    @Deprecated
    public static CallbackContext COMPLETE_AUTH_CALLBACK;
    public static class LoginCommand extends Command {
        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            String username = null;
            String password = null;
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
                    String result="Login with username and password complete";
                    callbackContext.success(result);
                }

                @Override
                public void onError(Throwable throwable) {
                    Log.e(TAG, throwable.getMessage(), throwable);
                    callbackContext.error(getError(throwable));
                }
            });
        }

        @Override
        public String getAction() {
            return "loginWithUsernameAndPassword";
        }
    }

    public static class AuthorizeCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            String url = null;
            String password = null;
            try {
                url = (String) args.get(0);
            } catch (JSONException e) {
                callbackContext.error(getError(e));
                return;
            }

            MASProximityLoginQRCode.authorize(url, new MASCallback<Void>() {
                @Override
                public void onSuccess(Void result) {
                    String msg="QR Code authorized successfully!";
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

    //Not supported by iOS
    public static class LoginWithImplicitFlowCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {

            MASUser.login(new MASCallback<MASUser>() {
                @Override
                public void onSuccess(MASUser masUser) {
                    success(callbackContext, true);
                }

                @Override
                public void onError(Throwable throwable) {
                    Log.e(TAG, throwable.getMessage(), throwable);
                    callbackContext.error(getError(throwable));
                }
            });
        }

        @Override
        public String getAction() {
            return "loginWithImplicitFlow";
        }
    }

    public static class GetCurrentUserCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {

            MASUser masUser = MASUser.getCurrentUser();

            if (masUser != null) {
                JSONObject result = new JSONObject();
                try {
                    result.put("isAuthenticated",masUser.isAuthenticated());
                    result.put("userName",masUser.getUserName());
                    result.put("active",masUser.isActive());
                } catch (JSONException e) {
                    callbackContext.success(masUser.toString());
                }


                callbackContext.success(result);
            } else {
                String msg = "User not logged in";
                JSONObject error = new JSONObject();
                try {
                    error.put("errorMessage", msg);
                } catch (JSONException e) {
                    callbackContext.error("");
                }
                callbackContext.error(error);
            }
        }

        @Override
        public String getAction() {
            return "getCurrentUser";
        }
    }

    public static class GetUserNameCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {

            MASUser masUser = MASUser.getCurrentUser();

            if (masUser != null) {
               callbackContext.success(masUser.getUserName());
            } else {
                String msg = "User not logged in";
                JSONObject error = new JSONObject();
                try {
                    error.put("errorMessage", msg);
                } catch (JSONException e) {
                    callbackContext.error("");
                }
                callbackContext.error(error);
            }
        }

        @Override
        public String getAction() {
            return "getUserName";
        }
    }

    public static class CompleteAuthenticationCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            //COMPLETE_AUTH_CALLBACK = callbackContext;
            String username = null;
            String password = null;
            try {
                username = (String) args.get(0);
                password = (String) args.get(1);
            } catch (JSONException e) {
                callbackContext.error(getError(e));
                return;
            }

            MobileSsoFactory.getInstance().authenticate(username, password.toCharArray(), new MAGResultReceiver<JSONObject>() {

                @Override
                public void onSuccess(MAGResponse<JSONObject> response) {
                    PluginResult pluginResult = new PluginResult(PluginResult.Status.OK);
                    pluginResult.setKeepCallback(true);
                    callbackContext.sendPluginResult(pluginResult);

                    //success(callbackContext, true);
                }

                @Override
                public void onError(MAGError error) {
                    Log.e(TAG, error.getMessage(), error);
                    callbackContext.error(getError(error));
                }

                @Override
                public void onRequestCancelled() {

                }
            });
        }

        @Override
        public String getAction() {
            return "completeAuthentication";
        }
    }


    public static class CancelAuthenticationCommand extends Command {
        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            try {
                int requestId = args.getInt(0);
                if (requestId == 0) {
                    Log.e(TAG, "request Id is empty");
                    callbackContext.error("request Id is  empty");
                }
                MASUtil.getQrCode().stop();
                MAS.cancelRequest(requestId);
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

    public static class LogoutUserCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {

            MASUser masUser = MASUser.getCurrentUser();
            if (masUser != null) {
                masUser.logout(new MASCallback<Void>() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        String result="Logoff user complete";
                        callbackContext.success(result);
                    }

                    @Override
                    public void onError(Throwable throwable) {
                        Log.e(TAG, throwable.getMessage(), throwable);
                        callbackContext.error(getError(throwable));
                    }
                });
            } else {
                String result="User has not been authenticated";
                Exception e= new Exception(result);
                callbackContext.error(getError(e));
            }
        }

        @Override
        public String getAction() {
            return "logoutUser";
        }
    }

    public static class IsAuthenticatedCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {

            MASUser masUser = MASUser.getCurrentUser();
            if (masUser != null) {
                if (masUser.isAuthenticated()) {
                    PluginResult result = new PluginResult(PluginResult.Status.OK, true);
                    callbackContext.sendPluginResult(result);
                } else {
                    PluginResult result = new PluginResult(PluginResult.Status.OK, false);
                    callbackContext.sendPluginResult(result);
                }
            } else {
                PluginResult result = new PluginResult(PluginResult.Status.OK, false);
                callbackContext.sendPluginResult(result);
            }
        }

        @Override
        public String getAction() {
            return "isAuthenticated";
        }
    }


}
