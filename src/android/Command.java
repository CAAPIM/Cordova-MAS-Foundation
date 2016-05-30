package com.ca.apim;

import android.content.Context;

import com.ca.mas.core.error.MAGServerException;

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
        int errorCode = 0;
        String errorMessage = e.getMessage();
        if (e.getCause() != null && e.getCause() instanceof MAGServerException) {
            MAGServerException serverException = ((MAGServerException) e.getCause());
            errorCode = serverException.getErrorCode();
            errorMessage = serverException.getMessage();
        }
        JSONObject error = new JSONObject();
        try {
            error.put("errorCode", errorCode);
            error.put("errorMessage", errorMessage);
            StringWriter errors = new StringWriter();
            e.printStackTrace(new PrintWriter(errors));
            error.put("errorInfo", errors.toString());
        } catch (JSONException ignore) {
        }
        return error;
    }



}
