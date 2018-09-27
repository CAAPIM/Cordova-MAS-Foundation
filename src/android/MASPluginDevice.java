/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
package com.ca.mas.cordova.core;

import android.util.Log;

import com.ca.mas.foundation.MASCallback;
import com.ca.mas.foundation.MASDevice;
import com.ca.mas.foundation.MASDeviceAttributeOverflowException;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by trima09 on 29/01/2017.
 */

public class MASPluginDevice extends MASCordovaPlugin {
    private static final String TAG = MASPluginDevice.class.getCanonicalName();

    @Override
    protected void pluginInitialize() {
        super.pluginInitialize();
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        try {
            if (action.equalsIgnoreCase("deregister")) {
                deregister(args, callbackContext);
            } else if (action.equalsIgnoreCase("isDeviceRegistered")) {
                isDeviceRegistered(args, callbackContext);
            } else if (action.equalsIgnoreCase("resetLocally")) {
                resetLocally(args, callbackContext);
            } else if (action.equalsIgnoreCase("getDeviceIdentifier")) {
                getDeviceIdentifier(args, callbackContext);
            } else if (action.equalsIgnoreCase("getCurrentDevice")) {
                getCurrentDevice(args, callbackContext);
            } else if (action.equalsIgnoreCase("addAttribute")) {
                addAttribute(args, callbackContext);
            } else if (action.equalsIgnoreCase("removeAttribute")) {
                removeAttribute(args, callbackContext);
            } else if (action.equalsIgnoreCase("removeAllAttributes")) {
                removeAllAttributes(args, callbackContext);
            } else if (action.equalsIgnoreCase("getAttribute")) {
                getAttribute(args, callbackContext);
            } else if (action.equalsIgnoreCase("getAttributes")) {
                getAttributes(args, callbackContext);
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
     * Deregisters a device from MAG server i.e. remove all registration info of this device on server
     */
    private void deregister(final JSONArray args, final CallbackContext callbackContext) {
        MASDevice masDevice = MASDevice.getCurrentDevice();
        masDevice.deregister(new MASCallback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                String result = "Deregister complete";
                success(callbackContext, result, false);
            }

            @Override
            public void onError(Throwable e) {
                Log.e(TAG, e.getMessage(), e);
                callbackContext.error(getError(e));
            }
        });
    }

    /**
     * This API returns a boolean state of device's current registration status on MAG server.
     */
    private void isDeviceRegistered(final JSONArray args, final CallbackContext callbackContext) {
        try {
            MASDevice masDevice = MASDevice.getCurrentDevice();
            success(callbackContext, masDevice.isRegistered(), false);
        } catch (Exception e) {
            Log.e(TAG, e.getMessage(), e);
            callbackContext.error(getError(e));
        }
    }

    /**
     * Resets all the local cache of the device for this app i.e. all  tokens, credentials, states are flushed.
     */
    private void resetLocally(final JSONArray args, final CallbackContext callbackContext) {
        MASDevice masDevice = MASDevice.getCurrentDevice();
        try {
            masDevice.resetLocally();
            success(callbackContext, true, false);
        } catch (Exception e) {
            Log.e(TAG, e.getMessage(), e);
            callbackContext.error(getError(e));
        }
    }

    /**
     * Fetches the current devices's identifier which is registered in MAG server.
     */
    private void getDeviceIdentifier(final JSONArray args, final CallbackContext callbackContext) {
        MASDevice masDevice = MASDevice.getCurrentDevice();
        try {
            String deviceIdentifier = masDevice.getIdentifier();
            success(callbackContext, deviceIdentifier, false);
        } catch (Exception e) {
            Log.e(TAG, e.getMessage(), e);
            callbackContext.error(getError(e));
        }
    }

    /**
     * Fetches a device's registration state and identifier as JSON string.
     */
    private void getCurrentDevice(final JSONArray args, final CallbackContext callbackContext) {
        MASDevice masDevice = MASDevice.getCurrentDevice();
        try {
            JSONObject result = new JSONObject();
            result.put("isRegistered", masDevice.isRegistered());
            result.put("identifier", masDevice.getIdentifier());
            success(callbackContext, result, false);
        } catch (Exception e) {
            Log.e(TAG, e.getMessage(), e);
            callbackContext.error(getError(e));
        }
    }

    /**
     * Adds an attribute as name-value pair to the device's metadata.
     */
    private void addAttribute(final JSONArray args, final CallbackContext callbackContext) {
        String name = null;
        String value = null;
        try {
            name = args.optString(0, null);
            name = (name == null || name.trim().isEmpty()) ? null : name;
            value = args.optString(1);
            MASDevice.getCurrentDevice().addAttribute(name, value, new MASCallback<Void>() {
                @Override
                public void onSuccess(Void aVoid) {
                    success(callbackContext, "SUCCESS", false);
                }

                @Override
                public void onError(Throwable throwable) {
                    Throwable th = throwable;
                    if (throwable != null && throwable.getCause() instanceof MASDeviceAttributeOverflowException) {
                        th = new MASCordovaException("Attempt to create a new attribute has failed due to exceeded number of allowed attributes per device", throwable);
                    }
                    callbackContext.error(getError(th));
                }
            });
        } catch (Throwable e) {
            Log.e(TAG, e.getMessage(), e);
            callbackContext.error(getError(e));
        }
    }

    /**
     * Removes an attribute from the device's metadata.
     */
    private void removeAttribute(final JSONArray args, final CallbackContext callbackContext) {
        String name = null;
        try {
            name = args.optString(0, null);
            name = (name == null || name.trim().isEmpty()) ? null : name;
            MASDevice.getCurrentDevice().removeAttribute(name, new MASCallback<Void>() {
                @Override
                public void onSuccess(Void aVoid) {
                    success(callbackContext, "SUCCESS", false);
                }

                @Override
                public void onError(Throwable throwable) {
                    callbackContext.error(getError(throwable));
                }
            });
        } catch (Throwable e) {
            Log.e(TAG, e.getMessage(), e);
            callbackContext.error(getError(e));
        }
    }

    /**
     * Removes all attributes from the device's metadata.
     */
    private void removeAllAttributes(final JSONArray args, final CallbackContext callbackContext) {
        try {
            MASDevice.getCurrentDevice().removeAllAttributes(new MASCallback<Void>() {
                @Override
                public void onSuccess(Void aVoid) {
                    success(callbackContext, "SUCCESS", false);
                }

                @Override
                public void onError(Throwable throwable) {
                    callbackContext.error(getError(throwable));
                }
            });
        } catch (Throwable e) {
            Log.e(TAG, e.getMessage(), e);
            callbackContext.error(getError(e));
        }
    }

    /**
     * Fetch an attribute details of a device.
     */
    private void getAttribute(final JSONArray args, final CallbackContext callbackContext) {
        String name = null;
        try {
            name = args.optString(0, null);
            name = (name == null || name.trim().isEmpty()) ? null : name;
            MASDevice.getCurrentDevice().getAttribute(name, new MASCallback<JSONObject>() {
                @Override
                public void onSuccess(JSONObject jsonObject) {
                    success(callbackContext, jsonObject, false);
                }

                @Override
                public void onError(Throwable throwable) {
                    callbackContext.error(getError(throwable));
                }
            });
        } catch (Throwable e) {
            Log.e(TAG, e.getMessage(), e);
            callbackContext.error(getError(e));
        }
    }

    /**
     * Fetch all attribute details of a device.
     */
    private void getAttributes(final JSONArray args, final CallbackContext callbackContext) {
        try {
            MASDevice.getCurrentDevice().getAttributes(new MASCallback<JSONArray>() {
                @Override
                public void onSuccess(JSONArray jsonArray) {
                    success(callbackContext, jsonArray, false);
                }

                @Override
                public void onError(Throwable throwable) {
                    callbackContext.error(getError(throwable));
                }
            });
        } catch (Throwable e) {
            Log.e(TAG, e.getMessage(), e);
            callbackContext.error(getError(e));
        }
    }
}
