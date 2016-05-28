package com.ca.apim;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import java.util.HashMap;
import java.util.Map;

public class MASPlugin extends CordovaPlugin{

    private static final String TAG=MASPlugin.class.getCanonicalName();

    private static final Map<String, Command> commands = new HashMap();

    static {
        add(new MASCommand.StartCommand());
        add(new MASCommand.GetFromPathCommand());
        add(new MASCommand.DeleteFromPathCommand());
        add(new MASCommand.PostToPathCommand());
        add(new MASCommand.PutToPathCommand());

        add(new MASDeviceCommand.DeregisterCommand());

        add(new MASUserCommand.LoginCommand());
        add(new MASUserCommand.LogOffUserCommand());
    }

    private static void add(Command command) {
        commands.put(command.getAction(), command);
    }

    @Override
    public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        Command command = commands.get(action);
        if (command != null) {
            command.execute(webView.getContext(), args, callbackContext);
            return true;
        } else {
            return false;
        }
    }


}

