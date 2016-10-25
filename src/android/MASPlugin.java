/*
 * Copyright (c) 2016 CA, Inc.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

package com.ca.mas.cordova.core;

import android.app.Activity;
import android.app.DialogFragment;
import android.content.Context;
import android.util.Log;
import com.ca.mas.foundation.MAS;
import com.ca.mas.foundation.MASAuthenticationListener;
import com.ca.mas.foundation.MASOtpAuthenticationHandler;
import com.ca.mas.foundation.auth.MASAuthenticationProviders;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import java.util.HashMap;
import java.util.Map;

public class MASPlugin extends CordovaPlugin {

    private static final String TAG = MASPlugin.class.getCanonicalName();
    private static final Map<String, Command> commands = new HashMap();

    public static MASPlugin masPlugin;
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
        add(new MASCommand.GenerateAndSendOTPCommand());
        add(new MASCommand.ValidateOtpCommand());
        add(new MASCommand.setOTPAuthenticationListenerCommand());
        add(new MASCommand.setOTPChannelSelectorListenerCommand());
        add(new MASCommand.CancelOTPValidationCommand());
        add(new MASCommand.CancelGenerateAndSendOTPCommand());
        add(new MASCommand.GatewayIsReachableCommand());
        add(new MASCommand.UseNativeMASUICommand());

        add(new MASDeviceCommand.DeregisterCommand());
        add(new MASDeviceCommand.IsRegisteredCommand());
        add(new MASDeviceCommand.ResetLocallyCommand());
        add(new MASDeviceCommand.GetDeviceIdentifierCommand());
        add(new MASDeviceCommand.GetCurrentDeviceCommand());

        add(new MASUserCommand.LoginCommand());
        add(new MASUserCommand.LogoutUserCommand());
        add(new MASUserCommand.IsAuthenticatedCommand());
        add(new MASUserCommand.LoginWithImplicitFlowCommand());
        add(new MASUserCommand.GetCurrentUserCommand());
        add(new MASUserCommand.CompleteAuthenticationCommand());
        add(new MASUserCommand.CancelAuthenticationCommand());
        add(new MASUserCommand.GetUserNameCommand());
        add(new MASUserCommand.AuthorizeCommand());


        add(new MASApplicationCommand.GetIdentifierCommand());
        add(new MASApplicationCommand.GetNameCommand());
        add(new MASApplicationCommand.RetrieveEnterpriseAppsCommand());
        add(new MASApplicationCommand.LaunchAppCommand());
        add(new MASApplicationCommand.EnterpriseBrowserWebAppBackButtonHandlerCommand());

    }

    private static void add(Command command) {
        commands.put(command.getAction(), command);
    }


    private static DialogFragment getLoginFragment(long requestID, MASAuthenticationProviders providers) {
        try {
            Class c = Class.forName("com.ca.mas.ui.MASLoginFragment");
            return (DialogFragment) c.getMethod("newInstance", long.class, MASAuthenticationProviders.class).invoke(null, requestID, providers);
        } catch (Exception e) {
            return null;
        }
    }

    private static DialogFragment getOtpSelectDeliveryChannelFragment(MASOtpAuthenticationHandler handler) {
        try {
            Class c = Class.forName("com.ca.mas.ui.MASOtpSelectDeliveryChannelFragment");
            return (DialogFragment) c.getMethod("newInstance",  MASOtpAuthenticationHandler.class).invoke(null, handler);
        } catch (Exception e) {
            return null;
        }
    }


    @Override
    protected void pluginInitialize() {
        super.pluginInitialize();
        MAS.setAuthenticationListener(new MASAuthenticationListener() {
            @Override
            public void onAuthenticateRequest(Context context, long requestId, MASAuthenticationProviders providers){
                android.app.DialogFragment loginFragment = getLoginFragment(requestId,providers);
                loginFragment.show(((Activity) context).getFragmentManager(), "logonDialog");
            }

            @Override
            public void onOtpAuthenticateRequest(Context context, MASOtpAuthenticationHandler handler) {
                android.app.DialogFragment otpFragment = getOtpSelectDeliveryChannelFragment(handler);
                otpFragment.show(((Activity) context).getFragmentManager(), "OTPDialog");
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
        masPlugin = this;
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

    public static MASPlugin getCurrentInstance () {
        return getMasPlugin();
    }

    public static MASPlugin getMasPlugin() {
        return masPlugin;
    }

    public static void setMasPlugin(MASPlugin masPlugin) {
        MASPlugin.masPlugin = masPlugin;
    }


}

