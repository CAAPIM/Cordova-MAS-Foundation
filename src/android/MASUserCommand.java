/*
 * Copyright (c) 2016 CA, Inc.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

package com.ca.mas.cordova.core;

import android.annotation.TargetApi;
import android.app.KeyguardManager;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.ca.mas.foundation.MAS;
import com.ca.mas.foundation.MASCallback;
import com.ca.mas.foundation.MASFoundationStrings;
import com.ca.mas.foundation.MASSessionUnlockCallback;
import com.ca.mas.foundation.MASUser;
import com.ca.mas.foundation.auth.MASProximityLoginQRCode;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import static android.app.Activity.RESULT_CANCELED;
import static android.app.Activity.RESULT_OK;
import static com.ca.mas.foundation.MASUser.getCurrentUser;

public class MASUserCommand {

    private static final String TAG = MASUserCommand.class.getCanonicalName();

    public static class LoginCommand extends Command {
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
                    String result = "Login with username and password complete";
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

            MASUser masUser = getCurrentUser();

            if (masUser != null) {
                JSONObject result = new JSONObject();
                try {
                    result.put("isAuthenticated", masUser.isAuthenticated());
                    result.put("userName", masUser.getUserName());
                    result.put("active", masUser.isActive());
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

            MASUser masUser = getCurrentUser();

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

            MASUser masUser = getCurrentUser();
            if (masUser != null) {
                masUser.logout(new MASCallback<Void>() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        String result = "Logoff user complete";
                        callbackContext.success(result);
                    }

                    @Override
                    public void onError(Throwable throwable) {
                        Log.e(TAG, throwable.getMessage(), throwable);
                        callbackContext.error(getError(throwable));
                    }
                });
            } else {
                Exception e = new Exception(MASFoundationStrings.USER_NOT_CURRENTLY_AUTHENTICATED);
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

            MASUser masUser = getCurrentUser();
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

    // Starting the fingerprint command zone...beware
    public static class IsSessionLockedCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            MASUser masUser = getCurrentUser();
            if (masUser != null) {
                if (masUser.isSessionLocked()) {
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
            return "isSessionLocked";
        }
    }

    public static class LockSessionCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            MASUser masUser = getCurrentUser();
            if (masUser != null) {
                masUser.lockSession(new MASCallback<Void>() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        String result = "Session lock complete";
                        callbackContext.success(result);
                    }

                    @Override
                    public void onError(Throwable throwable) {
                        Log.e(TAG, throwable.getMessage(), throwable);
                        callbackContext.error(getError(throwable));
                    }
                });
            } else {
                Exception e = new Exception(MASFoundationStrings.USER_NOT_CURRENTLY_AUTHENTICATED);
                callbackContext.error(getError(e));
            }
        }

        @Override
        public String getAction() {
            return "lockSession";
        }
    }


    public static class UnLockSessionCommand extends Command {

        @Override
        @TargetApi(23)
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            MASUser masUser = getCurrentUser();
            if (masUser != null) {
                masUser.unlockSession(new MASSessionUnlockCallback<Void>() {
                    @Override
                    public void onUserAuthenticationRequired() {
                        final int FINGERPRINT_REQUEST_CODE = 0x1000;
                        CordovaInterface cordova = (CordovaInterface) MASPlugin.getMasPlugin().cordova;
                        KeyguardManager keyguardManager = (KeyguardManager) cordova.getActivity().getSystemService(Context.KEYGUARD_SERVICE);
                        Intent intent = keyguardManager.createConfirmDeviceCredentialIntent(null, null);
                        if (intent != null) {
                            cordova.startActivityForResult(MASPlugin.getMasPlugin(), intent, FINGERPRINT_REQUEST_CODE);
                        }
                        cordova.setActivityResultCallback(new MASPlugin() {
                            @Override
                            public void onActivityResult(int requestCode, int resultCode, Intent intent) {
                                super.onActivityResult(requestCode, resultCode, intent);
                                if (requestCode == FINGERPRINT_REQUEST_CODE) {
                                    if (resultCode == RESULT_OK) {
                                        MASUser.getCurrentUser().unlockSession(new MASSessionUnlockCallback<Void>() {
                                            @Override
                                            public void onUserAuthenticationRequired() {
                                                //TODO : Sunder/Mujeeb add the code to handle this scenario
                                            }

                                            @Override
                                            public void onSuccess(Void aVoid) {
                                                String result = "Session unlock complete";
                                                callbackContext.success(result);
                                            }

                                            @Override
                                            public void onError(Throwable throwable) {
                                                Log.e(TAG, throwable.getMessage(), throwable);
                                                callbackContext.error(getError(throwable));
                                            }
                                        });
                                    } else if (resultCode == RESULT_CANCELED) {
                                        //TODO : Sunder/Mujeeb add the code to handle this scenario
                                    }
                                }
                            }
                        });


                    }

                    @Override
                    public void onSuccess(Void aVoid) {
                        String result = "Session unlock complete";
                        callbackContext.success(result);
                    }

                    @Override
                    public void onError(Throwable throwable) {
                        Log.e(TAG, throwable.getMessage(), throwable);
                        callbackContext.error(getError(throwable));
                    }
                });
            } else {
                Exception e = new Exception(MASFoundationStrings.USER_NOT_CURRENTLY_AUTHENTICATED);
                callbackContext.error(getError(e));
            }
        }

        @Override
        public String getAction() {
            return "unlockSession";
        }
    }

    public static class UnLockSessionWithMessageCommand extends Command {

        @Override
        @TargetApi(23)
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            final String message = args.optString(0);
            MASUser masUser = getCurrentUser();
            if (masUser != null) {
                masUser.unlockSession(new MASSessionUnlockCallback<Void>() {
                    @Override
                    public void onUserAuthenticationRequired() {
                        final int FINGERPRINT_REQUEST_CODE = 0x1000;
                        CordovaInterface cordova = (CordovaInterface) MASPlugin.getMasPlugin().cordova;
                        KeyguardManager keyguardManager = (KeyguardManager) cordova.getActivity().getSystemService(Context.KEYGUARD_SERVICE);
                        Intent intent = keyguardManager.createConfirmDeviceCredentialIntent(null, message);
                        if (intent != null) {
                            cordova.startActivityForResult(MASPlugin.getMasPlugin(), intent, FINGERPRINT_REQUEST_CODE);
                        }
                        cordova.setActivityResultCallback(new MASPlugin() {
                            @Override
                            public void onActivityResult(int requestCode, int resultCode, Intent intent) {
                                super.onActivityResult(requestCode, resultCode, intent);
                                if (requestCode == FINGERPRINT_REQUEST_CODE) {
                                    if (resultCode == RESULT_OK) {
                                        MASUser.getCurrentUser().unlockSession(new MASSessionUnlockCallback<Void>() {
                                            @Override
                                            public void onUserAuthenticationRequired() {
                                                //TODO : Sunder/Mujeeb add the code to handle this scenario
                                            }

                                            @Override
                                            public void onSuccess(Void aVoid) {
                                                String result = "Session unlock complete";
                                                callbackContext.success(result);
                                            }

                                            @Override
                                            public void onError(Throwable throwable) {
                                                Log.e(TAG, throwable.getMessage(), throwable);
                                                callbackContext.error(getError(throwable));
                                            }
                                        });
                                    } else if (resultCode == RESULT_CANCELED) {
                                        //TODO : Sunder/Mujeeb add the code to handle this scenario
                                    }
                                }
                            }
                        });


                    }

                    @Override
                    public void onSuccess(Void aVoid) {
                        String result = "Session unlock complete";
                        callbackContext.success(result);
                    }

                    @Override
                    public void onError(Throwable throwable) {
                        Log.e(TAG, throwable.getMessage(), throwable);
                        callbackContext.error(getError(throwable));
                    }
                });
            } else {
                Exception e = new Exception(MASFoundationStrings.USER_NOT_CURRENTLY_AUTHENTICATED);
                callbackContext.error(getError(e));
            }
        }

        @Override
        public String getAction() {
            return "unlockSessionWithMessage";
        }
    }

    public static class RemoveSessionLockCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {

            MASUser masUser = getCurrentUser();
            if (masUser != null) {
                masUser.removeSessionLock(new MASCallback<Void>() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        String result = "Session lock removed";
                        callbackContext.success(result);
                    }

                    @Override
                    public void onError(Throwable throwable) {
                        Log.e(TAG, throwable.getMessage(), throwable);
                        callbackContext.error(getError(throwable));
                    }
                });
            } else {
                Exception e = new Exception(MASFoundationStrings.USER_NOT_CURRENTLY_AUTHENTICATED);
                callbackContext.error(getError(e));
            }
        }

        @Override
        public String getAction() {
            return "removeSessionLock";
        }
    }

}
