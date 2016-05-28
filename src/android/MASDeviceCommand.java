package com.ca.apim;

import android.content.Context;

import com.ca.mas.foundation.Device;
import com.ca.mas.foundation.MASCallback;
import com.ca.mas.foundation.MASDevice;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;

/**
 * Created by andy on 2016-05-25.
 */
public class MASDeviceCommand {

    public static class DeregisterCommand extends Command{

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            Device masDevice = MASDevice.getCurrentDevice();
            masDevice.deregister(new MASCallback<Void>() {
                @Override
                public void onSuccess(Void aVoid) {
                    callbackContext.success(SUCCESS);
                }

                @Override
                public void onError(Throwable throwable) {
                    callbackContext.error(getError(throwable));
                }
            });
        }

        @Override
        public String getAction() {
            return "deregister";
        }
    }
}
