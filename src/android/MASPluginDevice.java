/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */
package com.ca.mas.cordova.core;

import android.util.Log;

import com.ca.mas.foundation.Device;
import com.ca.mas.foundation.MASCallback;
import com.ca.mas.foundation.MASDevice;

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
            } else {
                callbackContext.error("Invalid action");
                return false;
            }
        }catch (Throwable th){
            callbackContext.error(getError(th));
        }
        return true;
    }

    /**
     * Deregisters a device from MAG server i.e. remove all registration info of this device on server
     */
    private void deregister(final JSONArray args, final CallbackContext callbackContext) {
        Device masDevice = MASDevice.getCurrentDevice();
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
            Device masDevice = MASDevice.getCurrentDevice();
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
        Device masDevice = MASDevice.getCurrentDevice();
        try {
            masDevice.resetLocally();
            success(callbackContext, true, false);
        } catch (Exception e) {
            Log.e(TAG, e.getMessage(), e);
            callbackContext.error(getError(e));
        }
    }

    /**
     *  Fetches the current devices's identifier which is registered in MAG server.
     */
    private void getDeviceIdentifier(final JSONArray args, final CallbackContext callbackContext) {
        Device masDevice = MASDevice.getCurrentDevice();
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
        Device masDevice = MASDevice.getCurrentDevice();
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
}
