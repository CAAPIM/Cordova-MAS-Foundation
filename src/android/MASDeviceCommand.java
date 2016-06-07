/*
 * Copyright (c) 2016 CA, Inc.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

package com.ca.apim;

import android.content.Context;
import android.util.Log;

import com.ca.mas.foundation.Device;
import com.ca.mas.foundation.MASCallback;
import com.ca.mas.foundation.MASDevice;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;

public class MASDeviceCommand {

    private static final String TAG = MASDeviceCommand.class.getCanonicalName();


    public static class DeregisterCommand extends Command{

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {

            Device masDevice = MASDevice.getCurrentDevice();
            masDevice.deregister(new MASCallback<Void>() {
                @Override
                public void onSuccess(Void aVoid) {
                    success(callbackContext, true);
                }

                @Override
                public void onError(Throwable e) {
                    Log.e(TAG, e.getMessage(), e);
                    callbackContext.error(getError(e));
                }
            });
        }

        @Override
        public String getAction() {
            return "deregister";
        }
    }

    public static class IsRegisteredCommand extends Command{

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            try {
                Device masDevice = MASDevice.getCurrentDevice();
                if (masDevice.isRegistered()) {
                    PluginResult result = new PluginResult(PluginResult.Status.OK, true);
                    callbackContext.sendPluginResult(result);
                } else {
                    PluginResult result = new PluginResult(PluginResult.Status.OK, false);
                    callbackContext.sendPluginResult(result);
                }
            } catch (Exception e) {
                Log.e(TAG, e.getMessage(), e);
                callbackContext.error(getError(e));
            }
        }

        @Override
        public String getAction() {
            return "isRegistered";
        }
    }

    public static class ResetLocallyCommand extends Command{

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            Device masDevice = MASDevice.getCurrentDevice();
            try {
                masDevice.resetLocally();
                PluginResult result = new PluginResult(PluginResult.Status.OK, true);
                callbackContext.sendPluginResult(result);
            } catch (Exception e) {
                Log.e(TAG, e.getMessage(), e);
                PluginResult result = new PluginResult(PluginResult.Status.OK, false);
                callbackContext.sendPluginResult(result);
            }
        }

        @Override
        public String getAction() {
            return "resetLocally";
        }
    }
}
