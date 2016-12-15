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
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

import static android.app.Activity.RESULT_CANCELED;
import static android.app.Activity.RESULT_OK;

/**
 * Created by trima09 on 12/13/2016.
 */

public class MASPluginUser extends CordovaPlugin {
    private static final String TAG = MASPluginUser.class.getCanonicalName();

    private Command command = null;

    @Override
    protected void pluginInitialize() {
        super.pluginInitialize();
        command = new Command() {
            @Override
            public void execute(Context context, JSONArray args, CallbackContext callbackContext) {
                return;
            }

            @Override
            public String getAction() {
                return null;
            }
        };
    }

    @Override
    public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        MASUser user = MASUser.getCurrentUser();
        if (user == null) {
            Exception e = new Exception(MASFoundationStrings.USER_NOT_CURRENTLY_AUTHENTICATED);
            callbackContext.error(command.getError(e));
            return false;
        }
        Log.i(TAG, action);
        if (action.equalsIgnoreCase("isAuthenticated")) {
            return isAuthenticated(user, callbackContext);
        } else if (action.equalsIgnoreCase("getCurrentUser")) {
            return getCurrentUser(user, callbackContext);
        } else if (action.equalsIgnoreCase("isSessionLocked")) {
            return isSessionLocked(user, callbackContext);
        } else if (action.equalsIgnoreCase("lockSession")) {
            return lockSession(user, callbackContext);
        } else if (action.equalsIgnoreCase("unlockSession")) {
            return unlockSession(user, callbackContext);
        } else if (action.equalsIgnoreCase("unlockSessionWithMessage")) {
            return unlockSessionWithMessage(user, callbackContext, args);
        } else if (action.equalsIgnoreCase("removeSessionLock")) {
            return removeSessionLock(user, callbackContext);
        } else if (action.equalsIgnoreCase("loginWithUsernameAndPassword")) {
            return loginWithUsernameAndPassword(args, callbackContext);
        } else if (action.equalsIgnoreCase("loginWithImplicitFlow")) {
            return loginWithImplicitFlow(callbackContext);
        } else if (action.equalsIgnoreCase("logoutUser")) {
            return logoutUser(user, callbackContext);
        } else if (action.equalsIgnoreCase("completeAuthentication")) {
            return completeAuthentication(args, callbackContext);
        } else if (action.equalsIgnoreCase("cancelAuthentication")) {
            return cancelAuthentication(args, callbackContext);
        } else if (action.equalsIgnoreCase("authorizeQRCode")) {
            return authorizeQRCode(args, callbackContext);
        } else {
            callbackContext.error("Invalid action");
            return false;
        }

    }

    private boolean isAuthenticated(MASUser masUser, final CallbackContext callbackContext) {
        if (masUser.isAuthenticated()) {
            PluginResult result = new PluginResult(PluginResult.Status.OK, true);
            callbackContext.sendPluginResult(result);
        } else {
            PluginResult result = new PluginResult(PluginResult.Status.OK, false);
            callbackContext.sendPluginResult(result);
        }
        return true;
    }

    private boolean getCurrentUser(MASUser masUser, final CallbackContext callbackContext) {
        try {
            callbackContext.success(masUser.getAsJSONObject());
        } catch (JSONException jse) {
            callbackContext.error(jse.getLocalizedMessage());
        }
        return true;
    }

    private boolean isSessionLocked(MASUser masUser, final CallbackContext callbackContext) {
        if (masUser.isSessionLocked()) {
            PluginResult result = new PluginResult(PluginResult.Status.OK, true);
            callbackContext.sendPluginResult(result);
        } else {
            PluginResult result = new PluginResult(PluginResult.Status.OK, false);
            callbackContext.sendPluginResult(result);
        }
        return true;
    }

    private boolean lockSession(MASUser masUser, final CallbackContext callbackContext) {
        masUser.lockSession(new MASCallback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                String result = "Session lock complete";
                callbackContext.success(result);
            }

            @Override
            public void onError(Throwable throwable) {
                Log.e(TAG, throwable.getMessage(), throwable);
                callbackContext.error(command.getError(throwable));
            }
        });
        return true;
    }

    @TargetApi(23)
    private boolean unlockSession(MASUser masUser, final CallbackContext callbackContext) {
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
                                    }

                                    @Override
                                    public void onSuccess(Void aVoid) {
                                        String result = "Session unlock complete";
                                        callbackContext.success(result);
                                    }

                                    @Override
                                    public void onError(Throwable throwable) {
                                        Log.e(TAG, throwable.getMessage(), throwable);
                                        callbackContext.error(command.getError(throwable));
                                    }
                                });
                            } else if (resultCode == RESULT_CANCELED) {
                                String errMsg = "Security error has occurred.";
                                MASCordovaException exp = new MASCordovaException(errMsg);
                                Log.i(TAG, errMsg);
                                callbackContext.error(command.getError(exp));
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
                callbackContext.error(command.getError(throwable));
            }
        });
        return true;
    }

    @TargetApi(23)
    private boolean unlockSessionWithMessage(MASUser masUser, final CallbackContext callbackContext, JSONArray args) {
        final String message = args.optString(0);
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
                                        callbackContext.error(command.getError(throwable));
                                    }
                                });
                            } else if (resultCode == RESULT_CANCELED) {
                                String errMsg = "Security error has occurred.";
                                MASCordovaException exp = new MASCordovaException(errMsg);
                                Log.i(TAG, errMsg);
                                callbackContext.error(command.getError(exp));
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
                callbackContext.error(command.getError(throwable));
            }
        });
        return true;
    }

    private boolean removeSessionLock(MASUser masUser, final CallbackContext callbackContext) {
        masUser.removeSessionLock(new MASCallback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                String result = "Session lock removed";
                callbackContext.success(result);
            }

            @Override
            public void onError(Throwable throwable) {
                Log.e(TAG, throwable.getMessage(), throwable);
                callbackContext.error(command.getError(throwable));
            }
        });
        return true;
    }

    private boolean loginWithUsernameAndPassword(final JSONArray args, final CallbackContext callbackContext) {
        String username;
        String password;
        try {
            username = args.getString(0);
            password = args.getString(1);
        } catch (JSONException e) {
            callbackContext.error(command.getError(e));
            return false;
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
                callbackContext.error(command.getError(throwable));
            }
        });
        return true;
    }

    private boolean completeAuthentication(final JSONArray args, final CallbackContext callbackContext) {
        String username;
        String password;
        try {
            username = args.getString(0);
            password = args.getString(1);
        } catch (JSONException e) {
            callbackContext.error(command.getError(e));
            return false;
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
                callbackContext.error(command.getError(error));

            }
        });
        return true;
    }

    private boolean cancelAuthentication(final JSONArray args, final CallbackContext callbackContext) {
        try {
            int requestId = args.getInt(0);
            if (requestId == 0) {
                Log.e(TAG, "request Id is empty");
                callbackContext.error("request Id is  empty");
            }
            MASUtil.getQrCode().stop();
            MAS.cancelRequest(requestId);
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, true));
        } catch (Exception e) {
            Log.e(TAG, e.getMessage(), e);
            callbackContext.error(command.getError(e));
            return false;
        }
        return true;
    }

    private boolean authorizeQRCode(final JSONArray args, final CallbackContext callbackContext) {
        String url;
        try {
            url = args.getString(0);
        } catch (JSONException e) {
            callbackContext.error(command.getError(e));
            return false;
        }

        MASProximityLoginQRCode.authorize(url, new MASCallback<Void>() {
            @Override
            public void onSuccess(Void result) {
                String msg = "QR Code authorized successfully!";
                callbackContext.success(msg);
            }


            @Override
            public void onError(Throwable e) {
                Log.e(TAG, e.getMessage(), e);
                callbackContext.error(command.getError(e));
            }
        });
        return true;
    }

    private boolean loginWithImplicitFlow(final CallbackContext callbackContext) {
        MASUser.login(new MASCallback<MASUser>() {
            @Override
            public void onSuccess(MASUser masUser) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, true);
                callbackContext.sendPluginResult(result);
            }

            @Override
            public void onError(Throwable throwable) {
                Log.e(TAG, throwable.getMessage(), throwable);
                callbackContext.error(command.getError(throwable));
            }
        });
        return true;
    }

    private boolean logoutUser(MASUser masUser, final CallbackContext callbackContext) {
        masUser.logout(new MASCallback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                String result = "Logoff user complete";
                callbackContext.success(result);
            }

            @Override
            public void onError(Throwable throwable) {
                Log.e(TAG, throwable.getMessage(), throwable);
                callbackContext.error(command.getError(throwable));
            }
        });
        return true;
    }
}
