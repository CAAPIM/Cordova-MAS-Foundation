package com.ca.apim;

import android.content.Context;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.PrintWriter;
import java.io.StringWriter;

/**
 * Created by andy on 2016-05-25.
 */
public abstract class Command {

    String SUCCESS = "success";

    abstract void execute(Context context, JSONArray args, CallbackContext callbackContext);

    abstract String getAction();

    protected JSONObject getError(Throwable e) {
        JSONObject error = new JSONObject();
        try {
            error.put("errorCode", 1);
            error.put("errorMessage", e.getMessage());
            StringWriter errors = new StringWriter();
            e.printStackTrace(new PrintWriter(errors));
            error.put("errorInfo", errors.toString());
        } catch (JSONException ignore) {
        }
        return error;
    }



}
