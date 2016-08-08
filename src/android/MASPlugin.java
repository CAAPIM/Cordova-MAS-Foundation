/*
 * Copyright (c) 2016 CA, Inc.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

package com.ca.apim;

import android.app.Activity;
import android.app.DialogFragment;
import android.content.Context;
import android.util.Log;

import com.ca.mas.foundation.MAS;
import com.ca.mas.foundation.MASAuthenticationListener;
import com.ca.mas.foundation.MASConnectionListener;
import com.ca.mas.foundation.MASOtpAuthenticationHandler;
import com.ca.mas.foundation.auth.MASAuthenticationProviders;
import com.ca.mas.ui.MASLoginFragment;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import java.net.HttpURLConnection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MASPlugin extends CordovaPlugin {

    private static final String TAG = MASPlugin.class.getCanonicalName();

    private static final Map<String, Command> commands = new HashMap();

    static {
        add(new MASCommand.StartCommand());
        add(new MASCommand.StartWithDefaultConfigurationCommand());
        add(new MASCommand.StartWithJSONCommand());
        add(new MASCommand.StopCommand());
        add(new MASCommand.SetConfigFileNameCommand());
        add(new MASCommand.SetGrantFlowCommand());
        add(new MASCommand.GetFromPathCommand());
        add(new MASCommand.DeleteFromPathCommand());
        add(new MASCommand.PostToPathCommand());
        add(new MASCommand.PutToPathCommand());
        add(new MASCommand.CancelRequestCommand());
        add(new MASCommand.SetAuthenticationListenerCommand());

        add(new MASDeviceCommand.DeregisterCommand());
        add(new MASDeviceCommand.IsRegisteredCommand());
        add(new MASDeviceCommand.ResetLocallyCommand());

        add(new MASUserCommand.LoginCommand());
        add(new MASUserCommand.LogoutUserCommand());
        add(new MASUserCommand.IsAuthenticatedCommand());
        add(new MASUserCommand.CompleteAuthenticaionCommand());

    }

    private static void add(Command command) {
        commands.put(command.getAction(), command);
    }

    @Override
    protected void pluginInitialize() {
        super.pluginInitialize();
        MAS.setAuthenticationListener(new MASAuthenticationListener() {
            @Override
            public void onAuthenticateRequest(Context context, long requestId, MASAuthenticationProviders providers) {
                DialogFragment loginFragment = MASLoginFragment.newInstance(requestId, providers);
                loginFragment.show(((Activity)context).getFragmentManager(), "logonDialog");

            }

            @Override
            public void onOtpAuthenticateRequest(Context context, MASOtpAuthenticationHandler handler) {
                //ignore
            }
        });

        /* Enable below for debugging.
        MAS.setConnectionListener(new MASConnectionListener() {
            @Override
            public void onObtained(HttpURLConnection connection) {

            }

            @Override
            public void onConnected(HttpURLConnection connection) {
                Map<String, List<String>> request = connection.getRequestProperties();
                StringBuilder sb = new StringBuilder();
                sb.append("{").append(connection.getURL()).append("}");
                for (String key : request.keySet()) {
                    List<String> values = request.get(key);
                    if (values != null && !values.isEmpty()) {
                        sb.append("Request method: ").append(connection.getRequestMethod()).append("\n");
                        sb.append("{\"").append(key).append("\":");
                        sb.append("\"").append(values.get(0)).append("\"}");
                    }
                }
                Log.d(MASConnectionListener.class.getCanonicalName(), sb.toString());
            }
        });
        */
    }

    @Override
    public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {

        Command command = commands.get(action);
        if (command != null) {
            try {
                command.execute(webView.getContext(), args, callbackContext);
                return true;
            } catch (Throwable t) {
                Log.e(TAG, t.getMessage(), t);
                return false;
            }
        } else {
            Log.e(TAG, "Action not found: " + action);
            return false;
        }
    }


}

