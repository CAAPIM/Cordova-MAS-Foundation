/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
package com.ca.mas.cordova.core;

import android.annotation.TargetApi;
import android.app.KeyguardManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import com.ca.mas.foundation.MAS;
import com.ca.mas.foundation.MASAuthCredentialsAuthorizationCode;
import com.ca.mas.foundation.MASAuthCredentialsJWT;
import com.ca.mas.foundation.MASAuthCredentialsPassword;
import com.ca.mas.foundation.MASAuthorizationResponse;
import com.ca.mas.foundation.MASCallback;
import com.ca.mas.foundation.MASFoundationStrings;
import com.ca.mas.foundation.MASGroup;
import com.ca.mas.foundation.MASIdToken;
import com.ca.mas.foundation.MASSessionUnlockCallback;
import com.ca.mas.foundation.MASUser;
import com.ca.mas.identity.user.MASAddress;
import com.ca.mas.identity.user.MASEmail;
import com.ca.mas.identity.user.MASPhone;
import com.ca.mas.identity.user.MASPhoto;
import com.ca.mas.identity.util.IdentityConsts;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import static android.app.Activity.RESULT_CANCELED;
import static android.app.Activity.RESULT_OK;

public class MASPluginUser extends MASCordovaPlugin {
    private static final String TAG = MASPluginUser.class.getCanonicalName();

    @Override
    protected void pluginInitialize() {
        super.pluginInitialize();
    }

