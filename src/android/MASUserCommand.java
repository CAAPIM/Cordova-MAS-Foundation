/*
 * Copyright (c) 2016 CA, Inc.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

package com.ca.apim;

import org.json.JSONObject;

import android.content.Context;
import android.util.Log;

import com.ca.mas.core.MAGResultReceiver;
import com.ca.mas.core.MobileSsoFactory;
import com.ca.mas.core.error.MAGError;
import com.ca.mas.core.http.MAGResponse;
import com.ca.mas.foundation.MAS;
import com.ca.mas.foundation.MASCallback;
import com.ca.mas.foundation.MASUser;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

public class MASUserCommand {

    private static final String TAG = LoginCommand.class.getCanonicalName();

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
            return "loginWithUsernameAndPassword";
        }
    }

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
                JSONObject result = null;
                try {
                    result = masUser.getAsJSONObject();
                } catch (JSONException e) {
                    callbackContext.success(masUser.toString());
                }
                callbackContext.success(result);
            } else {
                String msg = "No current user exists";
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
               callbackContext.error("No current user exists");
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
                    success(callbackContext, true);
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
                        success(callbackContext, true);
                    }

                    @Override
                    public void onError(Throwable throwable) {
                        Log.e(TAG, throwable.getMessage(), throwable);
                        callbackContext.error(getError(throwable));
                    }
                });
            } else {
                success(callbackContext, true);
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