    @Override
    public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        try {
            if (action.equalsIgnoreCase("isAuthenticated")) {
                isAuthenticated(callbackContext);
            } else if (action.equalsIgnoreCase("initializeBrowserBasedAuthentication")) {
                initializeBrowserBasedAuthentication( callbackContext);
            } else if (action.equalsIgnoreCase("isCurrentUser")) {
                isCurrentUser(callbackContext);
            } else if (action.equalsIgnoreCase("getAccessToken")) {
                getAccessToken(callbackContext);
            } else if (action.equalsIgnoreCase("currentUser")) {
                getCurrentUser(callbackContext);
            } else if (action.equalsIgnoreCase("isSessionLocked")) {
                isSessionLocked(callbackContext);
            } else if (action.equalsIgnoreCase("lockSession")) {
                lockSession(callbackContext);
            } else if (action.equalsIgnoreCase("unlockSession")) {
                unlockSession(callbackContext);
            } else if (action.equalsIgnoreCase("unlockSessionWithMessage")) {
                unlockSessionWithMessage(callbackContext, args);
            } else if (action.equalsIgnoreCase("removeSessionLock")) {
                removeSessionLock(callbackContext);
            } else if (action.equalsIgnoreCase("loginWithUsernameAndPassword")) {
                loginWithUsernameAndPassword(args, callbackContext);
            } else if (action.equalsIgnoreCase("loginWithIdTokenAndTokenType")) {
                loginWithIdTokenAndTokenType(args, callbackContext);
            } else if (action.equalsIgnoreCase("loginWithAuthCode")) {
                loginWithAuthCode(args, callbackContext);
            } else if (action.equalsIgnoreCase("loginWithAuthCredentialsUsernamePassword")) {
                loginWithAuthCredentialsUsernamePassword(args, callbackContext);
            } else if (action.equalsIgnoreCase("loginWithAuthCredentialsJWT")) {
                loginWithAuthCredentialsJWT(args, callbackContext);
            } else if (action.equalsIgnoreCase("loginWithAuthCredentialsAuthCode")) {
                loginWithAuthCredentialsAuthCode(args, callbackContext);
            } else if (action.equalsIgnoreCase("logoutUser")) {
                logoutUser(callbackContext);
            } else if (action.equalsIgnoreCase("requestUserInfo")) {
                requestUserInfo(callbackContext);
            } else if (action.equalsIgnoreCase("listAttributes")) {
                listAttributes(callbackContext);
            } else {
                callbackContext.error("Invalid action");
                return false;
            }
        } catch (Throwable th) {
            callbackContext.error(getError(th));
        }
        return true;
    }

    /**
     * Checks the boolean status if the user is logged in or not
     */
    private void isAuthenticated(CallbackContext callbackContext) {
        MASUser masUser = MASUser.getCurrentUser();
        if (masUser == null) {
            MASCordovaException e = new MASCordovaException(MASFoundationStrings.USER_NOT_CURRENTLY_AUTHENTICATED);
            callbackContext.error(getError(e));
            return;
        }
        success(callbackContext, masUser.isAuthenticated(), false);
    }


    /**
     * Start Browser Based Authentication
     */
    private void initializeBrowserBasedAuthentication(final CallbackContext callbackContext) {
        try {
            MAS.enableBrowserBasedAuthentication();
            MASUser.login(new MASCallback<MASUser>() {
                @Override
                public void onSuccess(MASUser masUser) {
                    success(callbackContext, true, false);
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
    /**
     * Checks the boolean status if the user is current user
     */
    private void isCurrentUser(CallbackContext callbackContext) {
        MASUser masUser = MASUser.getCurrentUser();
        if (masUser == null) {
            MASCordovaException e = new MASCordovaException(MASFoundationStrings.USER_NOT_CURRENTLY_AUTHENTICATED);
            callbackContext.error(getError(e));
            return;
        }
        success(callbackContext, masUser.isCurrentUser(), false);
    }

    /**
     * Retreives the logged in user's access token
     */
    private void getAccessToken(CallbackContext callbackContext) {
        MASUser masUser = MASUser.getCurrentUser();
        if (masUser == null) {
            MASCordovaException e = new MASCordovaException(MASFoundationStrings.USER_NOT_CURRENTLY_AUTHENTICATED);
            callbackContext.error(getError(e));
            return;
        }
        success(callbackContext, masUser.getAccessToken(), false);
    }

    /**
     * Fetches the current logged in MASUser and returns as json object
     */
    private void getCurrentUser(CallbackContext callbackContext) {
        MASUser masUser = MASUser.getCurrentUser();
        if (masUser == null) {
            MASCordovaException e = new MASCordovaException(MASFoundationStrings.USER_NOT_CURRENTLY_AUTHENTICATED);
            callbackContext.error(getError(e));
            return;
        }

        try {
            success(callbackContext, convertUserToJSModel(masUser), false);
        } catch (JSONException jse) {
            callbackContext.error(jse.getLocalizedMessage());
        }
    }

    /**
     * checks if the current User's session is locked?
     */
    private void isSessionLocked(CallbackContext callbackContext) {
        MASUser masUser = MASUser.getCurrentUser();
        if (masUser == null) {
            MASCordovaException e = new MASCordovaException(MASFoundationStrings.USER_NOT_CURRENTLY_AUTHENTICATED);
            callbackContext.error(getError(e));
            return;
        }
        success(callbackContext, masUser.isSessionLocked(), false);
    }

    /**
     * locks the current User's session
     */
    @TargetApi(Build.VERSION_CODES.M)
    private void lockSession(final CallbackContext callbackContext) {
        MASUser masUser = MASUser.getCurrentUser();
        if (masUser == null) {
            MASCordovaException e = new MASCordovaException(MASFoundationStrings.USER_NOT_CURRENTLY_AUTHENTICATED);
            callbackContext.error(getError(e));
            return;
        }
        masUser.lockSession(new MASCallback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                String result = "Session lock complete";
                success(callbackContext, result, false);
            }

            @Override
            public void onError(Throwable throwable) {
                Log.e(TAG, throwable.getMessage(), throwable);
                callbackContext.error(getError(throwable));
            }
        });
    }

    /**
     * unlocks the current User's session
     */
    @TargetApi(Build.VERSION_CODES.M)
    private void unlockSession(final CallbackContext callbackContext) {
        MASUser masUser = MASUser.getCurrentUser();
        if (masUser == null) {
            MASCordovaException e = new MASCordovaException(MASFoundationStrings.USER_NOT_CURRENTLY_AUTHENTICATED);
            callbackContext.error(getError(e));
            return;
        }
        masUser.unlockSession(new MASSessionUnlockCallback<Void>() {
            @Override
            public void onUserAuthenticationRequired() {
                final int FINGERPRINT_REQUEST_CODE = 0x1000;
                CordovaInterface cordova = (CordovaInterface) MASPluginUser.this.cordova;
                KeyguardManager keyguardManager = (KeyguardManager) cordova.getActivity().getSystemService(Context.KEYGUARD_SERVICE);
                Intent intent = keyguardManager.createConfirmDeviceCredentialIntent(null, null);
                if (intent != null) {
                    cordova.startActivityForResult(MASPluginUser.this, intent, FINGERPRINT_REQUEST_CODE);
                }
                cordova.setActivityResultCallback(new MASPluginUser() {
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
                                        success(callbackContext, result, false);
                                    }

                                    @Override
                                    public void onError(Throwable throwable) {
                                        Log.e(TAG, throwable.getMessage(), throwable);
                                        callbackContext.error(getError(throwable));
                                    }
                                });
                            } else if (resultCode == RESULT_CANCELED) {
                                String errMsg = "Security error has occurred.";
                                MASCordovaException exp = new MASCordovaException(errMsg);
                                Log.i(TAG, errMsg);
                                callbackContext.error(getError(exp));
                            }
                        }
                    }
                });
            }

            @Override
            public void onSuccess(Void aVoid) {
                String result = "Session unlock complete";
                success(callbackContext, result, false);
            }

            @Override
            public void onError(Throwable throwable) {
                Log.e(TAG, throwable.getMessage(), throwable);
                callbackContext.error(getError(throwable));
            }
        });
    }

    /**
     * unlocks the current User's session with a promt message provided by user
     */
    @TargetApi(Build.VERSION_CODES.M)
    private void unlockSessionWithMessage(final CallbackContext callbackContext, JSONArray args) {
        MASUser masUser = MASUser.getCurrentUser();
        if (masUser == null) {
            MASCordovaException e = new MASCordovaException(MASFoundationStrings.USER_NOT_CURRENTLY_AUTHENTICATED);
            callbackContext.error(getError(e));
            return;
        }
        final String message = args.optString(0);
        masUser.unlockSession(new MASSessionUnlockCallback<Void>() {
            @Override
            public void onUserAuthenticationRequired() {
                final int FINGERPRINT_REQUEST_CODE = 0x1000;
                CordovaInterface cordova = (CordovaInterface) MASPluginUser.this.cordova;
                KeyguardManager keyguardManager = (KeyguardManager) cordova.getActivity().getSystemService(Context.KEYGUARD_SERVICE);
                Intent intent = keyguardManager.createConfirmDeviceCredentialIntent(null, message);
                if (intent != null) {
                    cordova.startActivityForResult(MASPluginUser.this, intent, FINGERPRINT_REQUEST_CODE);
                }
                cordova.setActivityResultCallback(new MASPluginUser() {
                    @Override
                    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
                        super.onActivityResult(requestCode, resultCode, intent);
                        if (requestCode == FINGERPRINT_REQUEST_CODE) {
                            if (resultCode == RESULT_OK) {
                                MASUser.getCurrentUser().unlockSession(new MASSessionUnlockCallback<Void>() {
                                    @Override
                                    public void onUserAuthenticationRequired() {
                                        //TODO : Add the code to handle this scenario
                                    }

                                    @Override
                                    public void onSuccess(Void aVoid) {
                                        String result = "Session unlock complete";
                                        success(callbackContext, result, false);
                                    }

                                    @Override
                                    public void onError(Throwable throwable) {
                                        Log.e(TAG, throwable.getMessage(), throwable);
                                        callbackContext.error(getError(throwable));
                                    }
                                });
                            } else if (resultCode == RESULT_CANCELED) {
                                String errMsg = "Security error has occurred.";
                                MASCordovaException exp = new MASCordovaException(errMsg);
                                Log.i(TAG, errMsg);
                                callbackContext.error(getError(exp));
                            }
                        }
                    }
                });


            }

            @Override
            public void onSuccess(Void aVoid) {
                String result = "Session unlock complete";
                success(callbackContext, result, false);
            }

            @Override
            public void onError(Throwable throwable) {
                Log.e(TAG, throwable.getMessage(), throwable);
                callbackContext.error(getError(throwable));
            }
        });
    }

    /**
     * removes any existing session lock for the logged in current user
     */
    @TargetApi(Build.VERSION_CODES.M)
    private void removeSessionLock(final CallbackContext callbackContext) {
        MASUser masUser = MASUser.getCurrentUser();
        if (masUser == null) {
            MASCordovaException e = new MASCordovaException(MASFoundationStrings.USER_NOT_CURRENTLY_AUTHENTICATED);
            callbackContext.error(getError(e));
            return;
        }
        masUser.removeSessionLock(new MASCallback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                String result = "Session lock removed";
                success(callbackContext, result, false);
            }

            @Override
            public void onError(Throwable throwable) {
                Log.e(TAG, throwable.getMessage(), throwable);
                callbackContext.error(getError(throwable));
            }
        });
    }

    /**
     * is used to login with provided username and password.
     */
    private void loginWithUsernameAndPassword(final JSONArray args, final CallbackContext callbackContext) {
        String username;
        String password;
        try {
            username = args.getString(0);
            password = args.getString(1);
        } catch (JSONException e) {
            callbackContext.error(getError(e));
            return;
        }

        MASUser.login(username, password.toCharArray(), new MASCallback<MASUser>() {
            @Override
            public void onSuccess(MASUser masUser) {
                String result = "Login with username and password complete";
                success(callbackContext, result, false);
            }

            @Override
            public void onError(Throwable throwable) {
                Log.e(TAG, throwable.getMessage(), throwable);
                callbackContext.error(getError(throwable));
            }
        });
    }

    /**
     * is used to login with an IDToken and IDTokenType
     */
    private void loginWithIdTokenAndTokenType(final JSONArray args, final CallbackContext callbackContext) {
        String idToken;
        String idTokenType;
        try {
            idToken = args.getString(0);
            idTokenType = args.getString(1);
        } catch (JSONException e) {
            callbackContext.error(getError(e));
            return;
        }
        MASIdToken masIdToken = new MASIdToken.Builder().value(idToken).type(idTokenType).build();

        MASUser.login(masIdToken, new MASCallback<MASUser>() {
            @Override
            public void onSuccess(MASUser masUser) {
                String result = "Login with idToken complete";
                success(callbackContext, result, false);
            }

            @Override
            public void onError(Throwable throwable) {
                Log.e(TAG, throwable.getMessage(), throwable);
                callbackContext.error(getError(throwable));
            }
        });
    }

    /**
     * Authenticates a user with an authorization code.
     */
    private void loginWithAuthCode(final JSONArray args, final CallbackContext callbackContext) {
        String authorizationCode;
        String state;
        try {
            authorizationCode = args.getString(0);
            state = args.getString(1);
        } catch (JSONException e) {
            callbackContext.error(getError(e));
            return;
        }
        MASAuthorizationResponse masAuthorizationResponse = new MASAuthorizationResponse(authorizationCode, state);

        MASUser.login(masAuthorizationResponse, new MASCallback<MASUser>() {
            @Override
            public void onSuccess(MASUser masUser) {
                String result = "Login with authorization code complete";
                success(callbackContext, result, false);
            }

            @Override
            public void onError(Throwable throwable) {
                Log.e(TAG, throwable.getMessage(), throwable);
                callbackContext.error(getError(throwable));
            }
        });
    }

    /**
     * is used to login with provided username and password.
     */
    private void loginWithAuthCredentialsUsernamePassword(final JSONArray args, final CallbackContext callbackContext) {
        String username;
        String password;
        try {
            username = args.getString(0);
            password = args.getString(1);
        } catch (JSONException e) {
            callbackContext.error(getError(e));
            return;
        }

        MASAuthCredentialsPassword masAuthCredentialsPassword = new MASAuthCredentialsPassword(username, password.toCharArray());
        MASUser.login(masAuthCredentialsPassword, new MASCallback<MASUser>() {
            @Override
            public void onSuccess(MASUser masUser) {
                String result = "Login with authcredentials username and password complete";
                success(callbackContext, result, false);
            }

            @Override
            public void onError(Throwable throwable) {
                Log.e(TAG, throwable.getMessage(), throwable);
                callbackContext.error(getError(throwable));
            }
        });
    }

    /**
     * is used to login with provided JWT and type.
     */
    private void loginWithAuthCredentialsJWT(final JSONArray args, final CallbackContext callbackContext) {
        String jwt;
        String type;
        try {
            jwt = args.getString(0);
            type = args.getString(1);
        } catch (JSONException e) {
            callbackContext.error(getError(e));
            return;
        }
        MASIdToken token = new MASIdToken.Builder().value(jwt).type(type).build();
        MASAuthCredentialsJWT credentialsJWT = new MASAuthCredentialsJWT(token);
        MASUser.login(credentialsJWT, new MASCallback<MASUser>() {
            @Override
            public void onSuccess(MASUser masUser) {
                String result = "Login with JWT complete";
                success(callbackContext, result, false);
            }

            @Override
            public void onError(Throwable throwable) {
                Log.e(TAG, throwable.getMessage(), throwable);
                callbackContext.error(getError(throwable));
            }
        });
    }


    private void loginWithAuthCredentialsAuthCode(final JSONArray args, final CallbackContext callbackContext) {
        String authCode = null;
        String state = null;
        try {
            authCode = args.getString(0);
            state = args.getString(1);
        } catch (JSONException e) {
            callbackContext.error(getError(e));
            return;
        }

        MASAuthCredentialsAuthorizationCode credentials = new MASAuthCredentialsAuthorizationCode(authCode, state);
        MASUser.login(credentials, new MASCallback<MASUser>() {
            @Override
            public void onSuccess(MASUser masUser) {
                String result = "Login with Authorization Code using MASAuthCredentials complete";
                success(callbackContext, result, false);
            }

            @Override
            public void onError(Throwable throwable) {
                Log.e(TAG, throwable.getMessage(), throwable);
                callbackContext.error(getError(throwable));
            }
        });
    }

    /**
     * logs out the current logged in user
     */
    private void logoutUser(final CallbackContext callbackContext) {
        MASUser masUser = MASUser.getCurrentUser();
        if (masUser == null) {
            callbackContext.success("User Already Logged off");
            return;
        }
        masUser.logout(new MASCallback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                String result = "Logoff user complete";
                success(callbackContext, result, false);
            }

            @Override
            public void onError(Throwable throwable) {
                Log.e(TAG, throwable.getMessage(), throwable);
                callbackContext.error(getError(throwable));
            }
        });
    }

    /**
     * Fetches the present logged in user's profile from server and stores in the local data store
     */
    private void requestUserInfo(final CallbackContext callbackContext) {
        MASUser masUser = MASUser.getCurrentUser();
        if (masUser == null) {
            MASCordovaException e = new MASCordovaException(MASFoundationStrings.USER_NOT_CURRENTLY_AUTHENTICATED);
            callbackContext.error(getError(e));
            return;
        }
        masUser.requestUserInfo(new MASCallback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                success(callbackContext, true, false);
            }

            @Override
            public void onError(Throwable throwable) {
                Log.e(TAG, throwable.getMessage(), throwable);
                callbackContext.error(getError(throwable));
            }
        });
    }

    /**
     * Fetches all the attributes of a logged-in user in the form of a JSON
     */
    private void listAttributes(final CallbackContext callbackContext) {
        MASUser masUser = MASUser.getCurrentUser();
        if (masUser == null) {
            MASCordovaException e = new MASCordovaException(MASFoundationStrings.USER_NOT_CURRENTLY_AUTHENTICATED);
            callbackContext.error(getError(e));
            return;
        }
        try {
            success(callbackContext, masUser.getAsJSONObject(), false);
        } catch (JSONException ex) {
            Log.e(TAG, ex.getMessage(), ex);
            callbackContext.error(getError(ex));
        }
    }

    private JSONObject convertUserToJSModel(MASUser masUser) throws JSONException {
        JSONObject map = new JSONObject();
        map.put(IdentityConsts.KEY_USERNAME, masUser.getUserName());
        map.put(IdentityConsts.KEY_DISPLAY_NAME, masUser.getDisplayName());
        map.put(IdentityConsts.KEY_GIVEN_NAME, masUser.getName().getGivenName());
        map.put(IdentityConsts.KEY_FAMILY_NAME, masUser.getName().getFamilyName());
        map.put("formattedName", masUser.getName().getGivenName() + " " + masUser.getName().getFamilyName());
        if (masUser.getMeta() != null && masUser.getMeta().getLocation() != null) {
            map.put(IdentityConsts.KEY_REFERENCE, masUser.getMeta().getLocation());
        }

        map.put("active", masUser.isActive());

        // Loading the email addresses
        JSONArray emailArray = new JSONArray();
        if (masUser.getEmailList() != null && !masUser.getEmailList().isEmpty()) {
            for (MASEmail email : masUser.getEmailList()) {
                if (email == null) {
                    continue;
                }
                JSONObject obj = new JSONObject();
                String emailType = (email.getType() == null || email.getType().isEmpty()) ? "work" : email.getType();
                obj.put(emailType, email.getValue());
                emailArray.put(obj);
            }
        }
        map.put("emailAddresses", emailArray);

        // Loading the personal addresses
        JSONObject addressMap = new JSONObject();
        if (masUser.getAddressList() != null && !masUser.getAddressList().isEmpty()) {
            for (MASAddress address : masUser.getAddressList()) {
                if (address == null) {
                    continue;
                }
                try {
                    String addressType = (address.getType() == null || address.getType().isEmpty()) ? "work" : address.getType();
                    addressMap.put(addressType, address.getAsJSONObject());
                } catch (JSONException jce) {
                }
            }
        }
        map.put(IdentityConsts.KEY_ADDRS, addressMap);

        // Loading the phone numbers
        JSONArray phoneArray = new JSONArray();
        if (masUser.getPhoneList() != null && !masUser.getPhoneList().isEmpty()) {
            for (MASPhone phone : masUser.getPhoneList()) {
                if (phone == null) {
                    continue;
                }
                JSONObject obj = new JSONObject();
                String phoneType = (phone.getType() == null || phone.getType().isEmpty()) ? "work" : phone.getType();
                obj.put(phoneType, phone.getValue());
                phoneArray.put(obj);
            }
        }
        map.put(IdentityConsts.KEY_PHONE_NUMBERS, phoneArray);

        // Loading the photos
        JSONObject photoMap = new JSONObject();
        if (masUser.getPhotoList() != null && !masUser.getPhotoList().isEmpty()) {
            for (MASPhoto photo : masUser.getPhotoList()) {
                if (photo == null) {
                    continue;
                }
                String photoType = (photo.getType() == null || photo.getType().isEmpty()) ? "thumbnail" : photo.getType();
                photoMap.put(photoType, photo.getValue());
            }
        }
        map.put(IdentityConsts.KEY_PHOTOS, photoMap);

        JSONArray groupArray = new JSONArray();
        if (masUser.getGroupList() != null && !masUser.getGroupList().isEmpty()) {
            for (MASGroup group : masUser.getGroupList()) {
                JSONObject obj = new JSONObject();
                obj.put(IdentityConsts.KEY_VALUE, group.getValue());
                obj.put(IdentityConsts.KEY_DISPLAY, group.getGroupName());// TODO:Never getting populated in SDK end
                obj.put(IdentityConsts.KEY_REFERENCE, group.getReference());
                groupArray.put(obj);
            }
        }
        map.put(IdentityConsts.KEY_GROUPS, groupArray);
        return map;
    }
}